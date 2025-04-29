// components/ChatDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import { formatDistanceToNow } from "date-fns";

const ChatDetail = () => {
  const { case_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await authenticatedFetch(
          `${API_BASE_URL}/chat/case/${case_id}/messages/`,
          { method: "GET" }
        );
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          console.error("Failed to load messages", res.status);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [case_id]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await authenticatedFetch(
        `${API_BASE_URL}/chat/case/${case_id}/send/`,
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text }),
        }
      );
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => [...prev, msg]);
        setText("");
      } else {
        console.error("Failed to send message", res.status);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-white p-4">Loading messages…</div>;

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.is_sent_by_user ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.is_sent_by_user ? 'bg-blue-600 text-white' : 'bg-black/40 text-white'}`}>
              {msg.voice_note && (
                <audio controls className="w-full">
                  <source src={msg.voice_note} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {msg.document && (
                <a href={msg.document} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                  View Document
                </a>
              )}
              {msg.image && (
                <img src={msg.image} alt="attachment" className="max-w-full rounded mt-2" />
              )}
              {msg.content && <p className="mt-2">{msg.content}</p>}
              <span className="text-xs text-gray-300 block mt-1">
                {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10 flex space-x-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 bg-black/30 p-2 rounded text-white"
          placeholder="Type a message…"
        />
        <button
          disabled={sending}
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ChatDetail;
