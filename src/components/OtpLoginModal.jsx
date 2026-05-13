import { useUserAuth } from "@/context/UserAuthContext";
import { resendOtp, sendOtp } from "@/services/authApi";
import { useEffect, useMemo, useRef, useState } from "react";

const onlyDigits = (value) => String(value || "").replace(/\D/g, "");

const maskPhone = (digits) => {
  const raw = onlyDigits(digits);
  if (!raw) return "";
  const last4 = raw.slice(-4);
  const masked = "*".repeat(Math.max(0, raw.length - 4)) + last4;
  return `+91 ${masked}`;
};

const isValidIndianPhone = (digits) => onlyDigits(digits).length === 10;
const isValidOtp = (digits) => onlyDigits(digits).length === 6;

const toFriendlyOtpError = (err) =>
  err?.message || "Request failed. Please try again.";

const OtpLoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const { completeOtpLogin } = useUserAuth();
  const lastPhoneSentRef = useRef(null);
  const maskedPhone = useMemo(() => maskPhone(phone), [phone]);

  const reset = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setError("");
    setIsSending(false);
    setIsVerifying(false);
    setResendIn(0);
    lastPhoneSentRef.current = null;
  };

  const close = () => {
    onClose?.();
    reset();
  };

  useEffect(() => {
    if (!open) return;
    if (step !== "otp" || resendIn <= 0) return;
    const timer = window.setInterval(
      () => setResendIn((p) => (p > 0 ? p - 1 : 0)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [open, step, resendIn]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) setError("");
  }, [open, step]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (isSending || isVerifying) return;
    if (!isValidIndianPhone(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      const raw = onlyDigits(phone);
      await sendOtp(raw);
      lastPhoneSentRef.current = raw;
      setStep("otp");
      setOtp("");
      setResendIn(60);
    } catch (err) {
      setError(toFriendlyOtpError(err));
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isSending || isVerifying) return;
    if (!isValidOtp(otp)) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setError("");
    setIsVerifying(true);
    try {
      const rawPhone = lastPhoneSentRef.current || onlyDigits(phone);
      if (!rawPhone || rawPhone.length !== 10) {
        setError("Please request a new OTP");
        return;
      }

      await completeOtpLogin({ phone: rawPhone, code: onlyDigits(otp) });
      onLoginSuccess?.();
      close();
    } catch (err) {
      setError(toFriendlyOtpError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangeNumber = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setResendIn(0);
    lastPhoneSentRef.current = null;
  };

  const handleResend = async () => {
    if (resendIn > 0 || isSending || isVerifying) return;
    setError("");
    setIsSending(true);
    try {
      const raw = lastPhoneSentRef.current || onlyDigits(phone);
      await resendOtp(raw);
      lastPhoneSentRef.current = raw;
      setResendIn(60);
    } catch (err) {
      setError(toFriendlyOtpError(err));
    } finally {
      setIsSending(false);
    }
  };

  if (!open) return null;

  // ── Design from LoginOtpModal ─────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      style={{
        backdropFilter: "blur(4px)",
        animation: "otp-fade-in 0.18s ease both",
      }}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="OTP login"
    >
      <style>{`
        @keyframes otp-fade-in { from { opacity:0 } to { opacity:1 } }
        @keyframes otp-slide-up { from { transform:translateY(18px);opacity:0 } to { transform:translateY(0);opacity:1 } }
      `}</style>

      {/* Card */}
      <div
        className="w-full overflow-hidden rounded-2xl border border-[#f0dfd2] bg-white"
        style={{
          maxWidth: 400,
          boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
          animation: "otp-slide-up 0.22s cubic-bezier(.32,1.1,.48,1) both",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ── Gradient header ── */}
        <div
          className="px-5 pt-5 pb-4 relative"
          style={{
            background:
              "linear-gradient(120deg, rgba(249,116,21,0.14) 0%, rgba(249,116,21,0.05) 45%, rgba(255,255,255,1) 100%)",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <p className="text-xl font-semibold text-[#1A1A1A]">
            {step === "phone" ? "Login with OTP" : "Verify OTP"}
          </p>
          <p className="text-sm text-[#5f5f5f] leading-relaxed mt-1">
            {step === "phone"
              ? "Enter your mobile number to receive a one-time password."
              : `Enter the 6-digit code sent to ${maskedPhone}.`}
          </p>
        </div>

        {/* ── Body ── */}
        <div className="px-5 pb-5 pt-4">
          {/* Phone step */}
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
                  <span className="px-3 py-2.5 text-sm text-[#6b7280] border-r border-[#e5e7eb]">
                    +91
                  </span>
                  <input
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(onlyDigits(e.target.value).slice(0, 10))
                    }
                    disabled={isSending}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-3 py-2.5 text-sm text-[#1a1a1a] bg-transparent outline-none placeholder-[#9ca3af]"
                    aria-label="Phone number"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-xl h-10 text-sm font-semibold text-white"
                style={{
                  background: isSending ? "#f0a070" : "#e85d04",
                  border: "none",
                  cursor: isSending ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {isSending ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {/* OTP step */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#333333]">
                    Enter OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-xs font-semibold"
                    style={{
                      color: "#e85d04",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Change number
                  </button>
                </div>

                {/* OTP input — 6 separate boxes */}
                <div
                  style={{ display: "flex", gap: 8, justifyContent: "center" }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      id={`otp-slot-${i}`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ""}
                      disabled={isSending || isVerifying}
                      onChange={(e) => {
                        const digit = onlyDigits(e.target.value).slice(-1);
                        const arr = otp.split("");
                        arr[i] = digit;
                        const next = arr.join("").slice(0, 6);
                        setOtp(next);
                        if (digit && i < 5)
                          document.getElementById(`otp-slot-${i + 1}`)?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0)
                          document.getElementById(`otp-slot-${i - 1}`)?.focus();
                      }}
                      autoFocus={i === 0}
                      style={{
                        width: 44,
                        height: 44,
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        border: "1.5px solid #e5e7eb",
                        borderRadius: 10,
                        outline: "none",
                        background: "#fff",
                        color: "#1a1a1a",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#e85d04";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[#9ca3af]">
                    OTP expires in 5 minutes.
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    {resendIn > 0
                      ? `Resend in ${resendIn}s`
                      : "You can resend OTP"}
                  </p>
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSending || isVerifying}
                className="w-full rounded-xl h-10 text-sm font-semibold text-white"
                style={{
                  background: isSending || isVerifying ? "#f0a070" : "#e85d04",
                  border: "none",
                  cursor: isSending || isVerifying ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {isVerifying ? "Verifying…" : "Verify and Login"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0 || isSending || isVerifying}
                className="w-full rounded-xl h-10 text-sm font-semibold"
                style={{
                  background: "none",
                  border: "none",
                  color:
                    resendIn > 0 || isSending || isVerifying
                      ? "#d1a080"
                      : "#a85316",
                  cursor:
                    resendIn > 0 || isSending || isVerifying
                      ? "not-allowed"
                      : "pointer",
                  transition: "color 0.15s",
                }}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpLoginModal;
