import { Header } from "@/components/Header";
import EditBookingModal from "@/components/EditBookingModal";
import {
  CalendarIcon,
  Hospital,
  BookOpen,
  ArrowRight,
  Bed,
  Users,
  Clock,
  MapPin,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const bedBookings = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    ) as Booking[];
    const appointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    ) as Appointment[];

    const allBookings = [...bedBookings, ...appointments].sort((a, b) => {
      const dateA = a.type === "bed" ? a.checkInDate : a.appointmentDate;
      const dateB = b.type === "bed" ? b.checkInDate : b.appointmentDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    setBookings(allBookings);
  }, []);

  const getFilteredBookings = () => {
    const today = new Date().toISOString().split("T")[0];

    return bookings.filter((booking) => {
      const date =
        booking.type === "bed" ? booking.checkInDate : booking.appointmentDate;
      if (filter === "upcoming") {
        return date >= today;
      } else if (filter === "past") {
        return date < today;
      }
      return true;
    });
  };

  const openEditModal = (booking: BookingItem) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = (updatedBooking: BookingItem) => {
    const updatedBookings = bookings.map((b) =>
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setBookings(updatedBookings);

    const bedBookings = updatedBookings.filter(
      (b) => b.type === "bed"
    ) as Booking[];
    const appointments = updatedBookings.filter(
      (b) => b.type === "appointment"
    ) as Appointment[];

    localStorage.setItem("bookings", JSON.stringify(bedBookings));
    localStorage.setItem("appointments", JSON.stringify(appointments));
  };

  const cancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      );
      setBookings(updatedBookings);

      const bedBookings = updatedBookings.filter(
        (b) => b.type === "bed"
      ) as Booking[];
      const appointments = updatedBookings.filter(
        (b) => b.type === "appointment"
      ) as Appointment[];

      localStorage.setItem("bookings", JSON.stringify(bedBookings));
      localStorage.setItem("appointments", JSON.stringify(appointments));
    }
  };

  const filteredBookings = getFilteredBookings();
  const hasBookings = bookings.length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Bookings</h1>
          <p className="text-lg text-muted-foreground">
            View and manage all your hospital appointments and bed bookings
          </p>
        </div>

        {hasBookings ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {(["all", "upcoming", "past"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border-2 border-border text-foreground hover:border-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-lg border-2 ${
                      booking.status === "cancelled"
                        ? "border-red-200 opacity-75"
                        : "border-border hover:border-primary/30"
                    } p-6 transition-all`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              booking.type === "bed"
                                ? "bg-primary/20"
                                : "bg-secondary/20"
                            }`}
                          >
                            {booking.type === "bed" ? (
                              <Bed
                                className={`w-5 h-5 ${
                                  booking.type === "bed"
                                    ? "text-primary"
                                    : "text-secondary"
                                }`}
                              />
                            ) : (
                              <Users
                                className={`w-5 h-5 ${
                                  booking.type === "bed"
                                    ? "text-primary"
                                    : "text-secondary"
                                }`}
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              {booking.hospitalName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.type === "bed" ? (
                                <span className="flex items-center gap-1">
                                  <Bed className="w-4 h-4" />
                                  {(booking as Booking).bedType} Bed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  Dr. {(booking as Appointment).doctorName} -
                                  {(booking as Appointment).specialization}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(
                              booking.type === "bed"
                                ? (booking as Booking).checkInDate
                                : (booking as Appointment).appointmentDate
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          {booking.type === "appointment" && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {(booking as Appointment).appointmentTime}
                            </div>
                          )}
                        </div>

                        {booking.type === "bed" &&
                          (booking as Booking).notes && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Special Notes:
                              </p>
                              <p className="text-sm text-foreground">
                                {(booking as Booking).notes}
                              </p>
                            </div>
                          )}

                        {booking.type === "appointment" &&
                          (booking as Appointment).reason && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Reason for Visit:
                              </p>
                              <p className="text-sm text-foreground">
                                {(booking as Appointment).reason}
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Right Content - Status and Actions */}
                      <div className="sm:text-right space-y-3">
                        <div
                          className={`inline-block px-4 py-2 rounded-lg border-2 text-sm font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <div className="flex items-center gap-2">
                            {booking.status === "confirmed" && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            {booking.status === "pending" && (
                              <Clock className="w-4 h-4" />
                            )}
                            {booking.status === "cancelled" && (
                              <X className="w-4 h-4" />
                            )}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </div>

                        {booking.status !== "cancelled" && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => openEditModal(booking)}
                              className="w-full sm:w-auto border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="w-full sm:w-auto border-2 border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking ID */}
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border-2 border-border p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No {filter !== "all" ? filter : ""} bookings
                  </h3>
                  <p className="text-muted-foreground">
                    You don't have any {filter !== "all" ? filter : ""} bookings
                    yet
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg border-2 border-border p-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No Bookings Yet
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Once you book a hospital bed or schedule an appointment, it will
                appear here.
              </p>
            </div>
            <Link
              to="/hospitals"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Hospital className="w-5 h-5" />
              Find Hospitals
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Edit Booking Modal */}
        {editingBooking && (
          <EditBookingModal
            booking={editingBooking}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingBooking(null);
            }}
            onSave={handleSaveBooking}
          />
        )}
      </div>
    </div>
  );
}
