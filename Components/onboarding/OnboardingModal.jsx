import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Camera, Brain, Sparkles, Shield, ArrowRight, Play } from 'lucide-react';

export default function OnboardingModal({ onClose, onTryDemo }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to BarberAI",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto barber-gradient rounded-2xl flex items-center justify-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
              alt="BarberAI"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Get Your Perfect Haircut</h3>
          <p className="text-gray-600">
            AI-powered haircut recommendations with realistic preview images, 
            completely free with unlimited attempts.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-xs text-gray-600">Take or Upload Photo</p>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-xs text-gray-600">AI Analysis</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-xs text-gray-600">Get Recommendations</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "How It Works",
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 barber-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <div>
              <h4 className="font-semibold text-gray-900">Upload Your Photo</h4>
              <p className="text-sm text-gray-600">Take a selfie or upload a clear front-facing photo</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 barber-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <div>
              <h4 className="font-semibold text-gray-900">AI Analyzes Your Features</h4>
              <p className="text-sm text-gray-600">Face shape, ethnicity, and hair type detection</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 barber-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <div>
              <h4 className="font-semibold text-gray-900">Get Personalized Results</h4>
              <p className="text-sm text-gray-600">Professional barber instructions + AI preview images</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Privacy & Security",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-gray-900">Your Privacy Matters</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Photos are only used for AI analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Images deleted automatically unless saved to history</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>No data sharing with third parties</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Account data is securely encrypted</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full luxury-shadow border-0 relative">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
          <CardTitle className="text-center">{steps[step].title}</CardTitle>
          <div className="flex justify-center space-x-2 mt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          {steps[step].content}
          
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 0}
              className="text-gray-500"
            >
              Back
            </Button>
            
            <div className="flex space-x-2">
              {step === 0 && (
                <Button
                  variant="outline"
                  onClick={onTryDemo}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                className="barber-gradient text-white"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
