import React, { useState } from "react";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";

const MessageForm = ({ caseId, onMessageSent }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  
  // Handle file selection for image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setImage(file);
      setError("");
    }
  };
  
  // Handle file selection for document
  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check valid extensions
      const validExts = ['pdf', 'docx', 'xlsx', 'pptx', 'txt'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!validExts.includes(fileExt)) {
        setError(`Document must be one of: ${validExts.join(', ')}`);
        return;
      }
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Document must be less than 10MB");
        return;
      }
      setDocument(file);
      setError("");
    }
  };
  
  // Start voice recording
  const startRecording = () => {
    setError("");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        const audioChunks = [];
        
        recorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        
        recorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
          setVoiceNote(audioBlob);
        });
        
        recorder.start();
        setIsRecording(true);
        setMediaRecorder(recorder);
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
        setError("Could not access microphone. Please check your browser permissions.");
      });
  };
  
  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image && !document && !voiceNote) {
      setError("Please enter a message or attach a file");
      return;
    }
    
    setSending(true);
    setError("");
    
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("content", content);
    
    if (image) formData.append("image", image);
    if (document) formData.append("document", document);
    if (voiceNote) formData.append("voice_note", voiceNote, "voice_note.ogg");
    
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/chat/case/${caseId}/send/`,
        {
          method: "POST",
          body: formData
        }
      );
      
      if (response.ok) {
        const newMessage = await response.json();
        // Clear form
        setSubject("");
        setContent("");
        setImage(null);
        setDocument(null);
        setVoiceNote(null);
        
        // Notify parent component
        if (onMessageSent) onMessageSent(newMessage);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Network error when sending message");
    } finally {
      setSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <input
          type="text"
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <textarea
          placeholder="Type your message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Image attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {image && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500">{image.name}</span>
              <button 
                type="button"
                onClick={() => setImage(null)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        {/* Document attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Document</label>
          <input
            type="file"
            accept=".pdf,.docx,.xlsx,.pptx,.txt"
            onChange={handleDocumentChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {document && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500">{document.name}</span>
              <button 
                type="button"
                onClick={() => setDocument(null)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        {/* Voice note recording */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Voice Note</label>
          <div className="mt-1 flex items-center">
            {!isRecording && !voiceNote && (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Record
              </button>
            )}
            
            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Stop Recording
              </button>
            )}
            
            {voiceNote && !isRecording && (
              <div className="flex items-center">
                <audio controls className="h-10">
                  <source src={URL.createObjectURL(voiceNote)} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
                <button 
                  type="button"
                  onClick={() => setVoiceNote(null)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {sending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageForm;