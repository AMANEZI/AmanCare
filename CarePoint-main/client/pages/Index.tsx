import { Link } from "react-router-dom";
import {
  Hospital,
  MapPin,
  Heart,
  Ambulance,
  Users,
  Zap,
  PhoneCall,
  Clock,
  Shield,
  ArrowRight,
  Star,
} from "lucide-react";
import { Header } from "@/components/Header";

export default function Index() {
  const features = [
    {
      icon: Hospital,
      title: "Find Nearby Hospitals",
      description:
        "Discover hospitals near you with real-time location tracking",
    },
    {
      icon: Zap,
      title: "Emergency Response",
      description:
        "One-tap emergency service with automatic ambulance dispatch",
    },
    {
      icon: MapPin,
      title: "Bed Availability",
      description: "Check real-time bed availability and book instantly",
    },
    {
      icon: Users,
      title: "Expert Doctors",
      description: "Find specialists by department and view their credentials",
    },
    {
      icon: Ambulance,
      title: "Ambulance Booking",
      description: "Book ambulance service for fast and safe transport",
    },
    {
      icon: Heart,
      title: "AI Health Advisor",
      description: "Get instant health advice and medicine recommendations",
    },
  ];

  const stats = [
    { number: "500+", label: "Partner Hospitals" },
    { number: "24/7", label: "Emergency Support" },
    { number: "10K+", label: "Doctors" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  CarePoint at Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Fingertips
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Connect with hospitals, book beds, find specialist doctors,
                  and get emergency assistance—all in one app. Your health
                  journey starts here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/onboarding"
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-all inline-flex items-center justify-center gap-2"
                >
                  Login
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-primary/20">
                <div className="space-y-6">
                  {[
                    {
                      icon: Hospital,
                      title: "10 Hospitals",
                      desc: "Near you",
                    },
                    { icon: Users, title: "250+ Doctors", desc: "Available" },
                    { icon: Clock, title: "24/7 Support", desc: "Emergency" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-primary/10"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-primary">
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From finding hospitals to emergency response, we've got you
              covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-8 border border-border hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Trusted by Millions
              </h2>
              <p className="text-lg text-muted-foreground">
                We prioritize your safety, privacy, and well-being with
                industry-leading security standards and verified healthcare
                providers.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: "Secure & Private",
                    desc: "End-to-end encryption for all your health data",
                  },
                  {
                    icon: Heart,
                    title: "Verified Hospitals",
                    desc: "All hospitals are NABH certified and verified",
                  },
                  {
                    icon: PhoneCall,
                    title: "24/7 Support",
                    desc: "Our support team is always available to help",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { rating: 4.8, count: 2500, label: "Hospital Reviews" },
                { rating: 4.9, count: 1800, label: "Doctor Ratings" },
                { rating: 4.7, count: 3200, label: "Patient Reviews" },
                { rating: 4.8, count: 2100, label: "Service Ratings" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/10 text-center"
                >
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? "fill-warning text-warning" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {item.rating}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.count.toLocaleString()} {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Your Health, Our Priority
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of patients who trust us for their healthcare needs.
            Start your journey to better health today.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all group"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-primary">CarePoint</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making healthcare accessible to everyone
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  "Find Hospitals",
                  "Book Ambulance",
                  "AI Assistant",
                  "My Bookings",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Blog", "Careers"],
              },
              {
                title: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms of Service",
                  "Security",
                  "Compliance",
                ],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-primary mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 CarePoint. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-xs font-bold"
                  >
                    {social[0]}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
