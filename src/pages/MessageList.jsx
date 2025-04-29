// components/MessageList.jsx
import React, { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import { formatDistanceToNow } from "date-fns";
import {redirectIfIncomplete} from "../utils/navigation"
const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect((
    
  )=>{
    redirectIfIncomplete('/coming-soon',true)
  },[])
  useEffect(() => {
    let isMounted = true;

    const fetchSent = async () => {
      try {
        const res = await authenticatedFetch(
          `${API_BASE_URL}/chat/messages`,
          { method: "GET" }
        );
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          setError(false);
        } else {
          console.error("Failed to load sent messages", res.status);
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching sent messages:", err);
        setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSent();
    const interval = setInterval(fetchSent, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      {loading && <div className="text-white">Loading sent messages…</div>}
      {error && <div className="text-red-500">Failed to load messages. Displaying last known data.</div>}
      {messages.map(msg => (
        <div key={msg.id} className="bg-black/30 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">
              {msg.case_title || `Case #${msg.case}`}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-2 text-white">{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
