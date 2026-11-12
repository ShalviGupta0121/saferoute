import { useState } from "react";
import { Mail, KeyRound, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword({ onNavigate, onShowToast }) {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSuccessMessage(
        "Password reset instructions have been dispatched. Please check your inbox and follow the link to set a new password."
      );
      onShowToast({
        type: "success",
        message: "Password reset instructions sent."
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <KeyRound size={24} color="#df5790" />
          </div>
          <h2>Reset Your Password</h2>
          <p>We will email you a secure link to reset your account password</p>
        </div>

        {errorMessage && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <button type="submit" className="primary-auth-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner-row">
                <span className="spinner" /> Sending Link...
              </span>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>
        </form>

        <div className="auth-switch">
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="text-link register-switch-btn"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
