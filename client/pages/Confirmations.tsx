import { useState, useEffect } from "react";
import { Mail, Trash2, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

interface Confirmation {
  id: string;
  timestamp: string;
  type: "bed_booking" | "account_creation" | "login_verification";
  email?: string;
  phoneNumber?: string;
  subject: string;
  body: string;
  userDetails?: {
    fullName: string;
  };
}

export default function Confirmations() {
  const navigate = useNavigate();
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [selectedConfirmation, setSelectedConfirmation] =
    useState<Confirmation | null>(null);

  useEffect(() => {
    // Load confirmations from localStorage
    const stored = localStorage.getItem("confirmations");
    if (stored) {
      try {
        setConfirmations(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading confirmations:", error);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = confirmations.filter((c) => c.id !== id);
    setConfirmations(updated);
    localStorage.setItem("confirmations", JSON.stringify(updated));
    if (selectedConfirmation?.id === id) {
      setSelectedConfirmation(null);
    }
  };

  const handleDownload = (confirmation: Confirmation) => {
    const content = `${confirmation.subject}
Date: ${new Date(confirmation.timestamp).toLocaleString()}
Email: ${confirmation.email}
From: CarePoint

${confirmation.body}`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `${confirmation.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bed_booking":
        return "Bed Booking";
      case "account_creation":
        return "Account Creation";
      case "login_verification":
        return "Login Verification";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bed_booking":
        return "bg-blue-100 text-blue-800";
      case "account_creation":
        return "bg-green-100 text-green-800";
      case "login_verification":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Confirmations</h1>
          <p className="text-muted-foreground">
            View all your email confirmations from bed bookings, account creation,
            and login verifications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Confirmations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow">
              {confirmations.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No confirmations yet. Make a booking to see them here!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {confirmations.map((confirmation) => (
                    <button
                      key={confirmation.id}
                      onClick={() => setSelectedConfirmation(confirmation)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                        selectedConfirmation?.id === confirmation.id
                          ? "bg-primary/10 border-l-4 border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {confirmation.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {confirmation.email}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-block text-xs font-medium px-2 py-1 rounded ${getTypeColor(
                                confirmation.type
                              )}`}
                            >
                              {getTypeLabel(confirmation.type)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(confirmation.timestamp).toLocaleDateString()}{" "}
                            {new Date(confirmation.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Details */}
          <div className="lg:col-span-2">
            {selectedConfirmation ? (
              <div className="bg-white rounded-xl shadow p-8 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-2">
                        {selectedConfirmation.subject}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        From: CarePoint Support
                      </p>
                      <p className="text-sm text-muted-foreground">
                        To: {selectedConfirmation.email}
                      </p>
                    </div>
                    <span
                      className={`inline-block text-sm font-medium px-3 py-1 rounded ${getTypeColor(
                        selectedConfirmation.type
                      )}`}
                    >
                      {getTypeLabel(selectedConfirmation.type)}
                    </span>
                  </div>
                  <div className="border-b border-border pb-4">
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedConfirmation.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                    {selectedConfirmation.body}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleDownload(selectedConfirmation)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(selectedConfirmation.id)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground">
                  {confirmations.length === 0
                    ? "No confirmations available"
                    : "Select a confirmation to view details"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
