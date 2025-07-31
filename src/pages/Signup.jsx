import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";  
import API_BASE_URL from "../utils/Setup";
export default function Signup({ role = "customer" }) {
  const endpoint = `${API_BASE_URL}/auth/create-customer/`; // Update with your API URL
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    username: "",
  });
  const [message, setMessage] = useState("");

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
        setMessage(data.message || "Signup successful!");
        alert("Signup successful! redirecting to login page")
        setTimeout(()=>{
          window.location.href='/login'
        },2000)
      } else {
        setMessage(data.error || "Signup failed.");
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
        <h2 className="text-white text-2xl font-bold tracking-wide">
          Sign Up as {role}
        </h2>
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
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          value={form.first_name}
          className="w-full p-3 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50"
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          value={form.last_name}
          className="w-full p-3 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50"
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={form.username}
          className="w-full p-3 bg-transparent border border-white/30 text-white rounded-lg placeholder-white/50"
        />
        <button
          type="submit"
          className="w-full p-3 bg-white text-black font-semibold rounded-xl shadow-md hover:shadow-white transition"
        >
          Sign Up
        </button>
        {message && <p className="text-white text-sm text-center">{message}</p>}
      </form>
    </div>
   <Footer/>
   </>
  );
}
