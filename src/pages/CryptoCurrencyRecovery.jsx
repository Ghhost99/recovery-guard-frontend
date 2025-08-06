import { useState, useEffect } from 'react';
import Navbar from '@components/navbar';
import API_BASE_URL from '../utils/Setup';
import { authenticatedFetch } from '../utils/auth';
import { redirectIfIncomplete } from '../utils/navigation';

function CryptoLossForm() {
  const [formData, setFormData] = useState({
    // Required Case fields
    title: '',
    description: '', // Main case description
    
    // CryptoLossReport specific fields
    amount_lost: '',
    usdt_value: '',
    txid: '',
    sender_wallet: '',
    receiver_wallet: '',
    platform_used: '',
    blockchain_hash: '',
    payment_method: '',
    exchange_info: '',
    wallet_backup: '',
    crypto_type: 'Bitcoin',
    transaction_datetime: '',
    loss_description: '', // Detailed loss description
    supporting_documents: []
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append all fields to FormData for file support
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'supporting_documents' && value.length) {
        for (let i = 0; i < value.length; i++) {
          data.append('supporting_documents', value[i]);
        }
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/cases/crypto/`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }
      
      const responseData = await response.json();
      alert('Report submitted successfully.');
      // Optionally redirect to a confirmation page
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      alert('There was an error submitting the report: ' + error.message);
    }
  };

  useEffect(() => {
    redirectIfIncomplete('/coming-soon', false);
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-black/10 backdrop-blur-md p-6 text-white">
        <div className="w-full max-w-2xl border border-white/20 bg-white/10 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Report Crypto Loss</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Title - Required field */}
            <div>
              <label htmlFor="title" className="block mb-1 font-medium">Case Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title describing your crypto loss"
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
              />
            </div>

            {/* Case Description - Required field */}
            <div>
              <label htmlFor="description" className="block mb-1 font-medium">Case Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief overview of the incident"
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
              ></textarea>
            </div>

            {/* Crypto Information */}
            <div>
              <label htmlFor="crypto_type" className="block mb-1 font-medium">Cryptocurrency Type</label>
              <select
                id="crypto_type"
                name="crypto_type"
                required
                value={formData.crypto_type}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
              >
                {["Bitcoin", "Ethereum", "USDT", "BNB", "Solana", "Other"].map(option => (
                  <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                ))}
              </select>
            </div>

            {/* Amount Information */}
            {[ 
              { id: "amount_lost", label: "Amount Lost (in cryptocurrency)", type: "number", step: "0.00000001", placeholder: "e.g., 1500.00000000" },
              { id: "usdt_value", label: "Value in USDT", type: "number", step: "0.00000001", placeholder: "e.g., 1500.00000000" },
            ].map(({ id, label, type, step, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  step={step}
                  required
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                />
              </div>
            ))}

            {/* Transaction Details */}
            {[ 
              { id: "txid", label: "Transaction ID / Hash", type: "text", placeholder: "e.g., 0x123456abcdef7890" },
              { id: "sender_wallet", label: "Sender Wallet Address", type: "text", placeholder: "e.g., 0xSenderWalletAddress123" },
              { id: "receiver_wallet", label: "Receiver Wallet Address", type: "text", placeholder: "e.g., 0xReceiverWalletAddress456" },
              { id: "platform_used", label: "Platform/Exchange Used", type: "text", placeholder: "e.g., FakeTradingPro" },
              { id: "blockchain_hash", label: "Blockchain Hash (if different from txid)", type: "text", required: false, placeholder: "e.g., 0xblockhashabc123" },
              { id: "payment_method", label: "Payment Method", type: "text", required: false, placeholder: "e.g., Crypto transfer" },
            ].map(({ id, label, type, required = true, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  required={required}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                />
              </div>
            ))}

            {/* Exchange Info & Wallet Backup */}
            <div>
              <label htmlFor="exchange_info" className="block mb-1 font-medium">Exchange Information (optional)</label>
              <textarea
                id="exchange_info"
                name="exchange_info"
                rows="2"
                value={formData.exchange_info}
                onChange={handleChange}
                placeholder="Additional information about the exchange or platform"
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
              ></textarea>
            </div>

            <div>
              <label htmlFor="wallet_backup" className="block mb-1 font-medium">Wallet Backup Information</label>
              <select
                id="wallet_backup"
                name="wallet_backup"
                required
                value={formData.wallet_backup}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
              >
                <option value="">Select wallet backup status</option>
                <option value="True" className="bg-gray-800 text-white">Yes, I have wallet backup</option>
                <option value="False" className="bg-gray-800 text-white">No, I don't have wallet backup</option>
              </select>
            </div>

            {/* Transaction Timestamp */}
            <div>
              <label htmlFor="transaction_datetime" className="block mb-1 font-medium">Date & Time of Transaction</label>
              <input
                id="transaction_datetime"
                name="transaction_datetime"
                type="datetime-local"
                required
                value={formData.transaction_datetime}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
              />
            </div>

            {/* Loss Description - Detailed description */}
            <div>
              <label htmlFor="loss_description" className="block mb-1 font-medium">Detailed Description of Loss/Incident</label>
              <textarea
                id="loss_description"
                name="loss_description"
                rows="4"
                required
                value={formData.loss_description}
                onChange={handleChange}
                placeholder="Provide a detailed explanation of how the loss occurred, what happened, and any additional context"
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="supporting_documents" className="block mb-1 font-medium">Supporting Documents (optional)</label>
              <input
                id="supporting_documents"
                name="supporting_documents"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full p-3 bg-white/10 text-gray-200 border border-white/20 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-sm text-gray-300 mt-1">Upload screenshots, transaction confirmations, communications, etc.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 transform hover:scale-105"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CryptoLossForm;
