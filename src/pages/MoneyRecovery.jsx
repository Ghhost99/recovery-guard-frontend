import { useState, useEffect } from 'react';
import Navbar from '@components/navbar';
import API_BASE_URL from '../utils/Setup';
import { authenticatedFetch } from '../utils/auth';
import { redirectIfIncomplete } from '../utils/navigation';

function MoneyRecoveryForm() {
  const [formData, setFormData] = useState({
    // Required Case fields
    title: '',
    description: '',
    
    // MoneyRecoveryReport specific fields
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    identification: '',
    amount: '',
    ref_number: '',
    bank: '',
    iban: '',
    datetime: '',
    supporting_documents: []
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
          <h2 className="text-3xl font-bold text-center mb-8">Report Money Recovery Case</h2>

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
                placeholder="Brief title describing the incident (e.g., Money Recovery Report)"
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-1 font-medium">Description of Incident</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the fraud/scam incident (e.g., Scammed by a fraudulent investment website)"
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
              ></textarea>
            </div>

            {/* Personal Information Section */}
            <div className="border-t border-white/20 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block mb-1 font-medium">First Name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="e.g., Jane"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block mb-1 font-medium">Last Name</label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="e.g., Doe"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="phone" className="block mb-1 font-medium">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +2348012345678"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., jane.doe@example.com"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="identification" className="block mb-1 font-medium">Identification (DNI/NIE/Passport/National ID)</label>
                <input
                  id="identification"
                  name="identification"
                  type="text"
                  required
                  value={formData.identification}
                  onChange={handleChange}
                  placeholder="e.g., ID123456789NG"
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                />
              </div>
            </div>

            {/* Financial Details Section */}
            <div className="border-t border-white/20 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Financial Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block mb-1 font-medium">Amount Lost</label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g., 500000.00"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="ref_number" className="block mb-1 font-medium">Reference Number / Transaction ID <span className="text-gray-400">(optional)</span></label>
                  <input
                    id="ref_number"
                    name="ref_number"
                    type="text"
                    value={formData.ref_number}
                    onChange={handleChange}
                    placeholder="Transaction reference (if available)"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="bank" className="block mb-1 font-medium">Bank / Payment Platform</label>
                  <input
                    id="bank"
                    name="bank"
                    type="text"
                    required
                    value={formData.bank}
                    onChange={handleChange}
                    placeholder="e.g., Zenith Bank"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="iban" className="block mb-1 font-medium">Bank Account / IBAN</label>
                  <input
                    id="iban"
                    name="iban"
                    type="text"
                    required
                    value={formData.iban}
                    onChange={handleChange}
                    placeholder="e.g., NG29AAAA12345678901234567890"
                    className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="mt-4">
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
            </div>

            {/* Supporting Documents */}
            <div className="border-t border-white/20 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Supporting Evidence</h3>
              
              <div>
                <label htmlFor="supporting_documents" className="block mb-1 font-medium">Supporting Documents <span className="text-gray-400">(optional)</span></label>
                <input
                  id="supporting_documents"
                  name="supporting_documents"
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 text-gray-200 border border-white/20 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-300 mt-1">Upload screenshots of communications, transaction receipts, contracts, or any other relevant documents</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-300 transform hover:scale-105"
            >
              Submit Money Recovery Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MoneyRecoveryForm;
