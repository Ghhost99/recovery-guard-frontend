import React, { useEffect, useState, useRef } from "react";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import { formatDistanceToNow } from "date-fns";
import MessageForm from "./MessageForm";

const CaseMessages = ({ caseId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await authenticatedFetch(
        `${API_BASE_URL}/chat/case/${caseId}/messages/`,
        { method: "GET" }
      );
      
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to load messages");
      }
    } catch (err) {
      setError("Network error when fetching messages");
      console.error("Error fetching case messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [caseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  // Get current user ID from localStorage
  const currentUserId = parseInt(localStorage.getItem("userId"));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <div className="text-center text-gray-500">Loading messages...</div>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}
        
        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div 
              className={`max-w-3/4 rounded-lg p-3 ${
                msg.sender === currentUserId 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="font-semibold text-sm">
                {msg.sender === currentUserId ? "You" : msg.sender_details?.full_name}
              </div>
              
              {msg.subject && <div className="font-medium">{msg.subject}</div>}
              
              <div className="mt-1">{msg.content}</div>
              
              {msg.image && (
                <div className="mt-2">
                  <img 
                    src={msg.image} 
                    alt="Message attachment" 
                    className="max-w-full rounded"
                  />
                </div>
              )}
              
              {msg.document && (
                <div className="mt-2">
                  <a 
                    href={msg.document} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm underline"
                  >
                    <svg 
                      className="w-4 h-4 mr-1" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    Document
                  </a>
                </div>
              )}
              
              {msg.voice_note && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={msg.voice_note} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              <div className="text-xs mt-1 opacity-75">
                {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <MessageForm caseId={caseId} onMessageSent={handleNewMessage} />
      </div>
    </div>
  );
};

export default CaseMessages;