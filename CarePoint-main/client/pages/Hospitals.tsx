import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Bed,
  Users,
  Phone,
  ArrowRight,
  Search,
  Filter,
  Heart,
  Clock,
  Shield,
} from "lucide-react";
import { Header } from "@/components/Header";

interface Hospital {
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
  image: string;
  verified: boolean;
  acceptingPatients: boolean;
}

const mockHospitals: Hospital[] = [
  {
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
    image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
    verified: true,
    acceptingPatients: true,
  },
  {
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
    image: "https://images.pexels.com/photos/8460160/pexels-photo-8460160.jpeg",
    verified: true,
    acceptingPatients: true,
  },
  {
    id: 3,
    name: "Grace Healthcare Institute",
    address: "789 Wellness Street, North District",
    distance: "5.2 km",
    rating: 4.7,
    reviews: 1523,
    availableBeds: 5,
    totalBeds: 40,
    doctors: 35,
    specialties: ["Emergency Care", "Trauma", "General Medicine"],
    phone: "+1 (555) 003-0003",
    image: "https://images.pexels.com/photos/9538593/pexels-photo-9538593.jpeg",
    verified: true,
    acceptingPatients: true,
  },
  {
    id: 4,
    name: "Sunrise Medical Clinic",
    address: "321 Health Boulevard, West End",
    distance: "4.1 km",
    rating: 4.5,
    reviews: 654,
    availableBeds: 15,
    totalBeds: 60,
    doctors: 28,
    specialties: ["Family Medicine", "Dentistry", "Orthopedics"],
    phone: "+1 (555) 004-0004",
    image: "https://images.pexels.com/photos/6812475/pexels-photo-6812475.jpeg",
    verified: false,
    acceptingPatients: true,
  },
  {
    id: 5,
    name: "Advanced Care Hospital",
    address: "654 Innovation Lane, Tech Park",
    distance: "6.5 km",
    rating: 4.9,
    reviews: 2103,
    availableBeds: 3,
    totalBeds: 100,
    doctors: 87,
    specialties: ["Oncology", "Neurosurgery", "Cardiac Surgery", "Pediatrics"],
    phone: "+1 (555) 005-0005",
    image: "https://images.pexels.com/photos/6473188/pexels-photo-6473188.jpeg",
    verified: true,
    acceptingPatients: false,
  },
  {
    id: 6,
    name: "Community Health Center",
    address: "987 Care Street, Suburbs",
    distance: "7.3 km",
    rating: 4.4,
    reviews: 423,
    availableBeds: 20,
    totalBeds: 55,
    doctors: 22,
    specialties: ["Family Medicine", "General Surgery", "Emergency"],
    phone: "+1 (555) 006-0006",
    image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
    verified: true,
    acceptingPatients: true,
  },
];

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "verified">("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "beds">(
    "distance",
  );
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve user profile from localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const user = JSON.parse(userProfile);
        setUserName(user.fullName || "");
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }
  }, []);

  useEffect(() => {
    let filtered = mockHospitals;

    if (search) {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.address.toLowerCase().includes(search.toLowerCase()) ||
          h.specialties.some((s) =>
            s.toLowerCase().includes(search.toLowerCase()),
          ),
      );
    }

    if (filter === "available") {
      filtered = filtered.filter((h) => h.availableBeds > 0);
    } else if (filter === "verified") {
      filtered = filtered.filter((h) => h.verified);
    }

    if (sortBy === "distance") {
      filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "beds") {
      filtered.sort((a, b) => b.availableBeds - a.availableBeds);
    }

    setHospitals(filtered);
  }, [search, filter, sortBy]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-primary">
              Find Hospitals Near You
            </h1>
            {userName && (
              <div className="bg-primary/10 border-2 border-primary/20 rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="text-lg font-bold text-primary">{userName}</p>
              </div>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            {hospitals.length} hospitals available with ratings and real-time
            bed availability
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hospitals, specialties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Filter className="w-4 h-4 inline-block mr-2" />
                Filter
              </label>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "available" | "verified")
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Hospitals</option>
                <option value="available">Beds Available</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "distance" | "rating" | "beds")
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="beds">Available Beds</option>
              </select>
            </div>

            {/* Info */}
            <div className="flex items-end">
              <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                <p className="font-medium">
                  💡 Tip: Enable location for better results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Hospital Image/Icon */}
                  <div
                    className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hospital.image})` }}
                  />

                  {/* Hospital Info */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-primary">
                            {hospital.name}
                          </h3>
                          {hospital.verified && (
                            <Shield className="w-5 h-5 text-success flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {hospital.address}
                        </p>
                      </div>
                      {!hospital.acceptingPatients && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap">
                          Not Accepting
                        </div>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-3 py-4 border-t border-b border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="font-bold text-primary">
                            {hospital.rating}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hospital.reviews} reviews
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Bed className="w-4 h-4 text-success" />
                          <span className="font-bold text-success">
                            {hospital.availableBeds}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          of {hospital.totalBeds} beds
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-secondary" />
                          <span className="font-bold text-secondary">
                            {hospital.doctors}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Doctors</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="font-bold text-accent">
                            {hospital.distance}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Away</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-foreground">
                        Key Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={`tel:${hospital.phone}`}
                        className="flex-1 border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <Link
                        to={`/hospital/${hospital.id}`}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-border">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hospitals found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
