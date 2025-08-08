import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import { redirectIfIncomplete } from "../utils/navigation";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const runRedirect = async () => {
      await redirectIfIncomplete('/coming-soon', false);
    };
    runRedirect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    authenticatedFetch(`${API_BASE_URL}/dashboard/`, {
      method: "POST", 
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("Dashboard resData:", resData);
        // Updated validation for new data structure
        if (resData?.stats && resData?.progress && Array.isArray(resData?.activity)) {
          setData(resData);
        } else {
          console.error("Invalid response structure", resData);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!data) {
        console.warn("Dashboard timed out. Redirecting.");
        navigate("/");
      }
    }, 7000);
    return () => clearTimeout(timeout);
  }, [data, navigate]);

  if (!data) {
    return (
      <div className="text-white p-10 text-center">
        <span className="animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-black/30 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-6 py-4 bg-black/30 border-b border-white/10 shadow-lg">
            {/* Display user role if available */}
            {data?.user_role && (
              <div className="text-sm text-gray-300 capitalize">
                Role: {data.user_role}
              </div>
            )}
          </header>

          <main className="p-4 sm:p-6 space-y-6 overflow-y-auto">
            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {data?.stats?.length ? (
                data.stats.map((stat, index) => (
                  <Link
                    key={`${stat.label}-${index}`}
                    to={`/${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="p-4 bg-black/30 rounded-xl border border-white/20 shadow-md backdrop-blur-lg hover:scale-[1.02] transition"
                  >
                    <p className="text-sm text-gray-300">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </Link>
                ))
              ) : (
                <p>No stats available.</p>
              )}
            </section>

            {/* Summary Section - New */}
            {data?.summary && (
              <section className="bg-black/30 rounded-xl p-4 sm:p-6 border border-white/20 shadow backdrop-blur-lg">
                <h2 className="text-xl font-semibold mb-4">Case Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Case Types */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Case Types</h3>
                    <div className="space-y-2">
                      {Object.entries(data.summary.case_types).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Breakdown */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Status Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(data.summary.status_breakdown).map(([status, count]) => (
                        <div key={status} className="flex justify-between text-sm">
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Progress */}
            <section className="bg-black/30 rounded-xl p-4 sm:p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Case Progress</h2>
              {data?.progress?.steps?.length ? (
                <>
                  <div className="flex flex-wrap justify-between text-sm font-semibold gap-4">
                    {data.progress.steps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full ${
                            idx <= data.progress.currentStepIndex
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="mt-2 text-center text-xs">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${
                          ((data.progress.currentStepIndex + 1) /
                            data.progress.steps.length) *
                          100
                        }%`,
                      }}
                      role="progressbar"
                      aria-valuenow={data.progress.currentStepIndex + 1}
                      aria-valuemin="0"
                      aria-valuemax={data.progress.steps.length}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-400 text-center">
                    Step {data.progress.currentStepIndex + 1} of {data.progress.steps.length}
                  </div>
                </>
              ) : (
                <p>No progress data available.</p>
              )}
            </section>

            {/* Activity */}
            <section className="bg-black/30 rounded-xl p-4 sm:p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {data?.activity?.length ? (
                <ul className="space-y-3 text-sm">
                  {data.activity.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      {item.icon && <span className="mt-0.5">{item.icon}</span>}
                      <div className="flex-1">
                        <span>{item.message}</span>
                        {item.detail && <span className="font-semibold"> {item.detail}</span>}
                        {item.time && (
                          <span className="text-xs text-gray-400 ml-2">
                            ({item.time})
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Activities will appear here once you start creating cases.
                  </p>
                </div>
              )}
            </section>

            {/* Upload Section */}
            <section className="bg-black/30 rounded-xl p-4 sm:p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <Link
                to="/upload"
                className="block border-2 border-dashed border-gray-500 p-6 sm:p-10 rounded-lg text-center hover:border-blue-400 transition cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="text-4xl">📁</div>
                  <p className="mb-2">Drag & Drop files here</p>
                  <p className="text-sm text-gray-400">
                    Allowed formats: PDF, JPG, PNG
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to browse files
                  </p>
                </div>
              </Link>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
