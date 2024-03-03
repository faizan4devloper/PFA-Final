import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewCaseEntry from "./components/Newentry/NewCaseEntry";
import ReviewCases from "./components/ReviewCase/ReviewCases";
import ApprovalScreen from "./components/Approval/ApprovalScreen";
import FinancialReview from "./components/Financial/FinancialReview";
import CaseDashboard from "./components/Dashboard/CaseDashboard";
import AdminLogin from "./components/Dashboard/AdminLogin";

function App() {
  const [caseDetails, setCaseDetails] = useState({
    id: 1,
    studentName: "Faizan Khan",
    academicDetails: "Pursuing Bachelor Deegree in Computer Application.",
    documents: [
      { id: 1, name: "Document 1.pdf" },
      { id: 2, name: "Document 2.pdf" },
      // Add more documents as needed
    ],
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    sponsorshipDecision: "", // Initialize with empty decision
  });

  const [reviewCases, setReviewCases] = useState([]);

  const handleNewCaseSubmit = (newCase) => {
    // Add the new case to the review cases list
    setReviewCases([...reviewCases, newCase]);
  };

  const [submissions, setSubmissions] = useState([]);

  // Simulate fetching submissions from an API
  const fetchSubmissions = () => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const fetchedSubmissions = [
        {
          id: 1,
          studentName: "John Doe",
          academicDetails: "Good",
          status: "Pending",
          parentIncome: "8000000",
        },
        {
          id: 2,
          studentName: "Jane Smith",
          academicDetails: "Excellent",
          status: "Pending",
          caste: "Muslim",
        },
        {
          id: 3,
          studentName: "Sohail Smith",
          academicDetails: "Excellent",
          status: "Approve",
        },
        {
          id: 4,
          studentName: "Ma Smith",
          academicDetails: "Excellent",
          status: "Pending",
        },
        // Add more submissions as needed
      ];
      setSubmissions(fetchedSubmissions);
    }, 1000); // Simulate 1 second delay
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = (submissionId) => {
    // Update submission status to 'Approved'
    const updatedSubmissions = submissions.map((submission) => {
      if (submission.id === submissionId) {
        return { ...submission, status: "Approved" };
      }
      return submission;
    });
    setSubmissions(updatedSubmissions);
  };

  const handleReject = (submissionId) => {
    // Update submission status to 'Rejected'
    const updatedSubmissions = submissions.map((submission) => {
      if (submission.id === submissionId) {
        return { ...submission, status: "Rejected" };
      }
      return submission;
    });
    setSubmissions(updatedSubmissions);
  };

  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <NewCaseEntry
                onSubmit={handleNewCaseSubmit}
                // onFormSubmit={handleFormSubmit}
              />
            }
          />
          <Route path="/review" element={<ReviewCases cases={reviewCases} />} />
          <Route path="/approval" element={<ApprovalScreen />} />
          <Route
            path="/financial-review"
            element={<FinancialReview caseDetails={caseDetails} />}
          />

          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <CaseDashboard
                handleApprove={handleApprove}
                handleReject={handleReject}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
