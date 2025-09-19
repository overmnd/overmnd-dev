import React, { useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.access_token);
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {!token ? (
        <div>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <p>✅ Logged in with token: {token.substring(0, 20)}...</p>
      )}
    </div>
  );
}
