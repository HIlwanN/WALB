const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/send', (req, res) => {
  console.log(`[${process.env.BOT_ID}] menerima pesan:`, req.body);
  res.json({ status: 'Pesan diterima', bot: process.env.BOT_ID });
});

app.listen(PORT, () => {
  console.log(`Bot ${process.env.BOT_ID} berjalan di port ${PORT}`);
});
