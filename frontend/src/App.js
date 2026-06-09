import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import ValidationRules from "./Components/ValidationRules";

const API_URL = "https://validationrulemanager.onrender.com";

/* ---------------- HOME ---------------- */
function Home() {
  const [accessToken, setAccessToken] = useState(null);
  const [instanceUrl, setInstanceUrl] = useState(null);

  return (
    <div>
      <Navbar />

      {!accessToken ? (
        <Login />
      ) : (
        <ValidationRules
          accessToken={accessToken}
          instanceUrl={instanceUrl}
        />
      )}
    </div>
  );
}

/* ---------------- CALLBACK PAGE ---------------- */
function Callback() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const exchangeToken = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/oauth/token`,
          { code }
        );

        // store tokens (simple version)
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("instanceUrl", response.data.instance_url);

        window.location.href = "/";
      } catch (err) {
        console.error("OAuth Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (code) exchangeToken();
  }, []);

  return <h3>{loading ? "Logging you in..." : "Login failed"}</h3>;
}

/* ---------------- APP ---------------- */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;