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
  FiCheckCircle,
} from "react-icons/fi";
import firebase from "../../firebase";
import "firebase/compat/firestore";
import "firebase/compat/storage";

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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocumentChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storageRef = firebase.storage().ref();

    try {
      setUploading(true);
      // Upload files to Firebase Storage
      const fileUrls = await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          const fileRef = storageRef.child(file.name);
          await fileRef.put(file);
          return fileRef.getDownloadURL();
        })
      );

      // Update formData with file URLs
      setFormData({
        ...formData,
        documentUrls: fileUrls,
      });

      const databaseRef = firebase.firestore();
      const collectionRef = databaseRef.collection("formSubmissions");

      await collectionRef.add(formData);

      setSubmissionSuccess(true);
      setFormData({ ...initialFormData });
      setSelectedFiles([]);
      setUploading(false);
    } catch (error) {
      console.error("Error storing form data in Firestore:", error);
      setUploading(false);
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

          {selectedFiles.length > 0 && (
            <p>
              Selected files:{" "}
              {Array.from(selectedFiles)
                .map((file) => file.name)
                .join(", ")}
            </p>
          )}
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Join NGO"}
        </button>{" "}
      </form>
      {submissionSuccess && (
        <div className="success-message">
          <FiCheckCircle className="success-icon" />
          <p>Form submitted successfully!</p>
        </div>
      )}
    </div>
  );
}

export default NewCaseEntry;
