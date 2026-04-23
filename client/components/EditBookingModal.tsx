import { useState } from "react";
import { X, Save, Calendar, FileText } from "lucide-react";

interface Booking {
  id: string;
  hospitalId: number;
  hospitalName: string;
  bedType: string;
  checkInDate: string;
  notes?: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
  type: "bed";
}

interface Appointment {
  id: string;
  hospitalId: number;
  hospitalName: string;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
  type: "appointment";
}

type BookingItem = Booking | Appointment;

interface EditBookingModalProps {
  booking: BookingItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBooking: BookingItem) => void;
}

export default function EditBookingModal({
  booking,
  isOpen,
  onClose,
  onSave,
}: EditBookingModalProps) {
  const [formData, setFormData] = useState<BookingItem>(() => ({
    ...booking,
    ...(booking.type === "bed" && {
      notes: (booking as Booking).notes ?? "",
    }),
    ...(booking.type === "appointment" && {
      reason: (booking as Appointment).reason ?? "",
    }),
  }));
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const isBedBooking = booking.type === "bed";
  const bedBooking = booking as Booking;
  const appointment = booking as Appointment;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {isBedBooking ? "Edit Bed Booking" : "Edit Appointment"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Hospital Name - Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Hospital
            </label>
            <div className="px-4 py-3 bg-muted/50 rounded-lg text-foreground">
              {formData.hospitalName}
            </div>
          </div>

          {isBedBooking ? (
            <>
              {/* Bed Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bed Type
                </label>
                <input
                  type="text"
                  value={(formData as Booking).bedType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bedType: e.target.value,
                    } as Booking)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={(formData as Booking).checkInDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      checkInDate: e.target.value,
                    } as Booking)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Special Notes
                </label>
                <textarea
                  value={(formData as Booking).notes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    } as Booking)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  placeholder="Add any special requirements or notes..."
                />
              </div>
            </>
          ) : (
            <>
              {/* Doctor Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={(formData as Appointment).doctorName}
                  className="w-full px-4 py-3 bg-muted/50 rounded-lg text-foreground"
                  disabled
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={(formData as Appointment).specialization}
                  className="w-full px-4 py-3 bg-muted/50 rounded-lg text-foreground"
                  disabled
                />
              </div>

              {/* Appointment Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={(formData as Appointment).appointmentDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentDate: e.target.value,
                    } as Appointment)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Appointment Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Appointment Time
                </label>
                <input
                  type="time"
                  value={(formData as Appointment).appointmentTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentTime: e.target.value,
                    } as Appointment)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Reason for Visit
                </label>
                <textarea
                  value={(formData as Appointment).reason || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reason: e.target.value,
                    } as Appointment)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  placeholder="Describe your reason for the appointment..."
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-border text-foreground px-4 py-3 rounded-lg font-medium hover:bg-muted/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
