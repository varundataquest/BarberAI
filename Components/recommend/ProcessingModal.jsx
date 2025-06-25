import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Brain } from 'lucide-react';

export default function ProcessingModal({ message, onCancel, showCancel = true }) {
  const [dots, setDots] = useState('');
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const slowTimeout = setTimeout(() => {
      setShowSlowMessage(true);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(slowTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full luxury-shadow border-0">
        <CardContent className="p-8 text-center relative">
          {showCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          
          <div className="w-16 h-16 mx-auto mb-6 barber-gradient rounded-2xl flex items-center justify-center relative overflow-hidden">
            <Brain className="w-8 h-8 text-white animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🤖 AI Processing{dots}
          </h2>
          
          <p className="text-lg font-medium text-blue-700 mb-4">
            {message}
          </p>
          
          {showSlowMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Still working, almost done!</strong><br />
                Creating your personalized preview images...
              </p>
            </div>
          )}
          
          <div className="space-y-2 text-sm text-gray-600">
            {message.includes("analyzing") && (
              <p>• Detecting face shape and features</p>
            )}
            {message.includes("recommendations") && (
              <p>• Generating professional barber instructions</p>
            )}
            {message.includes("preview") && (
              <div className="space-y-1">
                <p>• Creating realistic AI preview images</p>
                <p className="text-xs text-gray-500">This may take a few moments...</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-blue-700 font-medium">
              This is completely FREE with unlimited attempts!
            </p>
          </div>
          
          {/* Animated progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" 
                 style={{ width: '70%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
