import React, { useState, useEffect, useRef } from "react";
import firebase from "../../firebase";
import "firebase/compat/firestore";
import "firebase/compat/messaging";
import "./CaseDashboard.css";
import Chart from "chart.js/auto";
import { FiTrash, FiCheckCircle } from "react-icons/fi";

function CaseDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const databaseRef = firebase.firestore();
        const collectionRef = databaseRef.collection("formSubmissions");
        const snapshot = await collectionRef.get();
        const submissionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          showButtons: true,
        }));
        submissionsData.sort((a, b) => a.parentIncome - b.parentIncome);

        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Error fetching submissions from Firestore:", error);
      }
    };

    fetchSubmissions();
  }, []);

  const handleDelete = async (submissionId, index) => {
    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(submissionId);
      await submissionRef.delete();
      const updatedSubmissions = [...submissions];
      updatedSubmissions[index].showButtons = false;
      setSubmissions(updatedSubmissions);
      setMessage("Submission deleted successfully.");
      setSuccess(true);
      refreshChart();
    } catch (error) {
      console.error("Error deleting submission:", error);
      setMessage("Error deleting submission. Please try again.");
      setSuccess(false);
    }
  };

  const handleApprove = async (submission, index, sponsorshipDecision) => {
    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(submission.id);
      await submissionRef.update({ status: "Approved", sponsorshipDecision });
      const updatedSubmissions = [...submissions];
      updatedSubmissions[index].showButtons = false;
      setSubmissions(updatedSubmissions);
      setMessage("Submission approved successfully.");
      setSuccess(true);
      localStorage.setItem(submission.id, "approved");
      refreshChart();
    } catch (error) {
      console.error("Error approving submission:", error);
      setMessage("Error approving submission. Please try again.");
      setSuccess(false);
    }
  };

  const handleReject = async (submission, index) => {
    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(submission.id);
      await submissionRef.update({ status: "Rejected" });
      const updatedSubmissions = [...submissions];
      updatedSubmissions[index].showButtons = false;
      setSubmissions(updatedSubmissions);
      setMessage("Submission rejected successfully.");
      setSuccess(true);
      localStorage.setItem(submission.id, "rejected");
      refreshChart();
    } catch (error) {
      console.error("Error rejecting submission:", error);
      setMessage("Error rejecting submission. Please try again.");
      setSuccess(false);
    }
  };

  const countSubmissionsByStatus = (status) => {
    if (status === "Pending") {
      return submissions.filter(
        (submission) =>
          submission.status !== "Approved" && submission.status !== "Rejected"
      ).length;
    } else {
      return submissions.filter((submission) => submission.status === status)
        .length;
    }
  };

  const chartRef = useRef(null);

  const createChart = () => {
    const ctx = document.getElementById("submissionChart");

    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Approved", "Rejected", "Pending"],
        datasets: [
          {
            label: "Submissions",
            data: [
              countSubmissionsByStatus("Approved"),
              countSubmissionsByStatus("Rejected"),
              countSubmissionsByStatus("Pending"),
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 205, 86, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(255, 205, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    chartRef.current = myChart;
  };

  const refreshChart = () => {
    if (chartRef.current) {
      createChart();
    }
  };

  useEffect(() => {
    if (submissions.length > 0) {
      createChart();
    }
  });

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {message && (
        <p className={success ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
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
          {submissions.map((submission, index) => (
            <tr key={submission.id}>
              <td>{submission.studentName}</td>
              <td>{submission.gender}</td>
              <td>{submission.academicDetails}</td>
              <td>{submission.parentIncome}</td>
              <td>{submission.contactNumber}</td>
              <td>{submission.caste}</td>
              <td>{submission.governmentAid}</td>

              <td>
                {submission.showButtons && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() =>
                        handleApprove(submission, index, "fullySponsor")
                      }
                      disabled={
                        submission.status === "Approved" ||
                        localStorage.getItem(submission.id) === "approved"
                      }
                      style={{
                        backgroundColor:
                          localStorage.getItem(submission.id) === "approved"
                            ? "grey"
                            : "",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(submission, index)}
                      disabled={
                        submission.status === "Rejected" ||
                        localStorage.getItem(submission.id) === "rejected"
                      }
                      style={{
                        backgroundColor:
                          localStorage.getItem(submission.id) === "rejected"
                            ? "grey"
                            : "",
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(submission.id, index)}
                    >
                      <FiTrash />
                    </button>
                  </>
                )}
                {localStorage
                  .getItem("approvedSubmissions")
                  ?.includes(submission.id) && (
                  <FiCheckCircle className="success-icon" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="graph-container">
        <canvas id="submissionChart"></canvas>
      </div>
    </div>
  );
}

export default CaseDashboard;
