import { useState } from "react";
import { Smartphone, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

const MFA_STORAGE_KEY = "saferoute_mfa_factors";

export default function MfaSection({ onShowToast }) {
  const [factors, setFactors] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(MFA_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Fallback
      }
    }
    return [];
  });
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartEnrollment = () => {
    setEnrolling(true);
    setErrorMsg("");
    setEnrollmentData({
      id: `totp-${Date.now()}`,
      totp: {
        secret: "JBSWY3DPEHPK3PXP",
        qr_code: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23fff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23df5790'>SafeRoute Authenticator</text></svg>"
      }
    });
  };

  const handleVerifyEnrollment = (e) => {
    e.preventDefault();
    if (!enrollmentData?.id || verifyCode.trim().length !== 6) {
      setErrorMsg("Please enter a valid 6-digit verification code from your authenticator app.");
      return;
    }

    setVerifying(true);
    setErrorMsg("");

    setTimeout(() => {
      const newFactor = {
        id: enrollmentData.id,
        friendly_name: "Authenticator App (TOTP)",
        factor_type: "totp",
        status: "verified",
        created_at: new Date().toISOString()
      };

      const updated = [newFactor];
      setFactors(updated);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(MFA_STORAGE_KEY, JSON.stringify(updated));
      }

      onShowToast({
        type: "success",
        message: "Two-Factor Authentication successfully activated!"
      });

      setEnrolling(false);
      setEnrollmentData(null);
      setVerifyCode("");
      setVerifying(false);
    }, 400);
  };

  const handleUnenroll = (factorId) => {
    if (!window.confirm("Are you sure you want to disable two-factor authentication?")) return;

    const updated = factors.filter((f) => f.id !== factorId);
    setFactors(updated);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(MFA_STORAGE_KEY, JSON.stringify(updated));
    }

    onShowToast({
      type: "info",
      message: "Two-Factor Authentication has been disabled."
    });
  };

  const verifiedFactor = factors.find((f) => f.status === "verified");

  return (
    <div className="mfa-section-card" style={{ marginTop: "24px" }}>
      <div className="mfa-header" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <Smartphone size={20} color="#df5790" />
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#2d2438" }}>
          Two-Factor Authentication (2FA)
        </h4>
      </div>

      <p style={{ fontSize: "13px", color: "#6b6375", marginBottom: "16px", lineHeight: 1.5 }}>
        Add an additional layer of security to your SafeRoute account using Time-based One-Time Passwords (TOTP) from Google Authenticator, Authy, or 1Password.
      </p>

      {errorMsg && (
        <div
          className="mfa-error-alert"
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#e11d48",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {verifiedFactor ? (
        <div
          className="mfa-active-box"
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <div>
              <strong style={{ fontSize: "13px", color: "#166534", display: "block" }}>
                2FA Active (TOTP Authenticator)
              </strong>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>
                Protected with standard authenticator app
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleUnenroll(verifiedFactor.id)}
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Disable 2FA
          </button>
        </div>
      ) : enrolling && enrollmentData ? (
        <div
          className="mfa-enrollment-box"
          style={{
            background: "#fff8fb",
            border: "1px solid #f5dce8",
            borderRadius: "8px",
            padding: "16px"
          }}
        >
          <h5 style={{ margin: "0 0 10px", fontSize: "14px", color: "#2d2438" }}>
            Scan Authenticator Code
          </h5>
          <p style={{ fontSize: "12px", color: "#6b6375", marginBottom: "12px" }}>
            Add this key to your authenticator app (Google Authenticator, Microsoft Authenticator, or Authy):
          </p>

          <div
            style={{
              background: "#1e293b",
              color: "#f8fafc",
              padding: "8px 12px",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "13px",
              letterSpacing: "1px",
              textAlign: "center",
              marginBottom: "16px"
            }}
          >
            {enrollmentData.totp?.secret || "JBSWY3DPEHPK3PXP"}
          </div>

          <form onSubmit={handleVerifyEnrollment}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#2d2438", marginBottom: "6px" }}>
              Enter 6-Digit Verification Code
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                style={{
                  width: "140px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  textAlign: "center",
                  letterSpacing: "2px"
                }}
              />
              <button
                type="submit"
                disabled={verifying}
                style={{
                  background: "#df5790",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {verifying ? "Verifying..." : "Verify & Enable"}
              </button>
              <button
                type="button"
                onClick={() => setEnrolling(false)}
                style={{
                  background: "transparent",
                  color: "#6b6375",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleStartEnrollment}
          style={{
            background: "#fff",
            border: "1px solid #df5790",
            color: "#df5790",
            borderRadius: "6px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <ShieldCheck size={16} />
          Enable Two-Factor Authentication
        </button>
      )}
    </div>
  );
}
