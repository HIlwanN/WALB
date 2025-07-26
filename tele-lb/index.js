const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/forward', async (req, res) => {
  const { text } = req.body;
  try {
    // Kirim pertanyaan ke Ollama
    const ollamaRes = await axios.post('http://host.docker.internal:11434/api/generate', {
      model: 'gemma3', // gunakan model gemma3
      prompt: text,
      stream: false
    });
    // Ambil jawaban dari Ollama
    const aiReply = ollamaRes.data.response;
    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error from AI model');
  }
});

app.listen(8080, () => console.log('Load balancer running on port 8080')); 