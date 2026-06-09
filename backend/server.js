import React, { useEffect, useState, useCallback } from "react";
import {
  getValidationRules,
  toggleValidationRule,
} from "../Services/salesforceApi";

function ValidationRules({ accessToken, instanceUrl }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch rules from backend
  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getValidationRules(accessToken, instanceUrl);

      console.log("Validation Rules:", data);

      setRules(data.records || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load validation rules.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, instanceUrl]);

  useEffect(() => {
    if (accessToken && instanceUrl) {
      fetchRules();
    }
  }, [accessToken, instanceUrl, fetchRules]);

  // Toggle rule active/inactive
  const handleToggle = async (rule) => {
  try {
    const ruleName = rule.ValidationName;

    await toggleValidationRule(
      accessToken,
      instanceUrl,
      ruleName,
      !rule.Active
    );

    setRules((prev) =>
      prev.map((r) =>
        r.Id === rule.Id
          ? { ...r, Active: !r.Active }
          : r
      )
    );
  } catch (error) {
    console.error("Toggle Error:", error);
    alert("Failed to update validation rule");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Salesforce Validation Rules</h2>

      <button onClick={fetchRules} style={{ marginBottom: "20px" }}>
        Refresh Rules
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rules.length === 0 ? (
            <tr>
              <td colSpan="3" align="center">
                No Validation Rules Found
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <tr key={rule.Id}>
                <td>{rule.ValidationName}</td>
                <td>{rule.Active ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => handleToggle(rule)}>
                    {rule.Active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ValidationRules;
