import { useState } from "react";
import { useAuth } from "../../utils/hooks";

// interface Props {}

function Login() {
  const { login, fetchWithAuth, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);

  const handleRegister = async () => {
    const success = await register(email, password);
    if (success) {
      alert("Registration successful!");
      // можно сразу логинить или перейти на страницу логина
    }
  };

  const handleLogin = async () => {
    await login(email, password);
  };

  const getProfile = async () => {
    const res = await fetchWithAuth("http://localhost:3000/api/auth/profile", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
    } else {
      alert("Failed to fetch profile");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>

      <h2>Profile</h2>
      <button onClick={getProfile}>Get Profile</button>

      {profile && (
        <div>
          <h3>User Info:</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Login;
