const crypto = require('crypto');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const QRCode = require('qrcode');
const axios = require('axios');

const app = express();
const port = 3000;

let currentQR = '';

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('connection.update', (update) => {
    const { qr, connection } = update;

    if (qr) {
      console.log("QR updated");
      currentQR = qr;
    }

    if (connection === 'open') {
      console.log('✅ Bot terhubung ke WhatsApp');
    }

    if (connection === 'close') {
      console.log('❌ Koneksi tertutup, mencoba ulang...');
      startBot(); // Reconnect
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Handler balasan pesan otomatis
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message?.conversation) {
          const sender = msg.key.remoteJid;
          const text = msg.message.conversation;
          console.log('Pesan masuk:', text, 'dari', sender);

          // Kirim ke load balancer dan balas ke WhatsApp
          try {
            const response = await axios.post('http://whatsapp-lb:8080/forward', {
              sender,
              text
            });
            await sock.sendMessage(sender, { text: response.data.reply });
          } catch (err) {
            console.error('Gagal forward ke load balancer:', err.message);
            await sock.sendMessage(sender, { text: 'Maaf, terjadi error pada sistem bot.' });
          }
        }
      }
    }
  });
}

startBot();

// Serve QR code in browser
app.get('/qr', async (req, res) => {
  if (!currentQR) {
    return res.send('QR belum tersedia atau sudah expired');
  }

  try {
    const qrImage = await QRCode.toDataURL(currentQR);
    res.send(`<img src="${qrImage}" alt="Scan QR WhatsApp">`);
  } catch (err) {
    res.status(500).send('Gagal generate QR');
  }
});

app.listen(port, () => {
  console.log(`✅ Server QR berjalan di http://localhost:${port}/qr`);
});
