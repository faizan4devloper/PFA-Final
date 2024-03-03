import React, { useState } from "react";
import "./ApprovalScreen.css"; // Import CSS file for styling

function ApprovalScreen() {
  // Mock pending cases data
  const [pendingCases] = useState([
    {
      id: 1,
      name: "Case 1",
      details: "Details for Case 1",
      documents: [
        { id: 1, name: "Document 1", url: "https://example.com/document1.pdf" },
        { id: 2, name: "Document 2", url: "https://example.com/document2.pdf" },
      ],
      amount: "$500",
      date: "2024-02-29",
    },
    {
      id: 2,
      name: "Case 2",
      details: "Details for Case 2",
      documents: [
        { id: 3, name: "Document 3", url: "https://example.com/document3.pdf" },
        { id: 4, name: "Document 4", url: "https://example.com/document4.pdf" },
      ],
      amount: "$1000",
      date: "2024-03-01",
    },
  ]);

  const [selectedCase, setSelectedCase] = useState(null);

  const handleCaseClick = (caseId) => {
    // Find the selected case by id
    const foundCase = pendingCases.find((caseItem) => caseItem.id === caseId);
    setSelectedCase(foundCase);
  };

  return (
    <div className="approval-screen">
      <h1>Pending Cases</h1>
      <ul>
        {pendingCases.map((caseItem) => (
          <li key={caseItem.id} onClick={() => handleCaseClick(caseItem.id)}>
            {caseItem.name}
          </li>
        ))}
      </ul>
      {selectedCase && (
        <div className="case-details">
          <h2>Case Details</h2>
          <p>
            <strong>Case Name:</strong> {selectedCase.name}
          </p>
          <p>
            <strong>Details:</strong> {selectedCase.details}
          </p>
          <p>
            <strong>Amount:</strong> {selectedCase.amount}
          </p>
          <p>
            <strong>Date:</strong> {selectedCase.date}
          </p>
          <div className="documents">
            <h3>Documents</h3>
            <ul>
              {selectedCase.documents.map((document) => (
                <li key={document.id}>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {document.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalScreen;
