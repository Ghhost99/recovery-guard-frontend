import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";

const CaseHistory = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await authenticatedFetch(`${API_BASE_URL}/cases/`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Case history data:", data);

        // Handle different possible response structures
        if (Array.isArray(data)) {
          setCases(data);
        } else if (data.cases && Array.isArray(data.cases)) {
          setCases(data.cases);
        } else if (data.results && Array.isArray(data.results)) {
          setCases(data.results);
        } else {
          console.warn("Unexpected data structure:", data);
          setCases([]);
        }
      } catch (err) {
        console.error("Failed to fetch case history:", err);
        setError(err.message);
        
        // If it's an auth error, redirect to login
        if (err.message.includes("401") || err.message.includes("403")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [navigate]);

  const filteredCases = cases.filter((item) => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
      (item.case_id && item.case_id.toLowerCase().includes(search.toLowerCase())) ||
      (item.id && item.id.toString().toLowerCase().includes(search.toLowerCase()));

    const matchesDate = selectedDate
      ? format(new Date(item.created_at || item.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true;

    return matchesSearch && matchesDate;
  });

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "resolved":
      case "closed":
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
      case "waiting":
        return "bg-yellow-100 text-yellow-700";
      case "in progress":
      case "in_progress":
      case "active":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";
      case "open":
      case "new":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Case History</h1>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading case history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Case History</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading case history: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Case History</h1>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <input
          type="text"
          placeholder="Search by title or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full lg:w-64 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="relative">
          <button
            onClick={() => setSelectedDate(null)}
            className="text-sm text-blue-600 underline mr-2 hover:text-blue-800"
          >
            Clear Date
          </button>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-2"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredCases.length > 0 ? (
          <>
            Showing {filteredCases.length} of {cases.length} case{cases.length !== 1 ? 's' : ''}
          </>
        ) : cases.length > 0 ? (
          "No cases match your filters"
        ) : (
          "No cases found"
        )}
      </div>

      {/* Case List */}
      <div className="grid gap-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div
              key={c.id || c.case_id}
              className="p-4 border border-gray-300 rounded-lg shadow-md bg-white flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/case/${c.id || c.case_id}`)}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1">
                  {c.title || c.case_title || "Untitled Case"}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  ID: {c.case_id || c.id}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {format(new Date(c.created_at || c.date), "MMM dd, yyyy")}
                </p>
                {c.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(c.status)}`}
                >
                  {c.status || "Unknown"}
                </span>
                {c.case_type && (
                  <span className="text-xs text-gray-500 capitalize">
                    {c.case_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg mb-2">No cases yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Your case history will appear here once you create your first case.
            </p>
            <button
              onClick={() => navigate("/create-case")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Case
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No cases match your search criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedDate(null);
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Load More Button (if pagination is needed) */}
      {cases.length > 0 && cases.length % 20 === 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              // Implement pagination logic here
              console.log("Load more cases");
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Load More Cases
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseHistory;