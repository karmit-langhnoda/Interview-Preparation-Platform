import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const getInterviewReply = async (messages) => {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: process.env.GROQ_MODEL || 'llama3-8b-8192',
      messages,
      temperature: 0.4
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data?.choices?.[0]?.message;
};