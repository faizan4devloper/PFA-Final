import React, { useState } from "react";
import "./NewCaseEntry.css";
import {
  FiUser,
  FiBriefcase,
  FiPhone,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiUpload,
} from "react-icons/fi";
import firebase from "../../firebase";
import "firebase/compat/firestore";

function NewCaseEntry() {
  const initialFormData = {
    studentName: "",
    gender: "",
    academicDetails: "",
    parentIncome: "",
    contactNumber: "",
    caste: "",
    governmentAid: "",
    documentUrls: [],
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentChange = (e) => {
    const files = e.target.files;
    setFormData({ ...formData, documents: files });

    // Display the selected file name
    if (files.length > 0) {
      setSelectedFileName(files[0].name);
    } else {
      setSelectedFileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted to Firebase:", formData);
    setFormData({ ...initialFormData });

    const databaseRef = firebase.firestore();
    const collectionRef = databaseRef.collection("formSubmissions");
    try {
      // Add form data to Firestore
      await collectionRef.add(formData);
      console.log("Form data stored in Firestore successfully!");

      // Clear form fields after submission if needed
      e.target.reset();
    } catch (error) {
      console.error("Error storing form data in Firestore:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="form-heading">Join NGO Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <FiUser className="icon" />
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            placeholder="Student Name"
          />
        </div>
        <div className="form-group">
          <FiUsers className="icon" />
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <FiFileText className="icon" />
          <textarea
            id="academicDetails"
            name="academicDetails"
            value={formData.academicDetails}
            onChange={handleChange}
            required
            placeholder="Academic Details"
          ></textarea>
        </div>
        <div className="form-group">
          <FiDollarSign className="icon" />
          <input
            type="number"
            id="parentIncome"
            name="parentIncome"
            value={formData.parentIncome}
            onChange={handleChange}
            required
            placeholder="Parent Income"
          />
        </div>
        <div className="form-group">
          <FiPhone className="icon" />
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            placeholder="Contact Number"
          />
        </div>
        <div className="form-group">
          <FiUsers className="icon" />
          <input
            type="text"
            id="caste"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            placeholder="Caste"
          />
        </div>
        <div className="form-group">
          <FiBriefcase className="icon" />
          <input
            type="text"
            id="governmentAid"
            name="governmentAid"
            value={formData.governmentAid}
            onChange={handleChange}
            placeholder="Government Aid"
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            id="documents"
            name="documents"
            onChange={handleDocumentChange}
            multiple
            accept=".pdf,.doc,.docx"
          />
          <label htmlFor="documents" className="file-input-label">
            <FiUpload className="file-input-icon" /> Choose Files
          </label>
          {selectedFileName && <p>Selected file: {selectedFileName}</p>}
        </div>
        <button type="submit">Join NGO</button>
      </form>
    </div>
  );
}

export default NewCaseEntry;
