import "./Register.css";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return "Cannot reach the server. Make sure the Django API is running and VITE_API_URL is configured correctly.";
  }

  if (typeof data.detail === "string") return data.detail;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length) return String(value[0]);
    if (typeof value === "string") return value;
  }

  return "Could not create account. Please check your details and try again.";
}

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-art">
        <Logo />
        <div className="auth-copy">
          <h1>One place for<br />salary operations.</h1>
          <p>Give HR a clean, searchable source of truth for compensation data.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-content">
          <div className="mobile-brand"><Logo /></div>
          <h1>Create HR account</h1>
          <p>Set up an account to access the ACME workspace.</p>

          <form onSubmit={submit} className="auth-form">
            {error && <div className="form-error">{error}</div>}

            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
              Work email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@acme.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>

            <label>
              Confirm password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </label>

            <button className="button primary auth-submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>

            <p className="auth-switch">
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
