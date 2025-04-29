import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
const ContactSection = () => {
  return (
    
   <>
   <Navbar />
   <section className="contact-us-section px-6 py-16 text-white bg-black/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Contact Us
        </h2>
        <p className="mb-10 text-lg text-gray-300">
          If you have any questions or need assistance, feel free to reach out
          to us. Our team is here to help you.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Info */}
          <div className="w-full md:w-1/2 bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Get in Touch
            </h3>
            <p className="mb-2">
              <strong className="text-blue-400">Email:</strong>{" "}
              supportrecoveryguard@gmail.com
            </p>
            <p>
              <strong className="text-blue-400">Phone:</strong>{" "}
              +1 (586) 524-2191
            </p>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-1/2 bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Send Us a Message
            </h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg text-black focus:ring focus:ring-blue-400"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-lg text-black focus:ring focus:ring-blue-400"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Your Message"
                  required
                  className="w-full px-4 py-3 rounded-lg text-black focus:ring focus:ring-blue-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:opacity-80 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    <Footer />
   </>
  );
};

export default ContactSection;
