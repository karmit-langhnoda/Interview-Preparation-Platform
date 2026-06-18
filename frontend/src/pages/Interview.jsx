import { useEffect, useRef, useState } from 'react';
import InterviewSetup from '../components/Interview/InterviewSetup';
import InterviewChat from '../components/Interview/InterviewChat';
import {
  startInterview,
  sendInterviewMessage,
  endInterview,
  clearInterviewOnLogout
} from '../api/interviewApi';

const Interview = () => {
  const [session, setSession] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const sessionIdRef = useRef(null);

  useEffect(() => {
    sessionIdRef.current = session?.sessionId || null;
  }, [session?.sessionId]);

  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        clearInterviewOnLogout().catch(() => {});
      }
    };
  }, []);

  const handleStart = async (payload) => {
    setError('');
    setStarting(true);

    try {
      const res = await startInterview(payload);
      const data = res.data.data;
      setSession({
        sessionId: data.sessionId,
        messages: [data.reply]
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to start interview. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async (message) => {
    const res = await sendInterviewMessage(session.sessionId, { message });
    const reply = res.data.data.reply;
    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', content: message }, reply]
    }));
  };

  const handleEnd = async () => {
    await endInterview(session.sessionId);
    setSession(null);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!session ? (
        <InterviewSetup onStart={handleStart} loading={starting} />
      ) : (
        <InterviewChat session={session} onSend={handleSend} onEnd={handleEnd} />
      )}
    </div>
  );
};

export default Interview;