import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.post('/api/plan', async (req, res) => {
  try {
    const { messages, model = process.env.OPENAI_MODEL || 'gpt-5-code' } = req.body;

    
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.8,
      response_format: { type: "json_object" } 
    });

    const content = completion.choices?.[0]?.message?.content || '{}';
    res.json({ ok: true, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 5173;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
