import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const mockCases = [
  {
    id: "C-1001",
    title: "Missing Document Recovery",
    date: "2024-12-01",
    status: "Resolved",
  },
  {
    id: "C-1002",
    title: "Bank Account Freeze",
    date: "2024-12-05",
    status: "Pending",
  },
  {
    id: "C-1003",
    title: "Unauthorized Withdrawal",
    date: "2024-12-07",
    status: "In Progress",
  },
];

const CaseHistory = () => {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Simulate fetching from API
    setCases(mockCases);
  }, []);

  const filteredCases = cases.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesDate = selectedDate
      ? format(new Date(item.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true;

    return matchesSearch && matchesDate;
  });

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
          className="px-4 py-2 w-full lg:w-64 border border-gray-300 rounded-lg shadow-sm"
        />

        <div className="relative">
          <button
            onClick={() => setSelectedDate(null)}
            className="text-sm text-blue-600 underline mr-2"
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

      {/* Case List */}
      <div className="grid gap-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className="p-4 border border-gray-300 rounded-lg shadow-md bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{c.title}</h2>
                <p className="text-sm text-gray-600">
                  ID: {c.id} | Date: {c.date}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                ${c.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : c.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
              >
                {c.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No cases found.</p>
        )}
      </div>
    </div>
  );
};

export default CaseHistory;
