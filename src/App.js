import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import NewCaseEntry from "./components/Newentry/NewCaseEntry";
import ReviewCases from "./components/ReviewCase/ReviewCases";
import FinancialReview from "./components/Financial/FinancialReview";
import CaseDashboard from "./components/Dashboard/CaseDashboard";
import AdminLogin from "./components/Dashboard/AdminLogin";
import firebase from "../src/firebase";

function App() {
  const [reviewCases, setReviewCases] = useState([]);

  const handleNewCaseSubmit = (newCase) => {
    setReviewCases([...reviewCases, newCase]);
  };

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

  const handleApprove = async (submissionId) => {
    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(submissionId);
      await submissionRef.update({ status: "approved" });
      const updatedSubmissions = submissions.map((submission) => {
        if (submission.id === submissionId) {
          return { ...submission, status: "approved" };
        }
        return submission;
      });
      setSubmissions(updatedSubmissions);
    } catch (error) {
      console.error("Error approving submission:", error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const databaseRef = firebase.firestore();
      const submissionRef = databaseRef
        .collection("formSubmissions")
        .doc(submissionId);
      await submissionRef.update({ status: "rejected" });
      const updatedSubmissions = submissions.map((submission) => {
        if (submission.id === submissionId) {
          return { ...submission, status: "rejected" };
        }
        return submission;
      });
      setSubmissions(updatedSubmissions);
    } catch (error) {
      console.error("Error rejecting submission:", error);
    }
  };

  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={<NewCaseEntry onSubmit={handleNewCaseSubmit} />}
          />
          <Route
            path="/review"
            element={<ReviewCases submissions={submissions} />}
          />
          <Route path="/financial-review" element={<FinancialReview />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <CaseDashboard
                submissions={submissions}
                handleApprove={handleApprove}
                handleReject={handleReject}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
