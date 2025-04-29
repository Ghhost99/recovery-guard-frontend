import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../utils/Setup";

// Create context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (token && userId) {
        try {
          // Verify token validity
          const response = await fetch(`${API_BASE_URL}/auth/verify/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            // Get user details
            const userResponse = await fetch(`${API_BASE_URL}/accounts/users/${userId}/`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
            } else {
              // User not found or token invalid
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              setUser(null);
            }
          } else {
            // Token invalid
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Invalid credentials");
      }
      
      const data = await response.json();
      localStorage.setItem("token", data.access);
      
      // Get user ID from token payload
      const payload = JSON.parse(atob(data.access.split(".")[1]));
      localStorage.setItem("userId", payload.user_id);
      
      // Get user details
      const userResponse = await fetch(`${API_BASE_URL}/accounts/users/${payload.user_id}/`, {
        headers: {
          "Authorization": `Bearer ${data.access}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: "Failed to get user details" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Component to require authentication
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};