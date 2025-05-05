import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon1 from "../assets/img_12.GIF";
import API_BASE_URL from '../utils/Setup';

// Privacy Modal Component
const PrivacyModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 max-w-md w-full text-center">
        <h3 className="text-xl font-bold text-white mb-4">Join Our Waitlist</h3>
        
        <div className="my-4 text-gray-300 text-left">
          <p className="mb-2">By proceeding, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be added to our recovery service waitlist</li>
            <li>Receive updates about your case status</li>
            <li>Allow us to contact you regarding your recovery request</li>
          </ul>
          <p className="mt-4">We value your privacy and will never share your information with third parties.</p>
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmission = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/create-email-lead/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        // Close modal and navigate on success
        setIsModalOpen(false);
        navigate("/start-recovery");
      } else {
        // Handle error case
        console.error("Error submitting email");
        setIsModalOpen(false);
        // You could add error state handling here
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-16 text-left max-w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        {/* Left content */}
        <div className="w-full md:w-2/3">
          <p className="text-white text-lg mb-2">
            Get expert assistance in retrieving lost funds from scam, fraud,
            unauthorized transactions. Our secure, fast, and effective recovery
            process ensures you get the justice deserved. We've recovered over{" "}
            <span className="text-blue-400 font-semibold">$70 million</span> for
            fraud victims all across Spain. We can help you too.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Recover Your Lost Money with Confidence
          </h1>
      
        </div>
        {/* Right content */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0 flex justify-center items-center">
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={icon1}
              alt="Security Visualization"
              className="max-w-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      <PrivacyModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmSubmission}
      />
    </div>
  );
};

export default Hero;