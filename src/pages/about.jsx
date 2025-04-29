import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import img15 from "../assets/img_15.GIF"; // Ensure path is correct

const AboutSection = () => {
  return (
    <>
      <Navbar />
      <section className="about-us-section px-6 py-20 text-white bg-black/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          {/* Right Side - Text First for Focus */}
          <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              About Us
            </h2>
            <p className="mb-6 text-lg text-gray-300 leading-relaxed">
              At <strong className="text-white font-semibold">Recovery Guard</strong>, we specialize in helping individuals recover lost funds from scams, fraud, and unauthorized transactions. Our secure, fast, and effective process ensures justice is served.
            </p>
            <p className="mb-8 text-lg text-gray-300 leading-relaxed">
              With years of experience and a results-driven approach, we’ve successfully recovered millions for victims worldwide. Trust us to help you reclaim what’s rightfully yours.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-80 transition duration-300">
              Learn More
            </button>
          </div>

          {/* Left Side - Image Secondary */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-[400px] h-[300px] bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-inner overflow-hidden">
              <img
                src={img15}
                alt="Recovery process visual"
                className="w-full h-full object-contain rounded-xl opacity-90 grayscale"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutSection;
