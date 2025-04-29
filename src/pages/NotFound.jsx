import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl mt-4">Page Not Found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-800 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
