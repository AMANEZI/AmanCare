import { useState, useEffect } from "react";
import { X, Calendar, Users, CheckCircle, Loader, Mail, Phone } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName: string;
  hospitalId: number;
  doctors: Doctor[];
  phone: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export function AppointmentBookingModal({
  isOpen,
  onClose,
  hospitalName,
  hospitalId,
  doctors,
  phone,
}: AppointmentBookingModalProps) {
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
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

  const handleBooking = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) return;

    setLoading(true);

    const appointment = {
      id: Math.random().toString(36).substr(2, 9),
      hospitalId,
      hospitalName,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      appointmentDate,
      appointmentTime,
      reason,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
      type: "appointment",
    };

    // Save to localStorage first
    const appointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );
    appointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

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
              bedType: `Dr. ${selectedDoctor.name} (${selectedDoctor.specialization})`,
              checkInDate: appointmentDate,
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
    setSelectedDoctor(null);
    setAppointmentDate("");
    setAppointmentTime("");
    setReason("");
    setConfirmationStatus(null);
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate());
    return today.toISOString().split("T")[0];
  };

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Schedule Appointment</h2>
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
                  <Users className="w-4 h-4 inline-block mr-2" />
                  Select Doctor
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        selectedDoctor?.id === doctor.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-foreground">
                          {doctor.name}
                        </p>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          ★ {doctor.rating}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization} • {doctor.experience} yrs exp
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Preferred Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setAppointmentTime(time)}
                      className={`p-2 border-2 rounded-lg font-medium transition-all text-sm ${
                        appointmentTime === time
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Brief reason for your appointment..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                />
              </div>

              <button
                onClick={() => setStep("confirm")}
                disabled={!selectedDoctor || !appointmentDate || !appointmentTime}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Review
              </button>
            </>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && selectedDoctor && (
            <>
              <div className="space-y-4 bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-primary">
                  Appointment Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hospital:</span>
                    <span className="font-medium text-foreground">
                      {hospitalName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="font-medium text-foreground">
                      {selectedDoctor.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Specialization:
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedDoctor.specialization}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">
                      {new Date(appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">
                      {appointmentTime}
                    </span>
                  </div>
                  {reason && (
                    <div>
                      <span className="text-muted-foreground">Reason:</span>
                      <p className="font-medium text-foreground mt-1">{reason}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-2">What happens next?</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Your appointment request will be sent to the hospital</li>
                  <li>You'll receive confirmation via email/SMS</li>
                  <li>
                    Hospital will confirm availability and time slot
                  </li>
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
                    "Confirm Appointment"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step: Success */}
          {step === "success" && selectedDoctor && (
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
                  Appointment Scheduled!
                </h3>
                <p className="text-muted-foreground">
                  Your appointment request has been sent to the hospital.
                </p>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-medium text-success">
                  Appointment Details:
                </p>
                <div className="text-sm text-foreground space-y-1">
                  <p>
                    Doctor:{" "}
                    <strong>{selectedDoctor.name}</strong>
                  </p>
                  <p>
                    Date:{" "}
                    <strong>
                      {new Date(appointmentDate).toLocaleDateString()}
                    </strong>
                  </p>
                  <p>
                    Time: <strong>{appointmentTime}</strong>
                  </p>
                </div>
              </div>

              {confirmationStatus && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900">
                  <p className="font-bold mb-3">✓ Appointment Confirmation Email Sent</p>
                  <div className="space-y-2 text-left bg-white rounded p-3">
                    <p><strong>To:</strong> {userProfile?.email}</p>
                    <p><strong>Subject:</strong> Appointment Confirmation - Dr. {selectedDoctor?.name}</p>
                    <div className="border-t border-green-200 mt-2 pt-2 text-xs">
                      <p className="font-semibold mb-2">Email Content:</p>
                      <div className="bg-gray-50 p-2 rounded font-mono text-xs leading-relaxed">
                        <p>Dear {userProfile?.fullName},</p>
                        <p className="mt-2">Your appointment has been successfully scheduled!</p>
                        <p className="mt-2"><strong>Appointment Details:</strong></p>
                        <p>Hospital: {hospitalName}</p>
                        <p>Doctor: Dr. {selectedDoctor?.name}</p>
                        <p>Specialization: {selectedDoctor?.specialization}</p>
                        <p>Date: {new Date(appointmentDate).toLocaleDateString()}</p>
                        <p>Time: {appointmentTime}</p>
                        <p className="mt-2">The hospital will contact you shortly to confirm the appointment slot.</p>
                        <p className="mt-2">Best regards,<br/>CarePoint Team</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                <p>
                  <strong>Note:</strong> Hospital will contact you shortly to
                  confirm the appointment slot.
                </p>
              </div>

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
