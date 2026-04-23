import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader,
  MailCheck,
} from "lucide-react";
import { Header } from "@/components/Header";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "verify" | "success">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentVerificationCode, setSentVerificationCode] = useState("");

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Send login verification
    try {
      const response = await fetch("/api/notifications/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          type: "login_verification",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setVerificationSent(true);
        // Generate verification code - must match what's in the email template
        const codeForDemo = Math.random().toString().slice(2, 8);
        setSentVerificationCode(codeForDemo);
        setVerificationCode("");

        // Log code for testing/debugging
        console.log("🔐 VERIFICATION CODE FOR TESTING:", codeForDemo);

        // Store verification confirmation in localStorage
        if (result.emailSent && email) {
          const confirmation = {
            id: result.confirmationId || Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            type: "login_verification",
            email: email,
            code: codeForDemo,
            subject: "CarePoint - Login Verification Code",
            body: `Hello,\n\nYour login verification code has been sent.\n\nPlease check your email for the verification code.\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this message.\n\nBest regards,\nCarePoint Team`,
          };

          const stored = localStorage.getItem("confirmations") || "[]";
          const confirmations = JSON.parse(stored);
          confirmations.push(confirmation);
          localStorage.setItem("confirmations", JSON.stringify(confirmations));
        }

        setStep("verify");
      } else {
        const errorMessage = result.message || "Failed to send verification code. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error sending verification:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const enteredCode = verificationCode.trim();

    if (!enteredCode) {
      setError("Please enter the verification code");
      return;
    }

    // Debug log
    console.log("Entered code:", enteredCode);
    console.log("Sent code:", sentVerificationCode);
    console.log("Match:", enteredCode === sentVerificationCode);

    // Verify the code (case-insensitive comparison)
    if (enteredCode.toLowerCase() === sentVerificationCode.toLowerCase()) {
      // Code is correct
      localStorage.setItem("userEmail", email);
      setStep("success");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/hospitals");
      }, 2000);
    } else {
      setError(`Invalid verification code. Check your email and try again. (Entered: ${enteredCode})`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Email Entry */}
        {step === "email" && (
          <div className="space-y-8">
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
              <p className="text-muted-foreground">
                Enter your email to access your healthcare account
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending Verification...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/onboarding")}
                  className="text-primary hover:underline font-semibold"
                >
                  Create one
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Step 2: Verification */}
        {step === "verify" && (
          <div className="space-y-8">
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <MailCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary">
                Check Your Email
              </h1>
              <p className="text-muted-foreground">
                We've sent a verification code to:
              </p>
              <p className="font-semibold text-foreground">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 space-y-2">
              <p className="font-medium">What to do next:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Check your email for the verification code</li>
                <li>The code will expire in 10 minutes</li>
                <li>If you don't see the email, check your spam folder</li>
              </ul>
            </div>

            {sentVerificationCode && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900">
                <p className="font-medium mb-2">Testing Code Available:</p>
                <p className="font-mono text-lg tracking-widest font-bold text-green-700">
                  {sentVerificationCode}
                </p>
                <p className="text-xs mt-2 opacity-75">
                  Enter this code above to verify your login
                </p>
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={verificationCode}
                  onChange={(e) => {
                    // Only allow numeric input
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setVerificationCode(numericValue);
                    setError("");
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Verify Code
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <button
              onClick={() => {
                setStep("email");
                setVerificationCode("");
                setError("");
              }}
              className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="space-y-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-primary">
                Verified Successfully!
              </h1>
              <p className="text-lg text-muted-foreground">
                You're now logged in to CarePoint.
              </p>
            </div>

            <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-medium text-success">✓ Login Successful</p>
              <p className="text-sm text-foreground">
                Email verified: <strong>{email}</strong>
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              Redirecting to hospitals in a moment...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
