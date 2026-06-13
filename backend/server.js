

const jsforce = require("jsforce");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/oauth/token", async (req, res) => {
  try {
    const { code } = req.body;

    const params = new URLSearchParams();

    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("redirect_uri", process.env.REDIRECT_URI);
    params.append("code", code);

    const response = await axios.post(
      `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "OAuth Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data || error.message,
    });
  }
});

app.post("/validation-rules", async (req, res) => {
  try {
    const { accessToken, instanceUrl } = req.body;

    const query = `
      SELECT Id,
             ValidationName,
             Active
      FROM ValidationRule
      WHERE EntityDefinition.QualifiedApiName = 'AppointmentInvitation'
    `;

    const response = await axios.get(
      `${instanceUrl}/services/data/v60.0/tooling/query`,
      {
        params: {
          q: query,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(
      "Rules Found:",
      response.data.totalSize
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Validation Rules Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data || error.message,
    });
  }
});

app.post("/toggle-validation-rule", async (req, res) => {
  try {
    const {
      accessToken,
      instanceUrl,
      ruleName,
      active,
    } = req.body;

    const conn = new jsforce.Connection({
      instanceUrl,
      accessToken,
    });

    const fullName =
      `AppointmentInvitation.${ruleName}`;

    console.log(
      "Reading metadata:",
      fullName
    );

    const metadata =
      await conn.metadata.read(
        "ValidationRule",
        fullName
      );

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error:
          "Validation Rule not found",
      });
    }

    metadata.active = active;

    console.log(
      "Updating Rule:",
      fullName,
      "Active:",
      active
    );

    const result =
      await conn.metadata.update(
        "ValidationRule",
        metadata
      );

    console.log(
      "Update Result:",
      result
    );

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Metadata Update Error:",
      error.response?.data ||
        error.message ||
        error
    );

    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Metadata update failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send(
    "Salesforce Validation Rule API Running"
  );
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});