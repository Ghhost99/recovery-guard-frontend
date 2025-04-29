import React, { useEffect, useState } from "react";
import Navbar from "@components/navbar";
import {redirectIfIncomplete} from '../utils/navigation'
function CryptoLossReport() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amountLost: "",
    usdtValue: "",
    txid: "",
    senderWallet: "",
    receiverWallet: "",
    platformUsed: "",
    blockchainHash: "",
    paymentMethod: "",
    exchangeInfo: "",
    walletBackup: "",
    cryptoType: "Bitcoin",
    transactionDateTime: "",
    lossDescription: "",
    evidenceFiles: [],
  });

  // Handle input changes (text & file)
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  useEffect(
    ()=>{
      redirectIfIncomplete('/coming-soon',true)
    },[]
  )

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submission = new FormData();

      // Append all fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "evidenceFiles") {
          Array.from(value).forEach((file) => {
            submission.append("evidenceFiles", file);
          });
        } else {
          submission.append(key, value);
        }
      });
       console.log('form',submission);
          return;
      const res = await fetch("https://your-api.com/api/crypto-loss-report", {
        method: "POST",
        body: submission,
      });

      if (res.ok) {
        alert("Report submitted successfully!");
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-black/10 backdrop-blur-sm p-6">
        <div className="bg-white/5 text-white border border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Cryptocurrency Loss Report
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Text Inputs */}
            {[
              { label: "Full Name", name: "fullName", type: "text", required: true },
              { label: "Email Address", name: "email", type: "email", required: true },
              { label: "Phone Number", name: "phone", type: "tel", required: true },
              { label: "Amount Lost", name: "amountLost", type: "number", required: true },
              { label: "Equivalent USDT Value", name: "usdtValue", type: "number", required: true },
              { label: "Transaction ID (TXID)", name: "txid", type: "text", required: true },
              { label: "Sending Wallet Address", name: "senderWallet", type: "text", required: true },
              { label: "Receiving Wallet Address", name: "receiverWallet", type: "text", required: true },
              { label: "Platform Used", name: "platformUsed", type: "text" },
              { label: "Blockchain Transaction Hash", name: "blockchainHash", type: "text" },
              { label: "Payment Method Used", name: "paymentMethod", type: "text" },
              { label: "Exchange Account Information", name: "exchangeInfo", type: "text" },
              { label: "Wallet Backup/Private Key (If Compromised)", name: "walletBackup", type: "text" },
            ].map(({ label, name, type, required }) => (
              <div key={name}>
                <label className="block text-white mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  required={required}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Cryptocurrency Type Dropdown */}
            <div>
              <label className="block text-white mb-1">Cryptocurrency Type</label>
              <select
                name="cryptoType"
                required
                value={formData.cryptoType}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["Bitcoin", "Ethereum", "USDT", "BNB", "Solana", "Other"].map((crypto) => (
                  <option key={crypto} value={crypto}>
                    {crypto}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-white mb-1">Date & Time of Transaction</label>
              <input
                type="datetime-local"
                name="transactionDateTime"
                value={formData.transactionDateTime}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-white mb-1">How the Loss Happened</label>
              <textarea
                name="lossDescription"
                rows="4"
                value={formData.lossDescription}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white mb-1">Evidence of Fraud</label>
              <input
                type="file"
                name="evidenceFiles"
                multiple
                onChange={handleChange}
                className="w-full text-white p-3 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CryptoLossReport;


// Here’s how to:

// ---

// ### ✅ 1. **Add a `submit` handler** to POST the form data to an API endpoint.

// ### ✅ 2. **Document all fields** inline for clarity (ideal for future devs or reviewing code).

// ---

// ### 🔧 Assumptions:
// - API Endpoint: `https://your-api.com/api/crypto-loss-report`
// - Request type: `POST`
// - Headers: `Content-Type: application/json` (unless file upload is involved — then use `FormData`)

// ---

// ### 💡 If you want to support **file uploads**, we'll use `FormData`. Below is the full solution with both logic and documentation:

// ---

// ### ✅ **Updated `CryptoLossReport.jsx` with API Submission + Field Documentation**

// ```jsx
// import React, { useState } from "react";
// import Navbar from "@components/navbar";

// function CryptoLossReport() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     amountLost: "",
//     usdtValue: "",
//     txid: "",
//     senderWallet: "",
//     receiverWallet: "",
//     platformUsed: "",
//     blockchainHash: "",
//     paymentMethod: "",
//     exchangeInfo: "",
//     walletBackup: "",
//     cryptoType: "Bitcoin",
//     transactionDateTime: "",
//     lossDescription: "",
//     evidenceFiles: [],
//   });

//   // Handle input changes (text & file)
//   const handleChange = (e) => {
//     const { name, value, files, type } = e.target;
//     if (type === "file") {
//       setFormData((prev) => ({ ...prev, [name]: files }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const submission = new FormData();

//       // Append all fields to FormData
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === "evidenceFiles") {
//           Array.from(value).forEach((file) => {
//             submission.append("evidenceFiles", file);
//           });
//         } else {
//           submission.append(key, value);
//         }
//       });

//       const res = await fetch("https://your-api.com/api/crypto-loss-report", {
//         method: "POST",
//         body: submission,
//       });

//       if (res.ok) {
//         alert("Report submitted successfully!");
//       } else {
//         alert("Failed to submit report.");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("An error occurred while submitting.");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex justify-center items-center min-h-screen bg-black/10 backdrop-blur-sm p-6">
//         <div className="bg-white/5 text-white border border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-3xl">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Cryptocurrency Loss Report
//           </h2>
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* Text Inputs */}
//             {[
//               { label: "Full Name", name: "fullName", type: "text", required: true },
//               { label: "Email Address", name: "email", type: "email", required: true },
//               { label: "Phone Number", name: "phone", type: "tel", required: true },
//               { label: "Amount Lost", name: "amountLost", type: "number", required: true },
//               { label: "Equivalent USDT Value", name: "usdtValue", type: "number", required: true },
//               { label: "Transaction ID (TXID)", name: "txid", type: "text", required: true },
//               { label: "Sending Wallet Address", name: "senderWallet", type: "text", required: true },
//               { label: "Receiving Wallet Address", name: "receiverWallet", type: "text", required: true },
//               { label: "Platform Used", name: "platformUsed", type: "text" },
//               { label: "Blockchain Transaction Hash", name: "blockchainHash", type: "text" },
//               { label: "Payment Method Used", name: "paymentMethod", type: "text" },
//               { label: "Exchange Account Information", name: "exchangeInfo", type: "text" },
//               { label: "Wallet Backup/Private Key (If Compromised)", name: "walletBackup", type: "text" },
//             ].map(({ label, name, type, required }) => (
//               <div key={name}>
//                 <label className="block text-white mb-1">{label}</label>
//                 <input
//                   type={type}
//                   name={name}
//                   required={required}
//                   value={formData[name]}
//                   onChange={handleChange}
//                   className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             ))}

//             {/* Cryptocurrency Type Dropdown */}
//             <div>
//               <label className="block text-white mb-1">Cryptocurrency Type</label>
//               <select
//                 name="cryptoType"
//                 required
//                 value={formData.cryptoType}
//                 onChange={handleChange}
//                 className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {["Bitcoin", "Ethereum", "USDT", "BNB", "Solana", "Other"].map((crypto) => (
//                   <option key={crypto} value={crypto}>
//                     {crypto}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Date & Time */}
//             <div>
//               <label className="block text-white mb-1">Date & Time of Transaction</label>
//               <input
//                 type="datetime-local"
//                 name="transactionDateTime"
//                 value={formData.transactionDateTime}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Description Textarea */}
//             <div>
//               <label className="block text-white mb-1">How the Loss Happened</label>
//               <textarea
//                 name="lossDescription"
//                 rows="4"
//                 value={formData.lossDescription}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               ></textarea>
//             </div>

//             {/* File Upload */}
//             <div>
//               <label className="block text-white mb-1">Evidence of Fraud</label>
//               <input
//                 type="file"
//                 name="evidenceFiles"
//                 multiple
//                 onChange={handleChange}
//                 className="w-full text-white p-3 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
//             >
//               Submit Report
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default CryptoLossReport;
// ```


// // Fields

// // | Field Name             | Label                                 | Type             |
// // |------------------------|----------------------------------------|------------------|
// // | fullName              | Full Name                              | `text`           |
// // | email                 | Email Address                          | `email`          |
// // | phone                 | Phone Number                           | `tel`            |
// // | amountLost            | Amount Lost                            | `number`         |
// // | usdtValue             | Equivalent USDT Value                  | `number`         |
// // | txid                  | Transaction ID (TXID)                  | `text`           |
// // | senderWallet          | Sending Wallet Address                 | `text`           |
// // | receiverWallet        | Receiving Wallet Address               | `text`           |
// // | platformUsed          | Platform Used                          | `text`           |
// // | blockchainHash        | Blockchain Transaction Hash            | `text`           |
// // | paymentMethod         | Payment Method Used                    | `text`           |
// // | exchangeInfo          | Exchange Account Information           | `text`           |
// // | walletBackup          | Wallet Backup / Private Key            | `text`           |
// // | cryptoType            | Cryptocurrency Type (Dropdown)        | `select`         |
// // | transactionDateTime   | Date & Time of Transaction             | `datetime-local` |
// // | lossDescription       | How the Loss Happened (description)    | `textarea`       |
// // | evidenceFiles         | Evidence of Fraud                      | `file[]`         |

// // ---

