import React from "react";
import { useNavigate } from "react-router-dom";
import icon1 from "../assets/img_12.GIF";

const Hero = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/start-recovery");
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

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col md:flex-row justify-start gap-4"
            id="contact-form"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              autoComplete="email"
              aria-label="Email"
              required
              className="px-4 py-3 w-full md:w-80 rounded-lg text-black focus:ring focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:opacity-80 transition duration-300"
              title="Submit"
              aria-label="Submit"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right content */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0 flex justify-center items-center">
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={icon1}
              alt="Security Visualization"
              className="max-w-[500px] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
