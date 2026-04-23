import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  MessageSquare,
  Loader,
  CheckCircle,
  Navigation,
  Users,
  Clock,
  Ambulance as AmbulanceIcon,
} from "lucide-react";

interface Driver {
  id: number;
  name: string;
  rating: number;
  experience: number;
  verified: boolean;
  phone: string;
}

interface AmbulanceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const verifiedDrivers: Driver[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 4.9,
    experience: 8,
    verified: true,
    phone: "+1 (555) 100-1001",
  },
  {
    id: 2,
    name: "Priya Singh",
    rating: 4.8,
    experience: 6,
    verified: true,
    phone: "+1 (555) 100-1002",
  },
  {
    id: 3,
    name: "Arjun Patel",
    rating: 4.7,
    experience: 5,
    verified: true,
    phone: "+1 (555) 100-1003",
  },
];

export function AmbulanceBookingModal({
  isOpen,
  onClose,
}: AmbulanceBookingModalProps) {
  const [step, setStep] = useState<
    "booking" | "tracking" | "communication" | "success"
  >("booking");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: "user" | "driver"; text: string }>
  >([
    {
      id: "1",
      sender: "driver",
      text: "Hi! I'm your assigned paramedic. I'm on my way to your location. ETA 5 minutes.",
    },
  ]);
  const [messageInput, setMessageInput] = useState("");

  // Simulate ETA countdown
  useEffect(() => {
    if (isOpen && step === "tracking" && eta !== null && eta > 0) {
      const interval = setInterval(() => {
        setEta((prev) => {
          if (prev && prev > 0) return prev - 1;
          return prev;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen, step, eta]);

  // Simulate ambulance movement
  useEffect(() => {
    if (isOpen && step === "tracking" && ambulanceLocation) {
      const interval = setInterval(() => {
        setAmbulanceLocation((prev) => {
          if (!prev) return prev;
          return {
            lat: prev.lat + (Math.random() - 0.5) * 0.001,
            lng: prev.lng + (Math.random() - 0.5) * 0.001,
          };
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOpen, step, ambulanceLocation]);

  const handleBookAmbulance = async () => {
    if (!phone || !pickupLocation || !destination) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    // Simulate ambulance assignment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Randomly select a driver
    const randomDriver = verifiedDrivers[
      Math.floor(Math.random() * verifiedDrivers.length)
    ];
    setSelectedDriver(randomDriver);

    // Set initial ETA and distance
    setEta(Math.floor(Math.random() * 8) + 2);
    setDistance(Math.floor(Math.random() * 5) + 1);

    // Set ambulance location
    setAmbulanceLocation({
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.006 + (Math.random() - 0.5) * 0.1,
    });

    setLoading(false);
    setStep("tracking");
  };

  const handleStartTracking = () => {
    setStep("tracking");
  };

  const handleCommunicate = () => {
    setStep("communication");
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: messageInput,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Simulate driver response
    setTimeout(() => {
      const responses = [
        "Got it, heading to you right away!",
        "I'm almost there. Keep the entrance clear.",
        "Just around the corner. Be ready.",
        "On my way. Stay calm and safe.",
        "Will be there in 2 minutes.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "driver",
          text: randomResponse,
        },
      ]);
    }, 1000);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-accent to-orange-500 text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AmbulanceIcon className="w-5 h-5" />
            Emergency Ambulance
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step: Booking */}
          {step === "booking" && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Phone className="w-4 h-4 inline-block mr-2" />
                  Your Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  Pickup Location *
                </label>
                <textarea
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter your current location address"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  Destination Hospital (Optional)
                </label>
                <textarea
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="If you have a preferred hospital, enter it here"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-900">
                <p className="font-medium mb-1">⚠️ Emergency Alert</p>
                <p>
                  Your location will be shared with ambulance service. Multiple
                  ambulances will be notified based on proximity.
                </p>
              </div>

              <button
                onClick={handleBookAmbulance}
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent to-orange-500 text-white py-4 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Booking Ambulance...
                  </>
                ) : (
                  <>
                    <AmbulanceIcon className="w-5 h-5" />
                    Book Ambulance Now
                  </>
                )}
              </button>
            </>
          )}

          {/* Step: Tracking */}
          {step === "tracking" && selectedDriver && (
            <>
              {/* Driver Info */}
              <div className="bg-accent/10 border-2 border-accent/20 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Driver
                </h3>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedDriver.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedDriver.experience} years experience
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <span className="text-accent">★</span>
                      <span className="font-medium">{selectedDriver.rating}</span>
                      <span className="text-muted-foreground">(Verified)</span>
                    </p>
                  </div>
                  <a
                    href={`tel:${selectedDriver.phone}`}
                    className="bg-accent text-white p-2 rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Real-time Tracking */}
              <div className="space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Real-time Tracking
                </h3>

                {/* Map Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg border-2 border-accent/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-accent mx-auto mb-2 animate-bounce" />
                      <p className="text-sm text-foreground font-medium">
                        {ambulanceLocation?.lat.toFixed(4)},
                        {ambulanceLocation?.lng.toFixed(4)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Live Location
                      </p>
                    </div>
                  </div>
                </div>

                {/* ETA and Distance */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ETA</p>
                    <p className="text-2xl font-bold text-primary">
                      {eta || "Arriving"}
                    </p>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                  <div className="bg-secondary/10 border-2 border-secondary/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Distance</p>
                    <p className="text-2xl font-bold text-secondary">
                      {distance || "0.5"} km
                    </p>
                    <p className="text-xs text-muted-foreground">away</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCommunicate}
                className="w-full border-2 border-accent text-accent py-3 rounded-lg font-semibold hover:bg-accent/10 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Talk to Driver
              </button>
            </>
          )}

          {/* Step: Communication */}
          {step === "communication" && selectedDriver && (
            <>
              <div className="bg-accent/10 border-2 border-accent/20 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedDriver.name}
                  </p>
                  <p className="text-xs text-accent flex items-center gap-1 mt-1">
                    <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
                <a
                  href={`tel:${selectedDriver.phone}`}
                  className="bg-accent text-white p-2 rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>

              {/* Messages */}
              <div className="bg-muted/30 border border-border rounded-lg h-48 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "bg-accent text-white rounded-br-none"
                          : "bg-white border border-border rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Type message..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="bg-accent text-white p-2 rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setStep("tracking")}
                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all"
              >
                Back to Tracking
              </button>
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
                  Ambulance Booked!
                </h3>
                <p className="text-muted-foreground">
                  Your ambulance is on the way
                </p>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-medium text-success">
                  Booking Confirmed
                </p>
                <div className="text-sm text-foreground space-y-1">
                  <p>
                    Driver:{" "}
                    <strong>
                      {selectedDriver?.name}
                    </strong>
                  </p>
                  <p>ETA: <strong>{eta} minutes</strong></p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-accent to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
