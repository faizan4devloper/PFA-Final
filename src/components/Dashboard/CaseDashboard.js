import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import "firebase/compat/firestore";
import "./CaseDashboard.css";
import { FiTrash } from "react-icons/fi";

function CaseDashboard({ handleApprove, handleReject }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const databaseRef = firebase.firestore();
        const collectionRef = databaseRef.collection("formSubmissions");
        const snapshot = await collectionRef.get();
        const submissionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Error fetching submissions from Firestore:", error);
      }
    };

    fetchSubmissions();
  }, []);

  const handleDelete = async (submissionId) => {
    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(submissionId);
      await submissionRef.delete();
      setSubmissions(
        submissions.filter((submission) => submission.id !== submissionId)
      );
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Gender</th>
            <th>Academic Details</th>
            <th>Parent Income</th>
            <th>Contact Number</th>
            <th>Caste</th>
            <th>Government Aid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.studentName}</td>
              <td>{submission.gender}</td>
              <td>{submission.academicDetails}</td>
              <td>{submission.parentIncome}</td>
              <td>{submission.contactNumber}</td>
              <td>{submission.caste}</td>
              <td>{submission.governmentAid}</td>
              <td>
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(submission)}
                >
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReject(submission)}
                >
                  Reject
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(submission.id)}
                >
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CaseDashboard;
