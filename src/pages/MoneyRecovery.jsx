import { useState, useEffect } from 'react';
import Navbar from '@components/navbar';
import API_BASE_URL from '../utils/Setup';
import { authenticatedFetch } from '../utils/auth';
import { redirectIfIncomplete } from '../utils/navigation';

function MoneyRecoveryForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    identification: '',
    amount: '',
    ref_number: '', // Changed from reference_number to ref_number to match backend model
    bank: '',
    iban: '',
    datetime: '',
    loss_description: '', // Changed from description to align with backend expectations
    supporting_documents: [] // Changed to match backend relationship name
  });
  useEffect(() => {
    redirectIfIncomplete('/coming-soon', false);
  }, []);

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
      const response = await authenticatedFetch(`${API_BASE_URL}/cases/money-recovery/`, {
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



  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-black/10 backdrop-blur-md p-6 text-white">
        <div className="w-full max-w-2xl border border-white/20 bg-white/10 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Report Fraud</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information */}
            {[ 
              { id: "first_name", label: "First Name", type: "text" },
              { id: "last_name", label: "Last Name", type: "text" },
              { id: "phone", label: "Phone Number", type: "tel" },
              { id: "email", label: "Email Address", type: "email" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  required
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
                />
              </div>
            ))}

            {/* Identity & Banking Details */}
            {[ 
              { id: "identification", label: "Identification (DNI/NIE/Passport)", type: "text" },
              { id: "amount", label: "Amount Lost", type: "number" },
              { id: "ref_number", label: "Reference Number / Transaction ID", type: "text" }, // Changed from reference_number
              { id: "bank", label: "Bank / Payment Platform", type: "text" },
              { id: "iban", label: "Bank Account / IBAN", type: "text" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  required={id !== 'ref_number'} // Changed from reference_number
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
                />
              </div>
            ))}

            {/* Transaction Timestamp */}
            <div>
              <label htmlFor="datetime" className="block mb-1 font-medium">Date & Time of Transaction</label>
              <input
                id="datetime"
                name="datetime"
                type="datetime-local"
                required
                value={formData.datetime}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="loss_description" className="block mb-1 font-medium">Description of Fraud</label>
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
              <label htmlFor="supporting_documents" className="block mb-1 font-medium">Proof of Fraud (Screenshots/Documents)</label>
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

export default MoneyRecoveryForm;