import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, Brain, Users } from "lucide-react";

// Define a simple OnboardingModal component for functionality
function OnboardingModal({ onClose, onTryDemo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center mb-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
            alt="BarberAI Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to BarberAI!</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Discover your perfect haircut with AI-powered recommendations. Upload a selfie and get personalized styling suggestions instantly and for free!
        </p>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={onClose}
            className="barber-gradient text-white px-8 py-3 text-lg hover:opacity-90 transition-all duration-300 luxury-shadow"
          >
            <Crown className="w-5 h-5 mr-2" />
            Let's Start! (It's Free!)
          </Button>
          <Button
            onClick={onTryDemo}
            variant="outline"
            className="px-8 py-3 text-lg border-2 hover:bg-gray-50 transition-all duration-300"
          >
            <Users className="w-5 h-5 mr-2" />
            Try a Demo first
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    // Show onboarding for first-time users
    const hasSeenOnboarding = localStorage.getItem('barber-ai-onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('barber-ai-onboarding', 'true');
  };

  const handleTryDemo = () => {
    setShowOnboarding(false);
    localStorage.setItem('barber-ai-onboarding', 'true');
    // Navigate to demo
    window.location.href = createPageUrl('Recommend') + '?demo=true';
  };

  const handleGetStarted = () => {
    window.location.href = createPageUrl('Recommend');
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our AI automatically detects your face shape, gender, and age from your selfie for truly personalized results."
    },
    {
      icon: Users,
      title: "Expert Recommendations",
      description: "Get professional-grade suggestions and detailed styling guides based on stylist expertise."
    },
    {
      icon: CheckCircle,
      title: "Completely Free & No Signup",
      description: "Use all features without creating an account. No costs or hidden fees. Ever."
    }
  ];

  return (
    <div className="min-h-screen">
      {showOnboarding && (
        <OnboardingModal 
          onClose={handleCloseOnboarding}
          onTryDemo={handleTryDemo}
        />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,58,138,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 barber-gradient rounded-2xl flex items-center justify-center luxury-shadow overflow-hidden">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                  alt="BarberAI Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Haircut
              </span>
            </h1>
            
            {/* Always Free Feature */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Crown className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  🎉 100% FREE - No Signup Required! Unlimited AI previews.
                </span>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Discover the ideal hairstyle for your face shape with AI-powered recommendations. 
              Upload a selfie and get personalized styling suggestions instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={createPageUrl('Recommend')}>
                <Button size="lg" className="barber-gradient text-white px-8 py-4 text-lg hover:opacity-90 transition-all duration-300 luxury-shadow">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                    alt="BarberAI"
                    className="w-5 h-5 mr-2 object-contain"
                  />
                  Get My Free Recommendations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                alt="BarberAI Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge technology combines computer vision and machine learning 
              to deliver personalized hairstyle recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 barber-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:premium-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Forever Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                alt="BarberAI Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything is FREE - No Signup
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No account creation, no payments, no subscriptions, no hidden fees. All features completely free.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-200 luxury-shadow">
              <div className="text-center mb-8">
                <div className="barber-gradient text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  100% Free Forever - No Account Needed
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">All Features</h3>
                <div className="text-3xl font-bold text-green-600">$0.00</div>
                <p className="text-gray-600 text-lg">Never pay anything</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited haircut recommendations",
                  "Unlimited AI image previews",
                  "Advanced AI feature detection",
                  "No signup or account required",
                  "No API charges or hidden fees"
                ].map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full py-3 text-lg barber-gradient text-white hover:opacity-90 transition-all duration-300"
                onClick={handleGetStarted}
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                  alt="BarberAI"
                  className="w-5 h-5 mr-2 object-contain"
                />
                Start Using All Features Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 barber-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
              alt="BarberAI Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who've discovered their perfect hairstyle with BarberAI.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-800 px-8 py-4 text-lg hover:bg-gray-100 transition-all duration-300"
            onClick={handleGetStarted}
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
              alt="BarberAI"
              className="w-5 h-5 mr-2 object-contain"
            />
            Start Your Free Experience
          </Button>
        </div>
      </section>
    </div>
  );
}
