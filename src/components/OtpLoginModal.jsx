// import { useUserAuth } from "@/context/UserAuthContext";
// import { getFirebaseAuth } from "@/services/firebaseClient";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { X } from "lucide-react";
// import { useEffect, useMemo, useRef, useState } from "react";

// const onlyDigits = (value) => String(value || "").replace(/\D/g, "");

// const maskPhone = (digits) => {
//   const raw = onlyDigits(digits);
//   if (!raw) {
//     return "";
//   }

//   const last4 = raw.slice(-4);
//   const masked = "*".repeat(Math.max(0, raw.length - 4)) + last4;
//   return `+91 ${masked}`;
// };

// const isValidIndianPhone = (digits) => {
//   const raw = onlyDigits(digits);
//   return raw.length === 10;
// };

// const isValidOtp = (digits) => {
//   const raw = onlyDigits(digits);
//   return raw.length === 6;
// };

// const toFriendlyFirebaseError = (err) => {
//   const code = String(err?.code || "");
//   if (!code) {
//     return err?.message || "Request failed. Please try again.";
//   }

//   switch (code) {
//     case "auth/operation-not-allowed":
//       return "Firebase Phone Auth is disabled. Enable it in Firebase Console → Authentication → Sign-in method → Phone.";
//     case "auth/unauthorized-domain":
//       return "Unauthorized domain. Add localhost to Firebase Console → Authentication → Settings → Authorized domains.";
//     case "auth/invalid-phone-number":
//       return "Invalid phone number.";
//     case "auth/too-many-requests":
//       return "Too many attempts. Please try again later.";
//     case "auth/quota-exceeded":
//       return "SMS quota exceeded for this Firebase project. Try later or use the Auth Emulator in dev.";
//     case "auth/captcha-check-failed":
//       return "reCAPTCHA failed. Refresh the page and try again.";
//     case "auth/missing-app-credential":
//       return "reCAPTCHA verification failed. Refresh the page and try again.";
//     default:
//       return err?.message || code;
//   }
// };

// const OtpLoginModal = ({ open, onClose, onLoginSuccess }) => {
//   const [step, setStep] = useState("phone"); // 'phone' | 'otp'
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [resendIn, setResendIn] = useState(0);

//   const { completeFirebaseLogin } = useUserAuth();

//   const confirmationResultRef = useRef(null);
//   const recaptchaRef = useRef(null);

//   const maskedPhone = useMemo(() => maskPhone(phone), [phone]);

//   const reset = () => {
//     setStep("phone");
//     setPhone("");
//     setOtp("");
//     setError("");
//     setIsSending(false);
//     setIsVerifying(false);
//     setResendIn(0);

//     confirmationResultRef.current = null;

//     try {
//       recaptchaRef.current?.clear?.();
//     } catch {
//       // ignore
//     }
//     recaptchaRef.current = null;
//   };

//   const close = () => {
//     onClose?.();
//     reset();
//   };

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     if (step !== "otp" || resendIn <= 0) {
//       return;
//     }

//     const timer = window.setInterval(() => {
//       setResendIn((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => window.clearInterval(timer);
//   }, [open, step, resendIn]);

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") {
//         close();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [open]);

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = previousOverflow;
//     };
//   }, [open]);

//   useEffect(() => {
//     if (open) {
//       setError("");
//     }
//   }, [open, step]);

//   const handleBackdropClick = (event) => {
//     if (event.target === event.currentTarget) {
//       close();
//     }
//   };

//   const handleSendOtp = async (event) => {
//     event.preventDefault();

//     if (isSending || isVerifying) {
//       return;
//     }

//     if (!isValidIndianPhone(phone)) {
//       setError("Enter a valid 10-digit mobile number");
//       return;
//     }

//     setError("");
//     setIsSending(true);
//     try {
//       const auth = getFirebaseAuth();

//       if (!recaptchaRef.current) {
//         recaptchaRef.current = new RecaptchaVerifier(
//           auth,
//           "firebase-recaptcha-container",
//           {
//             size: "invisible",
//           },
//         );
//       }

//       const fullPhone = `+91${onlyDigits(phone)}`;
//       const confirmation = await signInWithPhoneNumber(
//         auth,
//         fullPhone,
//         recaptchaRef.current,
//       );
//       confirmationResultRef.current = confirmation;

//       setStep("otp");
//       setOtp("");
//       setResendIn(60);
//     } catch (err) {
//       setError(toFriendlyFirebaseError(err));
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleVerifyOtp = async (event) => {
//     event.preventDefault();

//     if (isSending || isVerifying) {
//       return;
//     }

//     if (!isValidOtp(otp)) {
//       setError("Enter the 6-digit OTP");
//       return;
//     }

//     setError("");
//     setIsVerifying(true);
//     try {
//       const confirmation = confirmationResultRef.current;
//       if (!confirmation) {
//         setError("Please request a new OTP");
//         return;
//       }

//       const credential = await confirmation.confirm(onlyDigits(otp));
//       const idToken = await credential.user.getIdToken();

//       await completeFirebaseLogin(idToken);
//       onLoginSuccess?.();
//       close();
//     } catch (err) {
//       setError(toFriendlyFirebaseError(err));
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleChangeNumber = () => {
//     setStep("phone");
//     setOtp("");
//     setError("");
//     setResendIn(0);

//     confirmationResultRef.current = null;
//   };

//   const handleResend = async () => {
//     if (resendIn > 0 || isSending || isVerifying) {
//       return;
//     }

//     setError("");
//     setIsSending(true);
//     try {
//       const auth = getFirebaseAuth();

//       if (!recaptchaRef.current) {
//         recaptchaRef.current = new RecaptchaVerifier(
//           auth,
//           "firebase-recaptcha-container",
//           {
//             size: "invisible",
//           },
//         );
//       }

//       const fullPhone = `+91${onlyDigits(phone)}`;
//       const confirmation = await signInWithPhoneNumber(
//         auth,
//         fullPhone,
//         recaptchaRef.current,
//       );
//       confirmationResultRef.current = confirmation;
//       setResendIn(60);
//     } catch (err) {
//       setError(toFriendlyFirebaseError(err));
//     } finally {
//       setIsSending(false);
//     }
//   };

//   if (!open) {
//     return null;
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
//       onMouseDown={handleBackdropClick}
//       role="dialog"
//       aria-modal="true"
//       aria-label="OTP login"
//     >
//       <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-lg animate-in zoom-in-95 duration-200">
//         <div className="flex items-center justify-between gap-3 border-b border-border bg-primary px-5 py-4 text-primary-foreground">
//           <div>
//             <p className="text-sm opacity-90">Welcome back</p>
//             <h2 className="text-lg font-semibold leading-tight">
//               Login with OTP
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={close}
//             className="rounded-md p-2 hover:bg-black/10 transition-colors"
//             aria-label="Close"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="p-5">
//           <div className="mb-4 flex items-center gap-2 text-sm">
//             <div
//               className={`h-2.5 flex-1 rounded-full ${
//                 step === "phone" ? "bg-primary" : "bg-primary/70"
//               }`}
//             />
//             <div
//               className={`h-2.5 flex-1 rounded-full ${
//                 step === "otp" ? "bg-primary" : "bg-muted"
//               }`}
//             />
//           </div>

//           <div className="relative min-h-[300px]">
//             <div
//               className={`absolute inset-0 transition-all duration-300 ${
//                 step === "phone"
//                   ? "opacity-100 translate-x-0"
//                   : "opacity-0 -translate-x-6 pointer-events-none"
//               }`}
//             >
//               <div className="rounded-xl border border-border bg-muted/30 p-4">
//                 <form onSubmit={handleSendOtp} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">
//                       Mobile number
//                     </label>
//                     <div className="flex gap-2">
//                       <div className="flex items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground">
//                         +91
//                       </div>
//                       <input
//                         autoFocus
//                         type="tel"
//                         inputMode="numeric"
//                         value={phone}
//                         onChange={(e) =>
//                           setPhone(onlyDigits(e.target.value).slice(0, 10))
//                         }
//                         disabled={isSending || isVerifying}
//                         className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="Enter 10-digit number"
//                         aria-label="Phone number"
//                         required
//                       />
//                     </div>
//                     <p className="mt-2 text-xs text-muted-foreground">
//                       We’ll send a one-time password to this number.
//                     </p>
//                   </div>

//                   {error ? (
//                     <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
//                       <p className="text-sm text-destructive">{error}</p>
//                     </div>
//                   ) : null}

//                   <button
//                     type="submit"
//                     disabled={isSending || isVerifying}
//                     className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
//                   >
//                     {isSending ? "Sending..." : "Send OTP"}
//                   </button>

//                   <div id="firebase-recaptcha-container" />
//                 </form>
//               </div>
//             </div>

//             <div
//               className={`absolute inset-0 transition-all duration-300 ${
//                 step === "otp"
//                   ? "opacity-100 translate-x-0"
//                   : "opacity-0 translate-x-6 pointer-events-none"
//               }`}
//             >
//               <div className="rounded-xl border border-border bg-muted/30 p-4">
//                 <form onSubmit={handleVerifyOtp} className="space-y-4">
//                   <div className="flex items-start justify-between gap-3">
//                     <p className="text-sm text-muted-foreground">
//                       OTP sent to{" "}
//                       <span className="font-semibold text-foreground">
//                         {maskedPhone}
//                       </span>
//                     </p>
//                     <button
//                       type="button"
//                       onClick={handleChangeNumber}
//                       className="text-sm font-semibold text-primary hover:opacity-90"
//                     >
//                       Change
//                     </button>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">
//                       Enter OTP
//                     </label>
//                     <input
//                       autoFocus
//                       type="tel"
//                       inputMode="numeric"
//                       value={otp}
//                       onChange={(e) =>
//                         setOtp(onlyDigits(e.target.value).slice(0, 6))
//                       }
//                       disabled={isSending || isVerifying}
//                       className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground tracking-[0.35em] focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="••••••"
//                       aria-label="OTP"
//                       required
//                     />
//                     <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
//                       <p>OTP expires in 5 minutes.</p>
//                       <p>
//                         {resendIn > 0
//                           ? `Resend in ${resendIn}s`
//                           : "You can resend OTP"}
//                       </p>
//                     </div>
//                   </div>

//                   {error ? (
//                     <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
//                       <p className="text-sm text-destructive">{error}</p>
//                     </div>
//                   ) : null}

//                   <button
//                     type="submit"
//                     disabled={isSending || isVerifying}
//                     className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
//                   >
//                     {isVerifying ? "Verifying..." : "Verify & Login"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleResend}
//                     disabled={resendIn > 0 || isSending || isVerifying}
//                     className="w-full rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground hover:bg-muted/50 transition-colors disabled:opacity-60"
//                   >
//                     Resend OTP
//                   </button>

//                   <button
//                     type="button"
//                     onClick={close}
//                     disabled={isSending || isVerifying}
//                     className="w-full rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground hover:bg-muted/50 transition-colors disabled:opacity-60"
//                   >
//                     Cancel
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpLoginModal;

import { useUserAuth } from "@/context/UserAuthContext";
import { getFirebaseAuth } from "@/services/firebaseClient";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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

const toFriendlyFirebaseError = (err) => {
  const code = String(err?.code || "");
  if (!code) return err?.message || "Request failed. Please try again.";
  switch (code) {
    case "auth/operation-not-allowed":
      return "Firebase Phone Auth is disabled. Enable it in Firebase Console → Authentication → Sign-in method → Phone.";
    case "auth/unauthorized-domain":
      return "Unauthorized domain. Add localhost to Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/invalid-phone-number":
      return "Invalid phone number.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded for this Firebase project. Try later or use the Auth Emulator in dev.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA failed. Refresh the page and try again.";
    case "auth/missing-app-credential":
      return "reCAPTCHA verification failed. Refresh the page and try again.";
    default:
      return err?.message || code;
  }
};

const OtpLoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const { completeFirebaseLogin } = useUserAuth();
  const confirmationResultRef = useRef(null);
  const recaptchaRef = useRef(null);
  const maskedPhone = useMemo(() => maskPhone(phone), [phone]);

  const reset = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setError("");
    setIsSending(false);
    setIsVerifying(false);
    setResendIn(0);
    confirmationResultRef.current = null;
    try {
      recaptchaRef.current?.clear?.();
    } catch {}
    recaptchaRef.current = null;
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
      const auth = getFirebaseAuth();
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "firebase-recaptcha-container",
          { size: "invisible" },
        );
      }
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${onlyDigits(phone)}`,
        recaptchaRef.current,
      );
      confirmationResultRef.current = confirmation;
      setStep("otp");
      setOtp("");
      setResendIn(60);
    } catch (err) {
      setError(toFriendlyFirebaseError(err));
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
      const confirmation = confirmationResultRef.current;
      if (!confirmation) {
        setError("Please request a new OTP");
        return;
      }
      const credential = await confirmation.confirm(onlyDigits(otp));
      const idToken = await credential.user.getIdToken();
      await completeFirebaseLogin(idToken);
      onLoginSuccess?.();
      close();
    } catch (err) {
      setError(toFriendlyFirebaseError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangeNumber = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setResendIn(0);
    confirmationResultRef.current = null;
  };

  const handleResend = async () => {
    if (resendIn > 0 || isSending || isVerifying) return;
    setError("");
    setIsSending(true);
    try {
      const auth = getFirebaseAuth();
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "firebase-recaptcha-container",
          { size: "invisible" },
        );
      }
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${onlyDigits(phone)}`,
        recaptchaRef.current,
      );
      confirmationResultRef.current = confirmation;
      setResendIn(60);
    } catch (err) {
      setError(toFriendlyFirebaseError(err));
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

              <div id="firebase-recaptcha-container" />
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
