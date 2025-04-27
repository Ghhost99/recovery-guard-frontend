import { useState } from "react";
import Navbar from "@components/navbar";

function SocialMediaRecoveryPage() {
  const [formData, setFormData] = useState({
    platform: "",
    fullName: "",
    email: "",
    phone: "",
    username: "",
    profileUrl: "",
    profilePic: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
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
       console.log('form:',data);
       return;

      const res = await fetch("/api/recover/social", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setResponseMsg("Request submitted successfully.");
      } else {
        setResponseMsg(result.message || "Submission failed.");
      }
    } catch (err) {
      setResponseMsg("An error occurred while submitting.");
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
              { id: "fullName", label: "Full Name", type: "text", required: true },
              { id: "email", label: "Email Address", type: "email", required: true },
              { id: "phone", label: "Phone Number", type: "tel" },
              { id: "username", label: "Username / Handle", type: "text", required: true },
              { id: "profileUrl", label: "Profile URL", type: "url" },
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

            {/* File Upload */}
            <div>
              <label htmlFor="profilePic" className="block mb-1 text-white font-medium">Upload Profile Picture</label>
              <input
                id="profilePic"
                name="profilePic"
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

export default SocialMediaRecoveryPage;




// Here’s clean, professional **documentation** for both your `MoneyRecoveryForm` and `SocialMediaRecoveryPage` components. This includes structure, field descriptions, validation notes, and submission expectations.

// ---

// ## 📄 Component: `MoneyRecoveryForm`

// ### **Purpose:**
// To collect detailed information from users who have been victims of financial fraud. The form is structured to capture personal, transactional, and descriptive data for investigation and recovery.

// ---

// ### **Form Fields:**

// | Field ID       | Label                                | Type            | Required | Description |
// |----------------|--------------------------------------|-----------------|----------|-------------|
// | `firstName`    | First Name                           | `text`          | ✅       | User's legal first name. |
// | `lastName`     | Last Name                            | `text`          | ✅       | User's legal surname. |
// | `phone`        | Phone Number                         | `tel`           | ✅       | A contact number for follow-up. |
// | `email`        | Email Address                        | `email`         | ✅       | User's primary email address. |
// | `id`           | Identification (DNI/NIE/Passport)    | `text`          | ✅       | Government-issued ID used for verification. |
// | `amount`       | Amount Lost                          | `number`        | ✅       | Total estimated amount lost. |
// | `refNumber`    | Reference Number / Transaction ID    | `text`          | ❌       | Optional transaction or case ID. |
// | `bank`         | Bank / Payment Platform              | `text`          | ✅       | Name of the institution involved. |
// | `iban`         | Bank Account / IBAN                  | `text`          | ✅       | The user’s IBAN or account number. |
// | `datetime`     | Date & Time of Transaction           | `datetime-local`| ✅       | Precise timestamp of the fraudulent event. |
// | `description`  | Description of Fraud                 | `textarea`      | ✅       | User’s detailed account of what happened. |
// | `files`        | Proof of Fraud                       | `file`          | ❌       | Optional uploads: screenshots, PDFs, documents (multiple allowed). |

// ---

// ### **UI Notes:**
// - All fields use a glassmorphic UI with semi-transparent dark backgrounds.
// - Uses Tailwind CSS for styling with strong focus on accessibility and minimalism.
// - Submit button: `"Proceed to TCP Scan"` (indicating further backend processing).

// ---

// ## 📄 Component: `SocialMediaRecoveryPage`

// ### **Purpose:**
// Allows users to report and request help recovering a compromised or inaccessible social media account. Tailored to handle multiple platforms.

// ---

// ### **Form Fields:**

// | Field ID       | Label                                | Type     | Required | Description |
// |----------------|--------------------------------------|----------|----------|-------------|
// | `platform`     | Platform                             | `select` | ✅       | Dropdown to choose social media platform. |
// | `fullName`     | Full Name                            | `text`   | ✅       | Full legal name of the account owner. |
// | `email`        | Email Address                        | `email`  | ✅       | Email linked to the social media account. |
// | `phone`        | Phone Number                         | `tel`    | ❌       | Optional phone number associated with the account. |
// | `username`     | Username / Handle                    | `text`   | ✅       | The handle used on the platform. |
// | `profileUrl`   | Profile URL                          | `url`    | ❌       | Optional full URL to the affected profile. |
// | `profilePic`   | Upload Profile Picture               | `file`   | ❌       | Optional image to visually confirm identity. Accepts `image/*`. |

// ---

// ### **UI Notes:**
// - Platform dropdown includes common platforms (e.g., Facebook, TikTok, Reddit).
// - Emphasis on accessibility and form clarity with clear labels and consistent layout.
// - Submit button: `"Submit Request"` (triggers backend handling for account recovery).

// ---

// ## ✅ Shared Design Traits

// - **Styling:** Uses your **CyberBrutalist Glass** theme:
//   - Transparent backgrounds with white borders.
//   - Glow on focus.
//   - Rounded corners and shadows.
//   - Tailwind-based responsive layout.
// - **UX:** Forms are easy to navigate on both desktop and mobile.
// - **Accessibility:** Proper label-to-input mapping using `htmlFor` and `id`.

// ---

// Let me know if you'd like a version of this documentation exported in Markdown, PDF, or as a developer handoff spec with Figma-style annotations.