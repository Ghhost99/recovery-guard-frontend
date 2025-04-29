import React, { useState } from "react";

const DynamicForm = ({ formType, apiUrl, fields = [], buttonText, customStyles = "" }) => {
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");

  // Handle input changes for text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection for media uploads
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const formSubmitData = new FormData();

      if (formType === "media") {
        if (!selectedFile) {
          setStatus("Please select a file.");
          return;
        }
        formSubmitData.append("file", selectedFile);
      } else {
        // For text forms, append each field to FormData
        Object.keys(formData).forEach(key => {
          formSubmitData.append(key, formData[key]);
        });
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formSubmitData,
        // Remove Content-Type header to let browser set it automatically for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit");
      }

      setStatus("Success!");
      // Reset form after successful submission
      setFormData({});
      setSelectedFile(null);
    } catch (error) {
      setStatus(error.message || "Error submitting. Try again!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 bg-gray-800 text-white rounded-lg ${customStyles}`}>
      <h2 className="text-2xl font-bold mb-4">{formType === "media" ? "Upload File" : "Submit Form"}</h2>

      {formType === "text" &&
        fields.map((field, index) => (
          <input
            key={index}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded-lg text-black"
            required={field.required}
          />
        ))}

      {formType === "media" && (
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-3 mb-3 bg-gray-700 text-white rounded-lg"
          required
        />
      )}

      <button type="submit" className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:opacity-80">
        {buttonText}
      </button>

      {status && <p className="mt-3">{status}</p>}
    </form>
  );
};

export default DynamicForm;