import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertCircle } from "lucide-react";
import { authenticatedFetch, isAuthenticated } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";

const NotificationBell = ({ pollingInterval = 10000, timeoutDuration = 3000 }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
  }, []);

  const fetchWithTimeout = useCallback((url, options = {}, timeout = timeoutDuration) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return authenticatedFetch(url, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(id));
  }, [timeoutDuration]);

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
      if (typeof unread_count === "number") {
        setUnreadCount(unread_count);
      }
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("Notification fetch timed out");
      } else {
        console.error("Notification fetch error:", err.message);
        setError("Failed to fetch notifications");
      }
      setIsPolling(false);
    }
  }, [fetchWithTimeout, isPolling, isUserAuthenticated]);

  const restartPolling = useCallback(() => {
    if (!isUserAuthenticated) return;
    setIsPolling(true);
    setError(null);
    fetchUnreadCount();
  }, [fetchUnreadCount, isUserAuthenticated]);

  useEffect(() => {
    if (!isUserAuthenticated || !isPolling) return;

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, pollingInterval);

    return () => {
      clearInterval(intervalId);
      console.log("Stopped polling notifications");
    };
  }, [fetchUnreadCount, isPolling, isUserAuthenticated, pollingInterval]);

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
        <div
          className="absolute -bottom-2 -right-2"
          title="Click to retry"
          onClick={restartPolling}
        >
          <AlertCircle className="text-red-500 cursor-pointer animate-pulse" size={16} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
