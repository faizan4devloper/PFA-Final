import React, { useState } from "react";
import "./FinancialReview.css"; // Import the CSS file for styling
import "@fortawesome/fontawesome-free/css/all.min.css";

function FinancialReview({ caseDetails }) {
  const [sponsorshipDecision, setSponsorshipDecision] = useState(null);
  const [additionalItems, setAdditionalItems] = useState([]);

  const handleSponsorshipDecision = (decision) => {
    // Update the sponsorship decision state
    setSponsorshipDecision(decision);

    // Perform additional logic based on the decision
    if (decision === "Specific Items") {
      // Simulate fetching additional items
      setTimeout(() => {
        setAdditionalItems(["Books", "Clothes", "Stationery"]);
      }, 1000);
    }
  };

  return (
    <div className="financial-review-container">
      <h2>Financial Review</h2>
      <div className="case-details">
        <h3>Case Details</h3>
        <p>
          <strong>Name:</strong> {caseDetails.studentName}
        </p>
        <p>
          <strong>Academic Details:</strong> {caseDetails.academicDetails}
        </p>
      </div>
      <div className="remarks">
        <h3>Remarks from Approver Team</h3>
        <p>{caseDetails.remarks}</p>
      </div>
      <div className="sponsorship-decision">
        <h3>Make Sponsorship Decision</h3>
        <button onClick={() => handleSponsorshipDecision("Fully Sponsor")}>
          Fully Sponsor
        </button>
        <button
          onClick={() => handleSponsorshipDecision("Term-wise Sponsorship")}
        >
          Term-wise Sponsorship
        </button>
        <button onClick={() => handleSponsorshipDecision("Specific Items")}>
          Specific Items (e.g., books, clothes)
        </button>
      </div>
      {sponsorshipDecision && (
        <div className="selected-decision">
          <h3>Selected Sponsorship Decision</h3>
          <p>{sponsorshipDecision}</p>
          {sponsorshipDecision === "Specific Items" && (
            <div className="additional-items">
              <h4>Additional Items</h4>
              {additionalItems.length > 0 ? (
                <ul>
                  {additionalItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>Loading additional items...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FinancialReview;
