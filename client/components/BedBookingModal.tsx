import { useState, useEffect } from "react";
import { X, Calendar, Bed, CheckCircle, Loader, Mail, Phone } from "lucide-react";

interface BedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName: string;
  hospitalId: number;
  availableBeds: Array<{ type: string; available: number; total: number }>;
}

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export function BedBookingModal({
  isOpen,
  onClose,
  hospitalName,
  hospitalId,
  availableBeds,
}: BedBookingModalProps) {
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
  const [selectedBedType, setSelectedBedType] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<{
    method: "email" | "sms" | "both";
    emailSent?: boolean;
    smsSent?: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Load user profile from localStorage
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedBed = availableBeds.find((b) => b.type === selectedBedType);

  const handleBooking = async () => {
    if (!selectedBedType || !checkInDate) return;

    setLoading(true);

    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      hospitalId,
      hospitalName,
      bedType: selectedBedType,
      checkInDate,
      notes,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    };

    // Save to localStorage first
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Send confirmation notification
    if (userProfile?.email || userProfile?.phoneNumber) {
      try {
        const response = await fetch("/api/notifications/send-confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userProfile.email,
            phoneNumber: userProfile.phoneNumber,
            type: "bed_booking",
            bookingDetails: {
              hospitalName,
              bedType: selectedBedType,
              checkInDate,
            },
            userDetails: {
              fullName: userProfile.fullName,
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
        } else {
          console.error("Failed to send confirmation");
        }
      } catch (error) {
        console.error("Error sending confirmation:", error);
      }
    }

    setLoading(false);
    setStep("success");
  };

  const handleClose = () => {
    setStep("select");
    setSelectedBedType(null);
    setCheckInDate("");
    setNotes("");
    setConfirmationStatus(null);
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate());
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Book a Bed</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step: Select */}
          {step === "select" && (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Hospital</p>
                <p className="font-semibold text-foreground">{hospitalName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  <Bed className="w-4 h-4 inline-block mr-2" />
                  Select Bed Type
                </label>
                <div className="space-y-3">
                  {availableBeds.map((bed) => (
                    <button
                      key={bed.type}
                      onClick={() => setSelectedBedType(bed.type)}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        selectedBedType === bed.type
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">
                          {bed.type}
                        </p>
                        {bed.available > 0 ? (
                          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Full
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bed.available} of {bed.total} beds available
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or medical conditions..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                />
              </div>

              <button
                onClick={() => setStep("confirm")}
                disabled={!selectedBedType || !checkInDate}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Review
              </button>
            </>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && selectedBed && (
            <>
              <div className="space-y-4 bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-primary">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hospital:</span>
                    <span className="font-medium text-foreground">
                      {hospitalName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bed Type:</span>
                    <span className="font-medium text-foreground">
                      {selectedBedType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium text-foreground">
                      {new Date(checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  {notes && (
                    <div>
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="font-medium text-foreground mt-1">{notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-2">What happens next?</p>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>Hospital receives your booking request</li>
                  <li className="flex items-start gap-2">
                    <span>You'll receive a confirmation via:</span>
                    <div className="flex gap-2 mt-1">
                      {userProfile?.email && <span className="bg-blue-200 px-2 py-1 rounded text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>}
                      {userProfile?.phoneNumber && <span className="bg-blue-200 px-2 py-1 rounded text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> SMS</span>}
                    </div>
                  </li>
                  <li>Hospital will contact you with further details</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("select")}
                  className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse" />
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary">
                  Booking Confirmed!
                </h3>
                <p className="text-muted-foreground">
                  Your bed booking request has been sent to the hospital.
                </p>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-medium text-success">Booking Details:</p>
                <div className="text-sm text-foreground space-y-1">
                  <p>Bed Type: <strong>{selectedBedType}</strong></p>
                  <p>Check-in: <strong>{new Date(checkInDate).toLocaleDateString()}</strong></p>
                </div>
              </div>

              {confirmationStatus && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900">
                  <p className="font-bold mb-3">✓ Booking Confirmation Email Sent</p>
                  <div className="space-y-2 text-left bg-white rounded p-3">
                    <p><strong>To:</strong> {userProfile?.email}</p>
                    <p><strong>Subject:</strong> Bed Booking Confirmation - {hospitalName}</p>
                    <div className="border-t border-green-200 mt-2 pt-2 text-xs">
                      <p className="font-semibold mb-2">Email Content:</p>
                      <div className="bg-gray-50 p-2 rounded font-mono text-xs leading-relaxed">
                        <p>Dear {userProfile?.fullName},</p>
                        <p className="mt-2">Your bed booking has been successfully confirmed!</p>
                        <p className="mt-2"><strong>Booking Details:</strong></p>
                        <p>Hospital: {hospitalName}</p>
                        <p>Bed Type: {selectedBedType}</p>
                        <p>Check-in Date: {new Date(checkInDate).toLocaleDateString()}</p>
                        <p className="mt-2">The hospital will contact you shortly with further details.</p>
                        <p className="mt-2">Best regards,<br/>CarePoint Team</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
