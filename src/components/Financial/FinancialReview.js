import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import "firebase/compat/firestore";
import "./FinancialReview.css";

function FinancialReview() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [sponsorshipDecision, setSponsorshipDecision] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const databaseRef = firebase.firestore();
        const collectionRef = databaseRef.collection("formSubmissions");
        const snapshot = await collectionRef
          .where("status", "==", "Approved")
          .get();
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

  const handleSubmissionSelection = (submissionId) => {
    const selectedSubmission = submissions.find(
      (submission) => submission.id === submissionId
    );
    setSelectedSubmission(selectedSubmission);
  };

  const makeSponsorshipDecision = async (decision) => {
    if (!selectedSubmission) return;

    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(selectedSubmission.id);
      await submissionRef.update({ sponsorshipDecision: decision });
      console.log("Sponsorship decision updated successfully.");
      setSponsorshipDecision(decision); // Set the sponsorship decision state
    } catch (error) {
      console.error("Error updating sponsorship decision:", error);
    }
  };

  return (
    <div className="financial-review-container">
      <h2 className="main-head">Financial Review</h2>
      <div className="submissions-list">
        <h3>Submissions</h3>
        <ul>
          {submissions.map((submission, index) => (
            <li
              key={submission.id}
              onClick={() => handleSubmissionSelection(submission.id)}
            >
              <span className="submission-number">{index + 1}</span>.
              {submission.studentName}
            </li>
          ))}
        </ul>
      </div>

      <div className="selected-submission-details">
        <h3>Selected Submission Details</h3>
        {selectedSubmission && (
          <div>
            <p>Student Name: {selectedSubmission.studentName}</p>
            <p>Gender: {selectedSubmission.gender}</p>
            <p>Academic Details: {selectedSubmission.academicDetails}</p>
            <p>Parent Income: {selectedSubmission.parentIncome}</p>
            <p>Contact Number: {selectedSubmission.contactNumber}</p>
            <p>Caste: {selectedSubmission.caste}</p>
            <p>Government Aid: {selectedSubmission.governmentAid}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </div>
      <div className="sponsorship-decision">
        <h3>Sponsorship Decision</h3>
        <button onClick={() => makeSponsorshipDecision("fullySponsor")}>
          Fully Sponsor
        </button>
        <button onClick={() => makeSponsorshipDecision("termWiseSponsor")}>
          Term Wise Sponsorship
        </button>
        <button onClick={() => makeSponsorshipDecision("booksAndClothes")}>
          Only Books and Clothes
        </button>
      </div>
      {/* UI elements to display after sponsorship decision */}
      {sponsorshipDecision && (
        <div className="sponsorship-confirmation">
          <h3>Sponsorship Decision Confirmation</h3>
          <p>Decision: {sponsorshipDecision}</p>
          {/* Add more confirmation details if needed */}
        </div>
      )}
    </div>
  );
}

export default FinancialReview;
