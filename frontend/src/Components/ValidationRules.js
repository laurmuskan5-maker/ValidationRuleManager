import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  getValidationRules,
  toggleValidationRule
} from "../Services/salesforceApi";

function ValidationRules({
  accessToken,
  instanceUrl
}) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRules = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getValidationRules(
            accessToken,
            instanceUrl
          );

        console.log(
          "Validation Rules:",
          data
        );

        console.log(
          "First Rule:",
          data.records?.[0]
        );

        setRules(data.records || []);
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load validation rules."
        );
      } finally {
        setLoading(false);
      }
    },
    [accessToken, instanceUrl]
  );

  useEffect(() => {
    if (
      accessToken &&
      instanceUrl
    ) {
      fetchRules();
    }
  }, [
    accessToken,
    instanceUrl,
    fetchRules
  ]);

  const handleToggle = async (
    rule
  ) => {
    try {
      await toggleValidationRule(
        accessToken,
        instanceUrl,
        rule.rule.ValidationName,
        !rule.Active
      );

      setRules((prevRules) =>
        prevRules.map((r) =>
          r.Id === rule.Id
            ? {
                ...r,
                Active: !r.Active
              }
            : r
        )
      );

      console.log(
        "Rule updated successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update validation rule"
      );
    }
  };

  const handleDeploy = async () => {
    try {
      console.log(
        "Deploying rules...",
        rules
      );

      alert(
        "Deploy functionality will be connected next."
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: "20px"
      }}
    >
      <h2>
        Salesforce Validation Rules
      </h2>

      <div
        style={{
          marginBottom: "20px"
        }}
      >
        <button
          onClick={fetchRules}
          style={{
            padding: "10px",
            marginRight: "10px"
          }}
        >
          Get Validation Rules
        </button>

        <button
          onClick={handleDeploy}
          style={{
            padding: "10px"
          }}
        >
          Deploy Changes
        </button>
      </div>

      {loading && (
        <p>
          Loading validation rules...
        </p>
      )}

      {error && (
        <p
          style={{
            color: "red"
          }}
        >
          {error}
        </p>
      )}

      {!loading && (
        <table
          border="1"
          width="100%"
          cellPadding="10"
          style={{
            borderCollapse:
              "collapse"
          }}
        >
          <thead>
            <tr>
              <th>
                Rule Name
              </th>
              <th>Status</th>
              <th>Toggle</th>
            </tr>
          </thead>

          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  align="center"
                >
                  No Validation Rules Found
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr
                  key={rule.Id}
                >
                  <td>
                    {rule.ValidationName}
                  </td>

                  <td>
                    {rule.Active
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleToggle(
                          rule
                        )
                      }
                    >
                      {rule.Active
                        ? "Disable"
                        : "Enable"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ValidationRules;