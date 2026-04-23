import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Zap, ArrowLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Emergency() {
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (activated) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activated]);

  const handleEmergencyActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setActivated(true);
    }, 2000);
  };

  if (activated) {
    return (
      <div className="fixed inset-0 bg-red-600 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse">
              <div className="w-20 h-20 mx-auto bg-red-400 rounded-full opacity-75" />
            </div>
            <div className="relative flex items-center justify-center">
              <Zap className="w-16 h-16 text-yellow-300" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Emergency Mode Active</h1>
            <p className="text-red-100">
              Ambulance is being dispatched to your location
            </p>
          </div>

          <div className="bg-red-700 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-red-100">Elapsed Time</p>
              <p className="text-4xl font-bold">
                {String(Math.floor(timeElapsed / 60)).padStart(2, "0")}:
                {String(timeElapsed % 60).padStart(2, "0")}
              </p>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button className="w-full bg-white text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition-all">
              Contact Operator (Recommended)
            </button>
            <button
              onClick={() => {
                setActivated(false);
                setTimeElapsed(0);
                navigate("/");
              }}
              className="w-full border-2 border-white text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-all"
            >
              Cancel Emergency
            </button>
          </div>

          <p className="text-sm text-red-100">
            Emergency services are coordinating with nearest hospitals
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="max-w-md w-full space-y-8 text-center">
        {/* Warning Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full bg-red-400 rounded-full opacity-30" />
          </div>
          <div className="relative flex items-center justify-center h-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-red-600">Emergency</h1>
          <p className="text-lg text-muted-foreground">
            Tap the button below to request emergency assistance immediately
          </p>
        </div>

        {/* Location Status */}
        {location ? (
          <div className="flex items-center gap-2 justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Location detected and ready
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-pulse">
            <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
            <span className="text-sm font-medium text-yellow-900">
              Getting your location...
            </span>
          </div>
        )}

        {/* Emergency Button */}
        <button
          onClick={handleEmergencyActivate}
          disabled={isActivating || !location}
          className={`w-full py-6 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${
            isActivating
              ? "bg-red-500 text-white opacity-75"
              : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-2xl hover:scale-105 active:scale-95"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isActivating ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              Activating...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              EMERGENCY - TAP HERE
            </>
          )}
        </button>

        {/* What Happens */}
        <div className="space-y-4 bg-gray-50 rounded-lg p-6">
          <h3 className="font-bold text-foreground">What happens next:</h3>
          <ol className="space-y-3 text-sm text-muted-foreground text-left">
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">1.</span>
              <span>Nearest hospitals are alerted</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">2.</span>
              <span>Ambulance is dispatched to your location</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">3.</span>
              <span>You'll be taken to the nearest hospital</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">4.</span>
              <span>Hospital staff will be ready to receive you</span>
            </li>
          </ol>
        </div>

        {/* Important Note */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-left">
          <p className="text-sm text-red-900">
            <strong>⚠️ Important:</strong> Only use in genuine emergencies. False
            alarms may result in delays for other patients in need.
          </p>
        </div>
      </div>
    </div>
  );
}
