import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.jpg";
import NotificationBell from "./Notification";
import { isAuthenticated, logout } from "../utils/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const authNavItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Submit Case", path: "/submit-case" },
    { label: "My Cases", path: "/cases" },
    { label: "Support", path: "/support" },
    { label: "FAQ", path: "/faq" },
    { label: "Logout", path: "/logout", onClick: handleLogout },
  ];

  const guestNavItems = [
    { label: "Home", path: "/" },
    { label: "FAQ", path: "/faq" },
    { label: "Login", path: "/login" },
    { label: "SignUp", path: "/signup" },
  ];

  const navItems = isAuthenticated() ? authNavItems : guestNavItems;

  const renderButton = (item) => (
    <button
      key={item.label}
      onClick={() => {
        item.onClick ? item.onClick() : handleNavigate(item.path);
      }}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-blue-600 transition w-full text-left md:w-auto md:text-center"
    >
      {item.label}
    </button>
  );

  return (
    <nav className="bg-transparent backdrop-blur-md text-white p-4 flex justify-between items-center border-black bg-black/70 border-2 shadow-md relative z-50">
      {/* Logo */}
      <div className="flex flex-row-reverse items-center justify-between">
        <h1
          className="text-xl font-bold cursor-pointer mr-4"
          onClick={() => handleNavigate("/")}
        >
          Safe Trust Recovery
        </h1>
        <img src={logoImage} alt="Recovery Guard" className="max-h-10 w-auto" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.label}>{renderButton(item)}</li>
          ))}
        </ul>
        {isAuthenticated() && (
          <div className="ml-4">
            <NotificationBell />
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-gray-800 text-white shadow-lg rounded-lg md:hidden">
          <ul className="flex flex-col space-y-2 px-2 py-2">
            {navItems.map((item) => (
              <li key={item.label}>{renderButton(item)}</li>
            ))}
            {isAuthenticated() && (
              <li className="flex justify-center">
                <NotificationBell />
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
