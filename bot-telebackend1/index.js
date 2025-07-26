const express = require('express');
const app = express();
app.use(express.json());

// Ganti namaBot sesuai instance (misal: bot1, bot2, bot3)
const namaBot = process.env.BOT_NAME || 'bot1';
const port = process.env.PORT || 3001;

app.post('/send', (req, res) => {
  const { sender, text } = req.body;
  console.log(`[${namaBot}] Pesan diterima dari ${sender}: ${text}`);
  res.json({ reply: `ini bro ${namaBot}` });
});

app.listen(port, () => {
  console.log(`${namaBot} listening on port ${port}`);
}); 