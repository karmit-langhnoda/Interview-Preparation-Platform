import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SUBJECT_MAP = {
  oop: 'Object Oriented Programming (OOP)',
  os: 'Operating Systems',
  dbms: 'DBMS (Databases)',
  cn: 'Computer Networks'
};

const extractJson = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Groq returned empty content');
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in Groq content');
  }

  return JSON.parse(text.slice(start, end + 1));
};

export const generateQuizWithGroq = async (subjectKey) => {
  const subjectName = SUBJECT_MAP[subjectKey];

  if (!subjectName) {
    throw new Error('Invalid subject for quiz generation');
  }

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }

  const prompt = `
Generate a JSON object for a quiz.

Subject: ${subjectName}

Rules:
- Return exactly 15 questions
- 5 easy, 5 medium, 5 hard
- Each question must have exactly 4 options
- correctIndex must be 0, 1, 2, or 3
- Include a short explanation
- Output must be valid JSON only
- No markdown, no code fences, no extra text

Format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "difficulty": "easy",
      "explanation": "string"
    }
  ]
}
  `.trim();

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: 'You generate strict JSON quizzes for programming students.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: {
          type: 'json_object'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        timeout: 20000
      }
    );

    console.log(
      'Groq raw response (truncated):',
      JSON.stringify(response.data, null, 2).slice(0, 1200)
    );

    const content = response.data?.choices?.[0]?.message?.content || '';
    const parsed = typeof content === 'string' ? extractJson(content) : content;

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Groq quiz JSON does not contain "questions" array');
    }

    if (parsed.questions.length !== 15) {
      throw new Error(`Groq quiz must contain exactly 15 questions, got ${parsed.questions.length}`);
    }

    return parsed.questions;
  } catch (error) {
    if (error.response) {
      console.error('Groq API error status:', error.response.status);
      console.error('Groq API error data:', error.response.data);
    } else {
      console.error('Groq API error:', error.message);
    }

    throw new Error('Groq quiz generation failed');
  }
};