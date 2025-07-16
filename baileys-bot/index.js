const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let sock;

async function connectWA() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  sock = makeWASocket({ auth: state });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') console.log('✅ WhatsApp connected!');
  });
}

connectWA();

app.post('/send', async (req, res) => {
  const { number, message } = req.body;

  try {
    const jid = number + '@s.whatsapp.net';
    await sock.sendMessage(jid, { text: message });
    res.json({ status: 'Sent', to: number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Baileys bot aktif di port ${PORT}`);
});
