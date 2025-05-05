import React from "react";
import theBank from "../assets/img_8.jpeg";
import theInvestigation from "../assets/img_9.jpeg";
import theFOS from "../assets/img_10.jpeg";
import aboutUs from "../assets/img_11.jpeg";
import { useNavigate } from "react-router-dom";
const AboutUs = () => {
  return (
    <section className="py-16 bg-black/10 backdrop-blur-md text-white border border-white rounded-lg mx-4 md:mx-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Column */}
        <div>
          <h2 className="text-4xl font-bold mb-6">About us</h2>
          <div className="mb-6">
            <img
              src={aboutUs}
              alt="Illustration showing team collaboration"
              className="rounded-lg border border-white"
            />
          </div>
          <button className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition rounded-2xl font-semibold">
            Learn more
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-6 text-gray-300 text-lg">
          <p>
            Our experienced team has over 20 years combined experience working in
            industry for banks, the Financial Conduct Authority, or the Financial
            Ombudsman Service.
          </p>
          <p>
            Thousands of people  have lost millions of pounds from
            scams. We want to help you get that back.
          </p>
          <p className="text-white font-semibold">
            So we built <span className="text-blue-400">Recovery Guard</span>.
          </p>
        </div>
      </div>
    </section>
  );
};


const HowItWorks = () => {
  return (
    <section className="py-16 bg-black/10 backdrop-blur-md text-white border border-white rounded-lg mx-4 md:mx-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Column */}
        <div>
          <h1 className="text-4xl font-bold mb-4">How it works</h1>
          <p className="mb-4">
            We're here to help you along the way! Learn more about how it works.
          </p>
          <p className="mb-6 text-gray-300 text-sm">
            You don't have to use Recovery Guard and you can do your claim yourself for free by contacting the bank and the Financial Ombudsman yourself.{" "}
            <a href="#" className="underline text-blue-400">
              Here's a guide on how to do it yourself
            </a>
            .
          </p>
          <a
  href="#contact-form"
  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow transition"
>
  Start your claim
</a>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {[
            {
              img: theInvestigation,
              title: "The investigation",
              desc: "Our Fraud Investigators will assess your case to see if we can help.",
            },
            {
              img: theBank,
              title: "The bank",
              desc: "Recovery Guard will prepare your individual case and submit a bespoke report to the bank in order to receive their formal response.",
            },
            {
              img: theFOS,
              title: "FOS",
              desc: "If the bank refuses reimbursement, Recovery Guard takes your case to the FOS for an independent review, the final stage determining your refund amount.",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-16 min-w-16">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-auto rounded-lg border border-white"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  <span className="text-blue-400">{i + 1}.</span> {step.title}
                </h3>
                <p className="text-sm text-gray-300">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const Features = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Testimonials Section */}
      <div className="flex justify-center px-4 mt-16 text-white">
        <div className="w-full max-w-5xl space-y-10 p-8 rounded-2xl shadow-lg text-center bg-black/30 backdrop-blur-md border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold">
            Rated <span className="text-blue-400">Excellent</span> on TrustPilot
          </h2>
          <p className="text-lg text-gray-300">Over 4,000 Satisfied Customers</p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {[
              {
                text: "Unbelievable service. Made the impossible possible.",
                name: "Luis Eduardo, March 16",
              },
              {
                text: "I was scammed of $75,000 worth of bitcoin with a scam forest investment unknowingly and they took everything, thanks for the help.",
                name: "Nancy Strong, Feb 16",
              },
              {
                text: "So happy! Recovery Guard were easy to communicate with. I am so happy to get my refund!",
                name: "Richard Fisher, Jan 26",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[280px] p-6 border border-white/30 rounded-xl bg-white/10"
              >
                <div className="text-yellow-400 mb-2 text-sm md:text-base">
                  ★★★★★ <span className="text-green-400">✔ Verified</span>
                </div>
                <p className="text-white italic mb-3 leading-relaxed">
                  "{review.text}"
                </p>
                <p className="text-sm text-gray-400">{review.name}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Rated 4.8 / 5 based on 572 reviews. Showing our 4 & 5 star reviews.
            </p>

            <div className="flex justify-center">
              <a href="#contact-form">
              <button
               
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-lg transition"
              >
                Join 4,000+ customers
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />
      <AboutUs />
    </>
  );
};

export default Features;
