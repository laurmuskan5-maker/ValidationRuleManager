import React from "react";

const CLIENT_ID =
  "3MVG9GCMQoQ6rpzQupJ30eDjeMlRot4r4db1P5_oyuBX2I4hh6GSqvYJ0gnmxn9ck6JzKqViPxZ_.6S0UV.53";

const REDIRECT_URI =
  "https://validationrulemanager.netlify.app/callback";

function Login() {
  const handleLogin = () => {
  const loginUrl =
    `https://login.salesforce.com/services/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  window.location.href = loginUrl;
};

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px"
      }}
    >
      <h1>
        Salesforce Validation Rule Manager
      </h1>

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Login With Salesforce
      </button>
    </div>
  );
}

export default Login;