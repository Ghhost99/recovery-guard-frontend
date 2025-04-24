import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertCircle } from "lucide-react";
import { authenticatedFetch, isAuthenticated } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount and when dependencies change
  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
  }, []);

  const fetchWithTimeout = useCallback((url, options = {}, timeout = 2000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return authenticatedFetch(url, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(id));
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!isPolling || !isUserAuthenticated) return;
    
    try {
      const res = await fetchWithTimeout(
        `${API_BASE_URL}/notification/count/`,
        { method: "GET" }
      );

      if (!res.ok) {
        console.warn("Unread count fetch returned status", res.status);
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const { unread_count } = await res.json();
      if (typeof unread_count === 'number') {
        setUnreadCount(unread_count);
      }
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("Unread count fetch timed out.");
      } else {
        console.error("Unread count fetch failed:", err);
        setError(err.message || "Failed to fetch notifications");
        alert(`Notification error: ${err.message || "Failed to fetch notifications"}`);
        setIsPolling(false);
      }
    }
  }, [fetchWithTimeout, isPolling, isUserAuthenticated]);

  const restartPolling = useCallback(() => {
    if (!isUserAuthenticated) return;
    setIsPolling(true);
    setError(null);
    fetchUnreadCount();
  }, [fetchUnreadCount, isUserAuthenticated]);

  useEffect(() => {
    if (!isUserAuthenticated) return;
    
    let intervalId = null;
    
    if (isPolling) {
      fetchUnreadCount();
      intervalId = setInterval(fetchUnreadCount, 10000);
    }

    return () => {
      clearInterval(intervalId);
      console.log("NotificationBell polling stopped or component unmounted");
    };
  }, [fetchUnreadCount, isPolling, isUserAuthenticated]);

  // Don't render the component if not authenticated
  if (!isUserAuthenticated) return null;

  return (
    <div className="relative">
      <div
        className="cursor-pointer relative"
        onClick={() => navigate("/notifications")}
      >
        <Bell className="text-white hover:text-blue-400" size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      
      {error && (
        <div className="absolute -bottom-2 -right-2">
          <AlertCircle 
            className="text-red-500 cursor-pointer" 
            size={16} 
            onClick={restartPolling}
            title="Click to restart notification polling"
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;