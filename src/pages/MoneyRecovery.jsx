import { useState } from 'react';
import Navbar from '@components/navbar';

function MoneyRecoveryForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    id: '',
    amount: '',
    refNumber: '',
    bank: '',
    iban: '',
    datetime: '',
    description: '',
    files: []
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
      if (key === 'files' && value.length) {
        for (let i = 0; i < value.length; i++) {
          data.append('files', value[i]);
        }
      } else {
        data.append(key, value);
      }
    });
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    
    return;

    try {
      const response = await fetch('/api/money-recovery', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Submission failed');
      alert('Report submitted successfully.');
    } catch (error) {
      console.error(error);
      alert('There was an error submitting the report.');
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
            {/* firstName, lastName, phone, email */}
            {[ 
              { id: "firstName", label: "First Name", type: "text" },
              { id: "lastName", label: "Last Name", type: "text" },
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
            {/* id, amount, refNumber, bank, iban */}
            {[
              { id: "id", label: "Identification (DNI/NIE/Passport)", type: "text" },
              { id: "amount", label: "Amount Lost", type: "number" },
              { id: "refNumber", label: "Reference Number / Transaction ID", type: "text" },
              { id: "bank", label: "Bank / Payment Platform", type: "text" },
              { id: "iban", label: "Bank Account / IBAN", type: "text" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  required={id !== 'refNumber'}
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
              <label htmlFor="description" className="block mb-1 font-medium">Description of Fraud</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-xl"
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="files" className="block mb-1 font-medium">Proof of Fraud (Screenshots/Documents)</label>
              <input
                id="files"
                name="files"
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
              Proceed to TCP Scan
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MoneyRecoveryForm;


// 📋 Field Documentation (In Code):
// Field ID	Description
// firstName	User’s first name
// lastName	User’s last name
// phone	Contact phone number
// email	Contact email address
// id	Government-issued ID (DNI/NIE/Passport)
// amount	Amount of money lost
// refNumber	Transaction reference (optional)
// bank	Bank or payment platform used
// iban	Account number/IBAN
// datetime	Date and time of the fraudulent action
// description	Detailed description of what occurred
// files	Uploaded evidence (screenshots/docs)
// Let me know if you’d like the API route created too (/api/money-recovery with Next.js or Express, for example).