import { Link } from "react-router-dom";

function RecoveryOptions() {
  return (
    <section className="min-h-screen bg-black/10 backdrop-blur-md text-white border border-white rounded-lg mx-4 md:mx-20 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold">Start Your Recovery</h1>
        <p className="text-gray-300 text-lg">
          Choose the type of recovery you need help with. We’ll guide you through the next steps.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              label: "Money Recovery",
              to: "/money-recovery",
              desc: "Lost funds via bank transfer or card payments.",
            },
            {
              label: "Crypto Recovery",
              to: "/crypto-recovery",
              desc: "Report stolen or lost cryptocurrency.",
            },
            {
              label: "Social Media",
              to: "/socials-recovery",
              desc: "Hacked or compromised social accounts.",
            },
          ].map(({ label, to, desc }, i) => (
            <Link
              key={i}
              to={to}
              className="p-6 border border-white/20 rounded-2xl bg-white/5 hover:bg-white/10 transition text-left"
            >
              <h2 className="text-xl font-semibold text-blue-400 mb-2">{label}</h2>
              <p className="text-gray-300 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecoveryOptions;
