import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Car, 
  Smartphone, 
  Clock, 
  Shield, 
  Star, 
  MapPin, 
  Users, 
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  MessageCircle,
  Phone,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import autorickshawHero from '@/assets/autorickshaw-hero.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleDriverLogin = () => {
    navigate('/driver/auth');
  };

  const handleAdminLogin = () => {
    navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/');
  };

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Instant Booking",
      description: "Book your autorickshaw in seconds with our smart matching system"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Safe & Secure",
      description: "Verified drivers and real-time tracking for your peace of mind"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Live Tracking",
      description: "Track your ride in real-time and share location with family"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted Drivers",
      description: "Professional drivers with excellent ratings and local knowledge"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Book a Ride",
      description: "Enter your pickup and destination locations"
    },
    {
      number: "02", 
      title: "Get Matched",
      description: "We'll find the nearest available driver for you"
    },
    {
      number: "03",
      title: "Track & Ride",
      description: "Track your driver and enjoy a comfortable journey"
    }
  ];

  const testimonials = [
    {
      name: "Priya Menon",
      location: "Vadanappally",
      rating: 5,
      text: "Hey Auto has made my daily commute so much easier. The drivers are always punctual and the app is very user-friendly."
    },
    {
      name: "Rajesh Kumar",
      location: "Vadanappally", 
      rating: 5,
      text: "Great service! I love being able to track my ride and know exactly when it will arrive. Highly recommended!"
    },
    {
      name: "Anita Nair",
      location: "Vadanappally",
      rating: 5, 
      text: "The booking process is so simple and the drivers are very professional. This is exactly what Vadanappally needed!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src={autorickshawHero} 
                alt="Hey Auto"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-primary">Hey Auto</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleGetStarted}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Get Started
                  </Button>
                  <Button 
                    onClick={handleDriverLogin}
                    variant="outline"
                    size="sm"
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Driver
                  </Button>
                  <Button 
                    onClick={handleAdminLogin}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile Apps Coming Soon
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Ride,
                <span className="block text-yellow-300">Your Way</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Experience the future of autorickshaw booking in Vadanappally. 
                Quick, reliable, and safe rides at your fingertips with our 
                upcoming mobile apps.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg"
                >
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleDriverLogin}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Drive with Us
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <span>No surge pricing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <span>24/7 available</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
            <img 
              src={autorickshawHero} 
                  alt="Hey Auto App Preview"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Hey Auto Introduction Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-kerala-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
              <Star className="mr-2 h-4 w-4" />
              Welcome to Hey Auto
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-kerala-green bg-clip-text text-transparent">
              Revolutionizing Autorickshaw Travel
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Hey Auto is more than just a ride-booking platform – we're transforming the way people 
              travel in Vadanappally and beyond. Built with cutting-edge technology and a deep understanding 
              of local transportation needs, we're creating a seamless, safe, and reliable autorickshaw 
              experience for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Community First</h3>
                <p className="text-muted-foreground">
                  We're built by the community, for the community. Every feature is designed 
                  with the local Vadanappally community in mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-kerala-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-kerala-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-kerala-green">Safety & Trust</h3>
                <p className="text-muted-foreground">
                  Your safety is our priority. All drivers are verified, and every ride 
                  is tracked with advanced security measures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Always Available</h3>
                <p className="text-muted-foreground">
                  Whether it's early morning or late night, Hey Auto is here 24/7 to 
                  get you where you need to go, when you need to get there.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary/10">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-primary">
                Our Mission
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                To make autorickshaw travel in Vadanappally and surrounding areas more accessible, 
                reliable, and enjoyable for everyone. We're bridging the gap between traditional 
                transport and modern technology, ensuring that every ride is not just a journey, 
                but an experience worth remembering.
              </p>
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 font-semibold px-8 py-4"
                >
                  Join the Hey Auto Family
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Apps Coming Soon Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-kerala-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Download className="mr-2 h-4 w-4" />
              Coming Soon
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile Apps Coming Soon
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get ready for the ultimate autorickshaw booking experience with our 
              dedicated mobile apps for iOS and Android.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Passenger App</h3>
                <p className="text-muted-foreground mb-6">
                  Book rides, track drivers, and manage your trips with our 
                  intuitive passenger app.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>One-tap booking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Real-time tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Multiple payment options</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Ride history & receipts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-kerala-green/20 hover:border-kerala-green/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-kerala-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="h-8 w-8 text-kerala-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Driver App</h3>
                <p className="text-muted-foreground mb-6">
                  Manage your rides, earnings, and schedule with our comprehensive 
                  driver app.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Smart ride matching</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Earnings tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Navigation integration</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Customer ratings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Be the first to know when our apps launch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <MessageCircle className="mr-2 h-5 w-5" />
                Get Notified
              </Button>
              <Button size="lg" variant="outline">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Hey Auto?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the best autorickshaw service in Vadanappally with 
              features designed for your convenience and safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting your autorickshaw ride is simple and fast. 
              Just follow these three easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary/30 transform translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied 
              customers have to say about Hey Auto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers in Vadanappally who trust 
            Hey Auto for their daily commute. Book your first ride today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg"
            >
              Start Riding Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={handleDriverLogin}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
            >
              <Car className="mr-2 h-5 w-5" />
              Become a Driver
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={autorickshawHero} 
                  alt="Hey Auto"
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-primary">Hey Auto</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted autorickshaw booking service in Vadanappally. 
                Quick, safe, and reliable rides at your fingertips.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Ride Booking</li>
                <li>Driver Registration</li>
                <li>Live Tracking</li>
                <li>Mobile Apps (Coming Soon)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Driver Support</li>
                <li>Safety Guidelines</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Vadanappally, Kerala</li>
                <li>+91 12345 67890</li>
                <li>support@autonow.in</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Surag Dev Studio | HeyAuto. All rights reserved.</p>
        </div>
      </div>
      </footer>
    </div>
  );
};

export default LandingPage;
