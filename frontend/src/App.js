import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import ValidationRules from "./Components/ValidationRules";
const API_URL = "http://localhost:5000";
function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [instanceUrl, setInstanceUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Prevent duplicate token requests
    if (!code || accessToken || loading) return;

    const exchangeToken = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          `${API_URL}/oauth/token`,
          {
            code,
          }
        );

        setAccessToken(response.data.access_token);
        setInstanceUrl(response.data.instance_url);

        // Clean URL after successful login
        window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("OAuth Error:", err);
      } finally {
        setLoading(false);
      }
    };

    exchangeToken();
  }, [accessToken, loading]);

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

export default App;