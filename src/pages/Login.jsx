import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const endpoint = "/api/auth/login/";

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Login successful", data);
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem('userId', data.userId);
        setMessage("Logged in successfully. Redirecting to Dashboard");
        setTimeout(()=>{
          window.location.href='/dashboard'
        },2000)
        
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <>

    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-white text-2xl font-bold tracking-wide">Login</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="w-full p-3 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-white transition"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className="w-full p-3 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50 focus:outline-none focus:border-white transition"
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-white text-black font-semibold rounded-xl shadow-md hover:shadow-white transition"
        >
          Login
        </button>
        {message && <p className="text-white text-sm text-center">{message}</p>}
      </form>
    </div>
    <Footer/>
    </>
  );
}
