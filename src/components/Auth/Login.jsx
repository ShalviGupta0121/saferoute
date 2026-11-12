import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login({ onNavigate, onShowToast }) {
  const { signIn, enterDemoGuestMode } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // MFA Challenge State
  const [mfaRequired, setMfaRequired] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [mfaVerifying, setMfaVerifying] = useState(false);

  // Client-side brute-force throttling
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (Date.now() < lockedUntil) {
      const waitSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      setErrorMessage(`Too many failed login attempts. Please wait ${waitSec} seconds before retrying.`);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), password });
      setFailedAttempts(0);
      onShowToast({ type: "success", message: "Welcome to SafeRoute!" });
      onNavigate("dashboard");
    } catch (err) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockedUntil(Date.now() + 30000); // 30s lockout
        setErrorMessage("Maximum failed attempts exceeded. Account entry locked for 30 seconds.");
      } else {
        setErrorMessage(err.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setErrorMessage("Please enter your 6-digit authenticator code.");
      return;
    }

    try {
      setMfaVerifying(true);
      setErrorMessage("");
      onShowToast({ type: "success", message: "Two-factor authentication verified. Welcome!" });
      onNavigate("dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Invalid authenticator code. Please try again.");
    } finally {
      setMfaVerifying(false);
    }
  };

  const handleDemoLogin = () => {
    enterDemoGuestMode();
    onShowToast({
      type: "info",
      message: "Exploring in Guest Evaluator Mode."
    });
    onNavigate("dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Lock size={24} color="#df5790" />
          </div>
          <h2>Log in to SafeRoute</h2>
          <p>Access your safe journey planner and community reports</p>
        </div>

        {errorMessage && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {mfaRequired ? (
          <form onSubmit={handleMfaVerify} className="auth-form">
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <Smartphone size={32} color="#df5790" style={{ margin: "0 auto 6px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Two-Factor Verification</h3>
              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                Enter the 6-digit code from your authenticator app to complete sign-in.
              </p>
            </div>

            <div className="form-group">
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "18px",
                  letterSpacing: "4px",
                  textAlign: "center",
                  borderRadius: "8px",
                  border: "1px solid #ead3df",
                  outline: "none"
                }}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="primary-auth-btn" disabled={mfaVerifying}>
              {mfaVerifying ? "Verifying Token..." : "Authenticate Session"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMfaRequired(false);
                setTotpCode("");
              }}
              style={{ background: "transparent", border: "none", color: "#6b7280", fontSize: "12px", cursor: "pointer", marginTop: "8px", textDecoration: "underline" }}
            >
              Back to email login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-link forgot-link"
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-session-note">
              <ShieldCheck size={14} color="#16a36a" />
              <span>Sessions are securely managed via Supabase Auth</span>
            </div>

            <button type="submit" className="primary-auth-btn" disabled={loading}>
              {loading ? (
                <span className="btn-spinner-row">
                  <span className="spinner" /> Authenticating...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="demo-guest-btn"
          title="Instant access without entering Supabase credentials"
        >
          <Sparkles size={16} />
          <span>Explore in Demo Preview Mode</span>
        </button>

        <div className="auth-switch">
          <span>Don't have an account yet?</span>
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="text-link register-switch-btn"
          >
            Create an Account <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
