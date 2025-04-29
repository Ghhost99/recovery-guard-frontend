import React, { useState, useEffect } from "react";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const MessageDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedMessages, setGroupedMessages] = useState({});
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await authenticatedFetch(
          `${API_BASE_URL}/chat/messages/`,
          { method: "GET" }
        );
        
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          
          // Group messages by case
          const grouped = data.reduce((groups, message) => {
            const caseId = message.case;
            if (!groups[caseId]) {
              groups[caseId] = {
                caseId,
                caseTitle: message.case_title || `Case #${caseId}`,
                messages: []
              };
            }
            groups[caseId].messages.push(message);
            return groups;
          }, {});
          
          setGroupedMessages(grouped);
          setError(null);
        } else {
          const errorData = await res.json();
          setError(errorData.detail || "Failed to load messages");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Network error when fetching messages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up polling
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Get the current user ID
  const currentUserId = parseInt(localStorage.getItem("userId"));
  
  // Count unread messages
  const countUnread = (caseMessages) => {
    return caseMessages.filter(msg => 
      msg.receiver === currentUserId && !msg.is_read
    ).length;
  };
  
  // Get the latest message from each case
  const getLatestMessage = (caseMessages) => {
    return caseMessages.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )[0];
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {!loading && Object.keys(groupedMessages).length === 0 && (
        <div className="text-center text-gray-500 py-12 border rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">No messages found</h3>
          <p className="mt-1">You don't have any messages yet.</p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(groupedMessages).map((caseGroup) => {
          const latestMessage = getLatestMessage(caseGroup.messages);
          const unreadCount = countUnread(caseGroup.messages);
          
          return (
            <Link 
              key={caseGroup.caseId}
              to={`/cases/${caseGroup.caseId}/messages`}
              className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 border-b relative">
                <h3 className="text-lg font-semibold truncate">{caseGroup.caseTitle}</h3>
                {unreadCount > 0 && (
                  <span className="absolute right-4 top-4 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">
                    {latestMessage.sender === currentUserId 
                      ? "You" 
                      : latestMessage.sender_details?.full_name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(latestMessage.timestamp), { addSuffix: true })}
                  </span>
                </div>
                
                {latestMessage.subject && (
                  <div className="text-sm font-medium mb-1">{latestMessage.subject}</div>
                )}
                
                <p className="text-sm text-gray-600 truncate">
                  {latestMessage.content || (
                    <span className="italic">
                      {latestMessage.attachment_type === 'image' && "Sent an image"}
                      {latestMessage.attachment_type === 'document' && "Sent a document"}
                      {latestMessage.attachment_type === 'voice_note' && "Sent a voice note"}
                      {!latestMessage.attachment_type && "Empty message"}
                    </span>
                  )}
                </p>
                
                <div className="flex items-center mt-2 space-x-2">
                  {latestMessage.attachment_type === 'image' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      Image
                    </span>
                  )}
                  
                  {latestMessage.attachment_type === 'document' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      Document
                    </span>
                  )}
                  
                  {latestMessage.attachment_type === 'voice_note' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      Voice
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MessageDashboard;