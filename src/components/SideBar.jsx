import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Folder,
  MessageCircle,
  Settings,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { label: "Submit New Case", path: "/start-recovery", icon: <FileText className="w-6 h-6" /> },
    { label: "My Case History", path: "/case-history", icon: <Folder className="w-6 h-6" /> },
    { label: "Support", path: "/socials", icon: <MessageCircle className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Drag logic with touch support
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    let isDragging = false;
    let startX, startY;

    // Mouse event handlers
    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX - position.x;
      startY = e.clientY - position.y;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - startX, y: e.clientY - startY });
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    // Touch event handlers
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX - position.x;
        startY = touch.clientY - position.y;
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd);
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault(); // Prevent scrolling while dragging
      const touch = e.touches[0];
      setPosition({ x: touch.clientX - startX, y: touch.clientY - startY });
    };

    const onTouchEnd = () => {
      isDragging = false;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    // Add event listeners
    button.addEventListener("mousedown", onMouseDown);
    button.addEventListener("touchstart", onTouchStart);

    // Clean up
    return () => {
      button.removeEventListener("mousedown", onMouseDown);
      button.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [position]);

  return (
    <div className="relative z-50">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Floating Draggable Button (Mobile Only) */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={(e) => {
            // Only toggle if not dragging
            if (!e.target.dragging) {
              toggleSidebar();
            }
          }}
          className="lg:hidden fixed z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all touch-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: "grab",
          }}
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed inset-y-0 left-0 w-64 p-4 h-screen bg-black/60 backdrop-blur-md text-white border-r border-white/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:block`}
      >
        {/* Close Button */}
        <div className="lg:hidden flex justify-end mb-4 ">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:scale-105 hover:shadow-glow transition"
            aria-label="Close Sidebar"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul>
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index} className="mb-4">
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-4 px-4 py-2 w-full text-left rounded-lg border border-transparent
                    transition-all duration-200
                    ${isActive
                      ? "bg-blue-700 border-white/20"
                      : "hover:bg-blue-600 hover:border-white/10"}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;