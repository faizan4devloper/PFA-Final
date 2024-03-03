import React, { useState, useEffect } from "react";
import { FiEye, FiX } from "react-icons/fi";
import firebase from "../../firebase";
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
        const casesRef = databaseRef.collection("cases");
        const snapshot = await casesRef.get();
        const casesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCases(casesData);
      } catch (error) {
        console.error("Error fetching cases:", error);
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

  const closeModal = () => {
    setShowModal(false);
    setSelectedCase(null);
  };

  const filteredCases =
    filter === "All" ? cases : cases.filter((c) => c.status === filter);

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
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table className="cases-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCases.map((c) => (
            <tr key={c.id} onClick={() => handleCaseClick(c)}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.class}</td>
              <td>
                <FiEye />
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
            <p>Name: {selectedCase.name}</p>
            <p>Status: {selectedCase.status}</p>
            <p>Class: {selectedCase.class}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewCases;
