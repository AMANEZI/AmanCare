import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MapPin,
  Star,
  Bed,
  Users,
  Phone,
  Clock,
  Shield,
  Award,
  Heart,
  Stethoscope,
  Zap,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BedBookingModal } from "@/components/BedBookingModal";
import { AppointmentBookingModal } from "@/components/AppointmentBookingModal";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  workingHours?: {
    startTime: string;
    endTime: string;
    daysAvailable: string[];
  };
}

interface HospitalData {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  availableBeds: number;
  totalBeds: number;
  doctors: number;
  specialties: string[];
  phone: string;
  email: string;
  established: number;
  beds: Array<{ type: string; available: number; total: number }>;
  departments: string[];
  amenities: string[];
  verified: boolean;
  acceptingPatients: boolean;
  image: string;
  topDoctors: Doctor[];
}

const hospitalDatabase: Record<number, HospitalData> = {
  1: {
    id: 1,
    name: "City Medical Center",
    address: "123 Healthcare Ave, Downtown",
    distance: "2.3 km",
    rating: 4.8,
    reviews: 1245,
    availableBeds: 8,
    totalBeds: 50,
    doctors: 42,
    specialties: ["Cardiology", "Neurology", "Orthopedics", "General Surgery"],
    phone: "+1 (555) 001-0001",
    email: "info@citymedicalhq.com",
    established: 2005,
    image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
    verified: true,
    acceptingPatients: true,
    beds: [
      { type: "ICU", available: 2, total: 10 },
      { type: "General Ward", available: 4, total: 20 },
      { type: "Private Room", available: 2, total: 20 },
      { type: "VIP Room", available: 1, total: 5 },
    ],
    departments: [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "General Surgery",
      "Pediatrics",
      "Emergency Medicine",
    ],
    amenities: [
      "24/7 Emergency Care",
      "Advanced Diagnostic Center",
      "Pharmacy",
      "Cafeteria",
      "Parking",
      "WiFi",
    ],
    topDoctors: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        experience: 15,
        rating: 4.9,
        workingHours: {
          startTime: "09:00",
          endTime: "17:00",
          daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        specialization: "Neurology",
        experience: 12,
        rating: 4.8,
        workingHours: {
          startTime: "10:00",
          endTime: "18:00",
          daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialization: "Orthopedics",
        experience: 10,
        rating: 4.7,
        workingHours: {
          startTime: "08:00",
          endTime: "16:00",
          daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
    ],
  },
  2: {
    id: 2,
    name: "St. Joseph's Hospital",
    address: "456 Medical Plaza, Midtown",
    distance: "3.8 km",
    rating: 4.6,
    reviews: 892,
    availableBeds: 12,
    totalBeds: 75,
    doctors: 58,
    specialties: ["Pediatrics", "Oncology", "Cardiology", "Dermatology"],
    phone: "+1 (555) 002-0002",
    email: "info@stjosephshospital.com",
    established: 1998,
    image: "https://images.pexels.com/photos/8460160/pexels-photo-8460160.jpeg",
    verified: true,
    acceptingPatients: true,
    beds: [
      { type: "ICU", available: 3, total: 15 },
      { type: "General Ward", available: 6, total: 30 },
      { type: "Private Room", available: 3, total: 30 },
      { type: "VIP Room", available: 2, total: 8 },
    ],
    departments: [
      "Pediatrics",
      "Oncology",
      "Cardiology",
      "Dermatology",
      "General Medicine",
      "Surgery",
    ],
    amenities: [
      "Pediatric Care",
      "Oncology Center",
      "Research Lab",
      "Library",
      "Chapel",
      "Cafeteria",
    ],
    topDoctors: [
      {
        id: 1,
        name: "Dr. James Wilson",
        specialization: "Pediatrics",
        experience: 18,
        rating: 4.9,
        workingHours: {
          startTime: "09:00",
          endTime: "17:00",
          daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
      {
        id: 2,
        name: "Dr. Patricia Lee",
        specialization: "Oncology",
        experience: 14,
        rating: 4.8,
        workingHours: {
          startTime: "10:00",
          endTime: "18:00",
          daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
      {
        id: 3,
        name: "Dr. David Martinez",
        specialization: "Cardiology",
        experience: 11,
        rating: 4.7,
        workingHours: {
          startTime: "08:00",
          endTime: "16:00",
          daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
      },
    ],
  },
};

export default function HospitalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const hospital = hospitalDatabase[parseInt(id || "1")];

  if (!hospital) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Hospital Not Found
          </h1>
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hospitals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Hospital Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
          <div
            className="h-48 sm:h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${hospital.image})` }}
          />
          <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-primary">
                      {hospital.name}
                    </h1>
                    {hospital.verified && (
                      <Shield className="w-6 h-6 text-success flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {hospital.address}
                  </p>
                </div>
                {!hospital.acceptingPatients && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg whitespace-nowrap">
                    Not Accepting Patients
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                    <span className="font-bold text-lg text-primary">
                      {hospital.rating}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {hospital.reviews} reviews
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bed className="w-5 h-5 text-success" />
                    <span className="font-bold text-lg text-success">
                      {hospital.availableBeds}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {hospital.totalBeds} beds
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="font-bold text-lg text-secondary">
                      {hospital.doctors}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Doctors</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="font-bold text-lg text-accent">
                      {new Date().getFullYear() - hospital.established} yrs
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Established</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bed Availability */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Bed Availability
              </h2>
              <div className="space-y-4">
                {hospital.beds.map((bed, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {bed.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bed.available} of {bed.total} available
                      </p>
                    </div>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{
                          width: `${(bed.available / bed.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments & Specialties */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Departments & Specialties
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {hospital.departments.map((dept, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10"
                  >
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {dept}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Doctors */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Top Doctors
              </h2>
              <div className="space-y-4">
                {hospital.topDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-4 border border-border rounded-lg hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {doctor.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization} • {doctor.experience} yrs
                          experience
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-semibold text-primary">
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                    {doctor.workingHours && (
                      <div className="bg-primary/5 rounded-lg p-3 text-sm space-y-2">
                        <p className="text-xs font-semibold text-primary">Working Hours & Availability:</p>
                        <p className="text-muted-foreground">
                          ⏰ {doctor.workingHours.startTime} - {doctor.workingHours.endTime}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {doctor.workingHours.daysAvailable.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Hospital Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {hospital.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-secondary/5 rounded-lg border border-secondary/10"
                  >
                    <Heart className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Booking */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-6 shadow sticky top-24">
              <h3 className="text-lg font-bold text-primary mb-4">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${hospital.phone}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {hospital.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${hospital.email}`}
                      className="font-semibold text-secondary hover:underline text-sm break-all"
                    >
                      {hospital.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hours</p>
                    <p className="font-semibold text-accent">24/7 Open</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border my-4" />

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-3"
              >
                Book a Bed
              </button>
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bed Booking Modal */}
      <BedBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hospitalName={hospital.name}
        hospitalId={hospital.id}
        availableBeds={hospital.beds}
      />

      {/* Appointment Booking Modal */}
      <AppointmentBookingModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        hospitalName={hospital.name}
        hospitalId={hospital.id}
        doctors={hospital.topDoctors}
        phone={hospital.phone}
      />
    </div>
  );
}
