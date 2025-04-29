import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import CaseMessages from "./CaseMessages";

const CaseMessageContainer = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const res = await authenticatedFetch(
          `${API_BASE_URL}/cases/${caseId}/`,
          { method: "GET" }
        );
        
        if (res.ok) {
          const data = await res.json();
          setCaseDetails(data);
          setError(null);
        } else {
          const errorData = await res.json();
          setError(errorData.detail || "Failed to load case details");
          if (res.status === 404 || res.status === 403) {
            // Navigate away if case doesn't exist or user doesn't have access
            setTimeout(() => navigate("/messages"), 3000);
          }
        }
      } catch (err) {
        console.error("Error fetching case details:", err);
        setError("Network error when fetching case details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseDetails();
  }, [caseId, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/messages")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            {loading ? (
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <h1 className="text-xl font-semibold">
                {caseDetails?.title || `Case #${caseId}`}
              </h1>
            )}
          </div>
          
          {caseDetails && (
            <div className="text-sm text-gray-500">
              {caseDetails.status && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  caseDetails.status === 'Open' ? 'bg-green-100 text-green-800' :
                  caseDetails.status === 'Closed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {caseDetails.status}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {!error && <CaseMessages caseId={caseId} />}
      </div>
    </div>
  );
};

export default CaseMessageContainer;