import { useState } from 'react';

const InterviewChat = ({ session, onSend, onEnd }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setError('');
    setSending(true);

    try {
      await onSend(message);
      setMessage('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send your answer. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Interview Chat</h2>
        <button onClick={onEnd} className="px-4 py-2 rounded-lg bg-red-500 text-white">
          End Interview
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {session?.messages?.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-[85%] ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type your answer..."
          disabled={sending}
        />
        <button disabled={sending} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default InterviewChat;