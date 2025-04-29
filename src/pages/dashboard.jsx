import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import Sidebar from "../components/SideBar";
import { Bell, UserCircle } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import NotificationBell from "../components/Notification";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

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
        console.log("Dashboard resData:", resData); // Log for structure check

        if (resData?.stats && resData?.progress && resData?.activity) {
          setData(resData); // ✅ This line was missing
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

  // Fallback timeout: auto-redirect if it hangs
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!data) {
        console.warn("Dashboard timed out. Redirecting.");
        navigate("/login");
      }
    }, 7000);
    return () => clearTimeout(timeout);
  }, [data, navigate]);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-black/30 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-6 py-4 bg-black/30 border-b border-white/10 shadow-lg">
            <div className="flex items-center space-x-6">
              <div className="text-xl font-bold">RecoveryGuard</div>
              <nav className="hidden md:flex space-x-4 text-sm">
                <Link to="/" className="hover:text-blue-400">Home</Link>
                <Link to="/start-recovery" className="hover:text-blue-400">Submit Case</Link>
                <Link to="/my-cases" className="hover:text-blue-400">My Cases</Link>
                <Link to="/support" className="hover:text-blue-400">Support</Link>
                <Link to="/faq" className="hover:text-blue-400">FAQ</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <button className="relative hover:text-blue-400">
                <NotificationBell className="w-8 h-8" />
              </button>
              <div className="relative">
                <UserCircle className="w-8 h-8 hover:text-blue-400 cursor-pointer" />
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6 overflow-y-auto">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.stats.map((stat, i) => (
                <Link
                  key={i}
                  to={`/${stat.label}`}  // Link for each stat
                  className="p-4 bg-black/30 rounded-xl border border-white/20 shadow-md backdrop-blur-lg hover:scale-[1.02] transition"
                >
                  <p className="text-sm text-gray-300">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </Link>
              ))}
            </section>

            <section className="bg-black/30 rounded-xl p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Case Progress</h2>
              <div className="flex items-center justify-between text-sm font-semibold">
                {data.progress.steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full ${idx <= data.progress.currentStepIndex ? "bg-blue-500" : "bg-gray-500"}`} />
                    <span className="mt-2">{step}</span>
                  </div>
                ))}
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${((data.progress.currentStepIndex + 1) / data.progress.steps.length) * 100}%` }}
                />
              </div>
            </section>

            <section className="bg-black/30 rounded-xl p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <ul className="space-y-3 text-sm">
                {data.activity.map((item, i) => (
                  <li key={i}>
                    {item.icon} {item.message}
                    {item.detail && <b> {item.detail}</b>}{" "}
                    <span className="text-xs text-gray-400">({item.time})</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-black/30 rounded-xl p-6 border border-white/20 shadow backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <Link to="/upload" className="border-2 border-dashed border-gray-500 p-10 rounded-lg text-center hover:border-blue-400 transition cursor-pointer">
                <p className="mb-2">Drag & Drop files here</p>
                <p className="text-sm text-gray-400">Allowed formats: PDF, JPG, PNG</p>
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
