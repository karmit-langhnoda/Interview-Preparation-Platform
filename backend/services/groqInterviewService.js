import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_FALLBACK_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const buildFallbackIntro = (subjects) => {
  const topicText = subjects?.length ? subjects.join(', ') : 'your chosen topics';

  return {
    role: 'assistant',
    content: `Hi, I am your interviewer today. We will keep this focused on ${topicText}. Please start by introducing yourself and giving a short overview of your background.`
  };
};

const buildFallbackFollowUp = (messages) => {
  const systemMessage = messages.find((message) => message.role === 'system')?.content || '';
  const subjectMatch = systemMessage.match(/Subjects:\s*(.+?)\./i);
  const subjectText = subjectMatch?.[1] || 'your chosen topics';

  return {
    role: 'assistant',
    content: `Thanks. Now, can you explain one important concept from ${subjectText} with a real-world example?`
  };
};

const buildPromptMessages = (messages) =>
  messages.map((message) => ({
    role: message.role,
    content: message.content
  }));

export const getInterviewIntro = async (subjects, difficulty) => {
  if (!process.env.GROQ_API_KEY) {
    return buildFallbackIntro(subjects);
  }

  const prompt = [
    {
      role: 'system',
      content:
        'You are a realistic technical interviewer. Start with a short greeting, ask the candidate to introduce themselves, and keep the first turn warm and conversational. Do not provide an answer, sample answer, or multiple questions.'
    },
    {
      role: 'user',
      content: `Start an interview for difficulty ${difficulty} on subjects: ${subjects.join(', ')}.`
    }
  ];

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_FALLBACK_MODEL,
        messages: prompt,
        temperature: 0.4
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const reply = response.data?.choices?.[0]?.message;

    if (!reply?.content) {
      return buildFallbackIntro(subjects);
    }

    return { role: 'assistant', content: reply.content };
  } catch (error) {
    console.error('Interview intro fallback:', error?.response?.data || error?.message || error);
    return buildFallbackIntro(subjects);
  }
};

export const getInterviewReply = async (messages) => {
  if (!process.env.GROQ_API_KEY) {
    return buildFallbackFollowUp(messages);
  }

  const promptMessages = buildPromptMessages(messages);

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_FALLBACK_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a realistic technical interviewer. Ask exactly one follow-up question at a time. Never provide a sample answer, never answer your own question, and never ask multiple questions in one turn.'
          },
          ...promptMessages
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const reply = response.data?.choices?.[0]?.message;

    if (!reply?.content) {
      return buildFallbackFollowUp(messages);
    }

    return { role: 'assistant', content: reply.content };
  } catch (error) {
    console.error('Interview Groq fallback:', error?.response?.data || error?.message || error);
    return buildFallbackFollowUp(messages);
  }
};