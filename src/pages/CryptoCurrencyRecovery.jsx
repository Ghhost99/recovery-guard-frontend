import { useState, useEffect } from 'react';
import Navbar from '@components/navbar';
import API_BASE_URL from '../utils/Setup';
import { authenticatedFetch } from '../utils/auth';
import { redirectIfIncomplete } from '../utils/navigation';

function CryptoLossForm() {
  const [formData, setFormData] = useState({
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
    description: '',
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
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Amount Information */}
            {[ 
              { id: "amount_lost", label: "Amount Lost (in cryptocurrency)", type: "number", step: "0.00000001" },
              { id: "usdt_value", label: "Value in USDT", type: "number", step: "0.00000001" },
            ].map(({ id, label, type, step }) => (
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
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
                />
              </div>
            ))}

            {/* Transaction Details */}
            {[ 
              { id: "txid", label: "Transaction ID / Hash", type: "text" },
              { id: "sender_wallet", label: "Sender Wallet Address", type: "text" },
              { id: "receiver_wallet", label: "Receiver Wallet Address", type: "text" },
              { id: "platform_used", label: "Platform/Exchange Used", type: "text" },
              { id: "blockchain_hash", label: "Blockchain Hash (if different from txid)", type: "text", required: false },
              { id: "payment_method", label: "Payment Method", type: "text", required: false },
            ].map(({ id, label, type, required = true }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  required={required}
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
                />
              </div>
            ))}

            {/* Exchange Info & Wallet Backup */}
            {[
              { id: "exchange_info", label: "Exchange Information (optional)", rows: 2, required: false },
              { id: "wallet_backup", label: "Wallet Backup Information (optional)", rows: 2, required: false },
            ].map(({ id, label, rows, required }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <textarea
                  id={id}
                  name={id}
                  rows={rows}
                  required={required}
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
                ></textarea>
              </div>
            ))}

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

            {/* Loss Description */}
            <div>
              <label htmlFor="loss_description" className="block mb-1 font-medium">Description of Loss/Incident</label>
              <textarea
                id="loss_description"
                name="loss_description"
                rows="4"
                required
                value={formData.loss_description}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="supporting_documents" className="block mb-1 font-medium">Supporting Documents</label>
              <input
                id="supporting_documents"
                name="supporting_documents"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full p-3 bg-white/10 text-gray-200 border border-white/20 rounded-xl cursor-pointer"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300"
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