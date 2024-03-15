import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import "firebase/compat/firestore";
import { FiEye, FiX } from "react-icons/fi";
import "./ReviewCases.css";

function ReviewCases() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const databaseRef = firebase.firestore();
        const collectionRef = databaseRef.collection("formSubmissions");
        const snapshot = await collectionRef.get();
        const approvedSubmissions =
          JSON.parse(localStorage.getItem("approvedSubmissions")) || [];
        const casesData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (c) =>
              (c.status === "Approved" || c.status === "Rejected") &&
              !approvedSubmissions.includes(c.id)
          );
        setCases(casesData);
      } catch (error) {
        console.error("Error fetching cases from Firestore:", error);
      }
    };

    fetchCases();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCaseClick = (c) => {
    setSelectedCase(c);
    setShowModal(true);
  };

  const handleApprove = async () => {
    // Handle approval logic
  };

  const handleReject = async () => {
    // Handle rejection logic
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCase(null);
  };

  return (
    <div className="review-cases-container">
      <h2>Review Cases</h2>
      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filter}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table className="cases-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr
              key={c.id}
              onClick={() => handleCaseClick(c)}
              style={{
                display:
                  filter === "All" || filter === c.status
                    ? "table-row"
                    : "none",
              }}
            >
              <td>{c.id}</td>
              <td>{c.studentName}</td>
              <td>{c.status}</td>
              <td>
                <FiEye className="eye-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedCase && (
        <div className="case-modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              <FiX />
            </span>
            <h2>Case Details</h2>
            <p>ID: {selectedCase.id}</p>
            <p>Name: {selectedCase.studentName}</p>
            <p>Status: {selectedCase.status}</p>
            {selectedCase.status === "Pending" && (
              <div>
                <button onClick={handleApprove}>Approve</button>
                <button onClick={handleReject}>Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewCases;
