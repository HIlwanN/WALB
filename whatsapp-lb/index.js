const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Daftar endpoint bot backend
const bots = [
  'http://bot-backend1:3001/send',
  'http://bot-backend2:3002/send',
  'http://bot-backend3:3003/send'
];
let current = 0;

app.post('/forward', async (req, res) => {
  const botUrl = bots[current];
  current = (current + 1) % bots.length;
  try {
    const response = await axios.post(botUrl, req.body);
    res.json({ reply: response.data.reply });
  } catch (err) {
    res.status(500).send('Error forwarding to bot');
  }
});

app.listen(8080, () => console.log('Load balancer running on port 8080')); 