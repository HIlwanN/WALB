const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Ganti dengan token bot Telegram kamu
const token = process.env.TELEGRAM_BOT_TOKEN || '8496833085:AAGz-GazNxgOLQowhd8BE4xdN2hdmJNiu5U';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log('Pesan masuk:', text, 'dari', chatId);

          try {
    const response = await axios.post('http://tele-lb:8080/forward', {
      sender: chatId,
      text
    });
    await bot.sendMessage(chatId, response.data.reply);
  } catch (err) {
    console.error('Gagal forward ke load balancer:', err.message);
    await bot.sendMessage(chatId, 'Maaf, terjadi error pada sistem bot.');
  }
});

app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
