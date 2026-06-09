const jsforce = require("jsforce");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const CLIENT_ID =
  "3MVG9GCMQoQ6rpzQupJ30eDjeMlRot4r4db1P5_oyuBX2I4hh6GSqvYJ0gnmxn9ck6JzKqViPxZ_.6S0UV.53";

const CLIENT_SECRET =
  "605EC49B62A7D31B45E6B281C1217B00120DE13CA5B65BE7FCE50B37851EE219";

const REDIRECT_URI =
  "https://validationrulemanager.netlify.app/callback";

const SF_LOGIN_URL = "https://login.salesforce.com";

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ---------------- OAUTH ---------------- */
app.post("/oauth/token", async (req, res) => {
  try {
    const { code } = req.body;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code", code);

    const response = await axios.post(
      `${SF_LOGIN_URL}/services/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("OAuth Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/* ---------------- GET VALIDATION RULES ---------------- */
app.post("/validation-rules", async (req, res) => {
  try {
    const { accessToken, instanceUrl } = req.body;

    const query = `
      SELECT Id, FullName, Active
      FROM ValidationRule
      WHERE EntityDefinition.QualifiedApiName = 'AppointmentInvitation'
    `;

    const response = await axios.get(
      `${instanceUrl}/services/data/v60.0/tooling/query`,
      {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Validation Rules Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/* ---------------- FIXED TOGGLE ENDPOINT ---------------- */
app.post("/toggle-validation-rule", async (req, res) => {
  try {
    const { accessToken, instanceUrl, ruleName, active } = req.body;

    const conn = new jsforce.Connection({
      instanceUrl,
      accessToken,
    });

    // FULL NAME REQUIRED BY SALESFORCE TOOLING API
    const fullName = `AppointmentInvitation.${ruleName}`;

    console.log("Updating Validation Rule:", fullName);

    // ❗ CORRECT WAY: use tooling sobject update (NOT metadata.update)
    const result = await conn.tooling.sobject("ValidationRule").update({
      Id: ruleName, // IMPORTANT: we use Id instead of metadata update
      Active: active,
    });

    console.log("Toggle Result:", result);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Toggle Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Salesforce Validation Rule API Running");
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});