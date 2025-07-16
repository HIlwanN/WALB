const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const bots = [
  'http://bot1:3000',
  'http://bot2:3000',
  'http://bot3:3000',
  'http://baileys-bot:3000'
];

let current = 0;

app.post('/send', async (req, res) => {
  const target = bots[current];
  current = (current + 1) % bots.length;

  try {
    const response = await axios.post(`${target}/send`, req.body);
    res.json({ target, response: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Bot error', details: err.message });
  }
});

app.listen(8080, () => {
  console.log('Load balancer listening on port 8080');
});
