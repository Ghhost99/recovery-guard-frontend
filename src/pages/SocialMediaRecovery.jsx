import { useEffect, useState } from "react";
import Navbar from "@components/navbar";
import API_BASE_URL from "../utils/Setup";
import { authenticatedFetch } from "../utils/auth";
import { redirectIfIncomplete } from "../utils/navigation";

function SocialMediaRecoveryForm() {
  const [formData, setFormData] = useState({
    // Required Case fields
    title: '',
    
    // SocialMediaRecovery specific fields
    platform: "",
    full_name: "",
    email: "",
    phone: "",
    username: "",
    profile_url: "",
    profile_pic: null,
    account_creation_date: '', // Added missing field
    last_access_date: '', // Added missing field
  });

  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  
  useEffect(() => {
    redirectIfIncomplete('/coming-soon', false);
  }, []);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_pic") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMsg("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const response = await authenticatedFetch(`${API_BASE_URL}/cases/social-media/`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }
      
      const result = await response.json();
      setResponseMsg("Request submitted successfully.");
      // Optionally redirect to a confirmation page
      // window.location.href = '/dashboard';
    } catch (err) {
      setResponseMsg("An error occurred: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-black/10 backdrop-blur-md p-6 text-white">
        <div className="w-full max-w-2xl border border-white/20 bg-white/10 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Social Media Account Recovery</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Case Title - Required field */}
            <div>
              <label htmlFor="title" className="block mb-1 text-white font-medium">Case Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief description of your account recovery request"
                className="w-full p-3 rounded-xl bg-black/10 text-white border border-white/20"
              />
            </div>

            {/* Platform Dropdown */}
            <div>
              <label className="block mb-1 text-white font-medium">Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-black/80 text-white border border-white/20"
              >
                <option value="">Select a platform</option>
                {[
                  "Facebook",
                  "Instagram",
                  "Twitter",
                  "LinkedIn",
                  "Snapchat",
                  "TikTok",
                  "Reddit",
                  "YouTube",
                  "Pinterest",
                  "WhatsApp",
                  "Telegram",
                  "Other",
                ].map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Fields */}
            {[
              { id: "full_name", label: "Full Name", type: "text", required: true },
              { id: "email", label: "Email Address", type: "email", required: true },
              { id: "phone", label: "Phone Number", type: "tel" },
              { id: "username", label: "Username / Handle", type: "text", required: true },
              { id: "profile_url", label: "Profile URL", type: "url" },
            ].map(({ id, label, type, required }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 text-white font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  required={required}
                  className="w-full p-3 rounded-xl bg-black/10 text-white border border-white/20"
                />
              </div>
            ))}

            {/* Account Dates - New fields */}
            <div>
              <label htmlFor="account_creation_date" className="block mb-1 text-white font-medium">
                Account Creation Date (if known)
              </label>
              <input
                id="account_creation_date"
                name="account_creation_date"
                type="date"
                value={formData.account_creation_date}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-black/10 text-white border border-white/20"
              />
            </div>

            <div>
              <label htmlFor="last_access_date" className="block mb-1 text-white font-medium">
                Last Access Date (if known)
              </label>
              <input
                id="last_access_date"
                name="last_access_date"
                type="date"
                value={formData.last_access_date}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-black/10 text-white border border-white/20"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="profile_pic" className="block mb-1 text-white font-medium">Upload Profile Picture</label>
              <input
                id="profile_pic"
                name="profile_pic"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 bg-white/10 text-gray-200 border border-white/20 rounded-xl cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

            {responseMsg && (
              <p className="text-center mt-4 text-sm text-white/70">{responseMsg}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default SocialMediaRecoveryForm;