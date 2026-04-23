import { Header } from "@/components/Header";
import { ArrowRight, Ambulance, Lock, MapPin, Phone, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AmbulanceBookingModal } from "@/components/AmbulanceBookingModal";

export default function AmbulancePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const features = [
    {
      icon: Ambulance,
      title: "Instant Booking",
      description: "Book an ambulance in seconds with our quick booking system",
      action: "Book Now",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your ambulance in real-time from pickup to hospital",
      action: "Track Ambulance",
    },
    {
      icon: Phone,
      title: "Direct Communication",
      description: "Stay connected with paramedics throughout the journey",
      action: "Communicate",
    },
    {
      icon: Lock,
      title: "Verified Drivers",
      description: "All drivers are trained and verified paramedics",
      action: "View Drivers",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-orange-500 rounded-2xl flex items-center justify-center mb-6">
            <Ambulance className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Emergency Ambulance Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable ambulance service available 24/7. Get medical assistance
            in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => setIsBookingOpen(true)}
              className="border-2 border-border rounded-xl p-6 hover:border-accent hover:shadow-lg hover:bg-accent/5 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {feature.description}
              </p>
              <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                {feature.action}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-accent/10 to-orange-100 border-2 border-accent/20 rounded-2xl p-8 text-center space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-primary">
            Need an Ambulance Right Now?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Don't wait. Our ambulances are stationed throughout the city and can reach
            you in minutes. Click below to book instantly.
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-gradient-to-r from-accent to-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all inline-flex items-center gap-2 group"
          >
            <Ambulance className="w-5 h-5 group-hover:animate-pulse" />
            Book Emergency Ambulance
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Breakdown */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">
            Why Choose Our Ambulance Service?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Ambulance className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Average response time of 4-5 minutes across the city
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    Trained Paramedics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All drivers are certified paramedics with advanced training
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Safe & Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Background checked drivers with verified credentials
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Live Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time GPS tracking from dispatch to hospital
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    24/7 Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Direct communication with drivers and emergency coordinators
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    All Hospital Transfers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Can take you to any hospital of your choice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Other Services:
          </h3>
          <div className="space-y-3">
            <Link
              to="/hospitals"
              className="block p-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg font-semibold transition-all"
            >
              Find nearby hospitals
            </Link>
            <Link
              to="/ai-assistant"
              className="block p-4 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-lg font-semibold transition-all"
            >
              Talk to our AI health assistant
            </Link>
          </div>
        </div>
      </div>

      {/* Ambulance Booking Modal */}
      <AmbulanceBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
