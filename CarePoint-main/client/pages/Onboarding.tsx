import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader,
  Check,
} from "lucide-react";
import { Header } from "@/components/Header";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "location" | "complete">("info");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    ageGroup: "",
    bloodType: "",
  });

  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const [error, setError] = useState("");
  const [confirmationStatus, setConfirmationStatus] = useState<{
    method: "email" | "sms" | "both";
    emailSent?: boolean;
    smsSent?: boolean;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!formData.ageGroup) {
      setError("Please select your age group");
      return false;
    }
    if (!formData.bloodType) {
      setError("Please select your blood type");
      return false;
    }
    return true;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep("location");
      setError("");
    }
  };

  const requestLocation = async () => {
    setLoading(true);
    setError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ latitude, longitude });
          setLoading(false);
          setStep("complete");
        },
        (error) => {
          console.error("Location error:", error);
          setError(
            "Unable to access your location. Please enable location services and try again.",
          );
          setLoading(false);
        },
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    // Save user data
    const userData = { ...formData, location: locationData };
    localStorage.setItem("userProfile", JSON.stringify(userData));

    // Send account creation confirmation
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          type: "account_creation",
          userDetails: {
            fullName: formData.fullName,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setConfirmationStatus({
          method: result.method,
          emailSent: result.emailSent,
          smsSent: result.smsSent,
        });

        // Store confirmation in localStorage
        if (result.emailSent && formData.email) {
          const confirmation = {
            id: result.confirmationId || Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            type: "account_creation",
            email: formData.email,
            subject: "Welcome to CarePoint - Account Created Successfully",
            body: `Hello ${formData.fullName},\n\nWelcome to CarePoint! Your account has been successfully created.\n\nYou can now access healthcare services in your area:\n- Find nearby hospitals\n- Book beds and appointments\n- Get emergency assistance\n- Consult with doctors\n\nBest regards,\nCarePoint Team`,
            userDetails: {
              fullName: formData.fullName,
            },
          };

          const stored = localStorage.getItem("confirmations") || "[]";
          const confirmations = JSON.parse(stored);
          confirmations.push(confirmation);
          localStorage.setItem("confirmations", JSON.stringify(confirmations));
        }
      } else {
        console.error("Failed to send account creation confirmation");
      }
    } catch (error) {
      console.error("Error sending account creation confirmation:", error);
    } finally {
      setLoading(false);
      // Navigate after a short delay to show confirmation status
      setTimeout(() => {
        navigate("/hospitals");
      }, 2000);
    }
  };

  const skipLocation = () => {
    const userData = { ...formData, location: null };
    localStorage.setItem("userProfile", JSON.stringify(userData));
    navigate("/hospitals");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[
              { step: "info", label: "Your Info" },
              { step: "location", label: "Location" },
              { step: "complete", label: "Complete" },
            ].map((s, idx) => (
              <div key={s.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === s.step ||
                    idx < ["info", "location", "complete"].indexOf(step)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["info", "location", "complete"].indexOf(s.step) <
                  ["info", "location", "complete"].indexOf(step) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step === s.step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {idx < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded-full ${
                      ["info", "location", "complete"].indexOf(step) > idx
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: User Information */}
        {step === "info" && (
          <div className="space-y-8">
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-bold text-primary">
                Let's Get to Know You
              </h1>
              <p className="text-muted-foreground">
                We need some basic information to personalize your healthcare
                experience
              </p>
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 inline-block mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Phone className="w-4 h-4 inline-block mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="john@example.com"
                />
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age Group *
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select your age group</option>
                  <option value="0-18">0-18 years</option>
                  <option value="18-30">18-30 years</option>
                  <option value="30-50">30-50 years</option>
                  <option value="50-70">50-70 years</option>
                  <option value="70+">70+ years</option>
                </select>
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Heart className="w-4 h-4 inline-block mr-2" />
                  Blood Type *
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select your blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Location Permission */}
        {step === "location" && (
          <div className="space-y-8">
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-primary">
                Enable Location Services
              </h1>
              <p className="text-muted-foreground">
                We'll use your location to find nearby hospitals and emergency
                services. This data is kept private and secure.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Location helps us:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Find the nearest hospitals</li>
                    <li>Provide faster ambulance response</li>
                    <li>Show relevant medical services nearby</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={requestLocation}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Accessing Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    Enable Location
                  </>
                )}
              </button>
              <button
                onClick={skipLocation}
                className="w-full border-2 border-primary text-primary py-4 rounded-lg font-semibold hover:bg-primary/5 transition-all"
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === "complete" && (
          <div className="space-y-8 text-center">
            {!confirmationStatus && !loading && (
              <>
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-primary">
                    You're All Set!
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Your profile has been created successfully.
                  </p>
                  {locationData && (
                    <p className="text-sm text-success font-medium">
                      ✓ Location enabled for better hospital recommendations
                    </p>
                  )}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-left space-y-3">
                  <h3 className="font-semibold text-primary">Profile Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium text-foreground">
                        {formData.fullName}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium text-foreground">
                        {formData.phoneNumber}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium text-foreground">
                        {formData.email}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Blood Type:</span>{" "}
                      <span className="font-medium text-success">
                        {formData.bloodType}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Start Using CarePoint
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {loading && (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-primary">
                    Sending Confirmation...
                  </h2>
                  <p className="text-muted-foreground">
                    A confirmation message is being sent to your contact details
                  </p>
                </div>
              </div>
            )}

            {confirmationStatus && !loading && (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-primary">
                    Welcome to CarePoint!
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Your account has been created successfully.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-bold text-green-900">✓ Account Creation Confirmation Email Sent</p>
                  <div className="space-y-2 text-left bg-white rounded p-3">
                    <p><strong>To:</strong> {formData.email}</p>
                    <p><strong>Subject:</strong> Welcome to CarePoint - Account Created Successfully</p>
                    <div className="border-t border-green-200 mt-2 pt-2 text-xs">
                      <p className="font-semibold mb-2">Email Content:</p>
                      <div className="bg-gray-50 p-2 rounded font-mono text-xs leading-relaxed">
                        <p>Dear {formData.fullName},</p>
                        <p className="mt-2">Welcome to CarePoint! Your account has been successfully created.</p>
                        <p className="mt-2">You can now access healthcare services in your area:</p>
                        <p>• Find nearby hospitals</p>
                        <p>• Book beds and appointments</p>
                        <p>• Get emergency assistance</p>
                        <p>• Consult with doctors</p>
                        <p className="mt-2">Best regards,<br/>CarePoint Team</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Redirecting to hospitals in a moment...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
