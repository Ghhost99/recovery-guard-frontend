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

    authenticatedFetch(`${API_BASE_URL}/auth/dashboard/`, {
      method: "POST", 
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("Dashboard resData:", resData);
        if (resData?.stats && resData?.progress && resData?.activity) {
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
          <header className="flex items-center justify-between px-6 py-4 bg-black/30 border-b border-white/10 shadow-lg" />

          <main className="p-4 sm:p-6 space-y-6 overflow-y-auto">
            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {data?.stats?.length ? (
                data.stats.map((stat) => (
                  <Link
                    key={stat.label}
                    to={`/${stat.label}`}
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
                        <span className="mt-2 text-center">{step}</span>
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
                    <li key={i}>
                      {item.icon} {item.message}
                      {item.detail && <b> {item.detail}</b>}{" "}
                      <span className="text-xs text-gray-400">
                        ({item.time})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent activity.</p>
              )}
            </section>

            {/* Upload Section */}
            <section className="bg-black/30 rounded-xl p-4 sm:p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <Link
                to="/upload"
                className="block border-2 border-dashed border-gray-500 p-6 sm:p-10 rounded-lg text-center hover:border-blue-400 transition cursor-pointer"
              >
                <p className="mb-2">Drag & Drop files here</p>
                <p className="text-sm text-gray-400">
                  Allowed formats: PDF, JPG, PNG
                </p>
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
