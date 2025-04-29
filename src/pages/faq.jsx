import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const FAQSection = () => {
  return (
    <>
    <Navbar/>
      <section className="faq-section px-6 py-16 text-white bg-black/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-300 mb-10">
            Find answers to the most common questions about our services.
          </p>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            <div className="faq-item bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-2">What is Recovery Guard?</h3>
              <p className="text-gray-300">
                Recovery Guard is a trusted service provider specializing in helping individuals
                recover lost funds from scams, fraud, and unauthorized transactions.
              </p>
            </div>

            <div className="faq-item bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-2">How does the recovery process work?</h3>
              <p className="text-gray-300">
                Our process involves gathering evidence, contacting relevant parties, and using our
                expertise to recover your funds securely and efficiently.
              </p>
            </div>

            <div className="faq-item bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-2">How long does it take to recover funds?</h3>
              <p className="text-gray-300">
                The recovery time varies depending on the complexity of the case. However, we strive
                to resolve cases as quickly as possible.
              </p>
            </div>

            <div className="faq-item bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Is my information secure?</h3>
              <p className="text-gray-300">
                Yes, we prioritize your privacy and security. All information you provide is handled
                with the utmost confidentiality.
              </p>
            </div>

            <div className="faq-item bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg md:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-2">How can I contact Recovery Guard?</h3>
              <p className="text-gray-300">
                You can reach us via email at{" "}
                <strong className="text-white">supportrecoveryguard@gmail.com</strong> or call us at{" "}
                <strong className="text-white">+1 (586) 524-2191</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default FAQSection;
