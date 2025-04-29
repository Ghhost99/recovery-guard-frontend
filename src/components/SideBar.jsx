import React, { useState } from "react";
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
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { label: "Dashboard Overview", path: "/", icon: <Home className="w-6 h-6" /> },
    { label: "Submit New Case", path: "/start-recovery", icon: <FileText className="w-6 h-6" /> },
    { label: "My Case History", path: "/my-cases", icon: <Folder className="w-6 h-6" /> },
    { label: "Messages/Support", path: "/support", icon: <MessageCircle className="w-6 h-6" /> },
    { label: "Settings", path: "/settings", icon: <Settings className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative z-50">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Hamburger for Mobile */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 border border-white/30 rounded-lg hover:scale-105 hover:shadow-glow transition"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 p-4 h-screen bg-black/60 backdrop-blur-md text-white border-r border-white/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:block`}
      >
        {/* Close Button (mobile only) */}
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
                    setIsOpen(false); // close on mobile
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
