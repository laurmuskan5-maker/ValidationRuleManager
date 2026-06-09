import axios from "axios";
const API_URL = "http://localhost:5000";
export const getValidationRules = async (
  accessToken,
  instanceUrl
) => {
  const response = await axios.post(
    `${API_URL}/validation-rules`,
    {
      accessToken,
      instanceUrl
    }
  );

  return response.data;
};

export const toggleValidationRule = async (
  accessToken,
  instanceUrl,
  ruleName,
  active
) => {
  const response = await axios.post(
    `${API_URL}/toggle-validation-rule`,
    {
      accessToken,
      instanceUrl,
      ruleName,
      active
    }
  );

  return response.data;
};