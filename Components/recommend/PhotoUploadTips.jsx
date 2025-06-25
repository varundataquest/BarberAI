import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Sun, User, X } from 'lucide-react';

export default function PhotoUploadTips() {
  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <Camera className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Quick Photo Tips:</strong> Face the camera directly, use good lighting, 
          and make sure your face is clearly visible for best results.
        </AlertDescription>
      </Alert>
      
      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-green-50 rounded-lg p-3">
          <h5 className="font-medium text-green-800 mb-2 flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs">✓</span>
            </div>
            Good Photos
          </h5>
          <ul className="text-green-700 space-y-1">
            <li>• Face the camera directly</li>
            <li>• Good natural or bright lighting</li>
            <li>• Clear, sharp image quality</li>
            <li>• Hair pulled back to show face shape</li>
            <li>• Clean, simple background</li>
            <li>• Neutral facial expression</li>
          </ul>
        </div>
        
        <div className="bg-red-50 rounded-lg p-3">
          <h5 className="font-medium text-red-800 mb-2 flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center mr-2">
              <X className="text-white text-xs" />
            </div>
            Avoid
          </h5>
          <ul className="text-red-700 space-y-1">
            <li>• Side profiles or extreme angles</li>
            <li>• Poor lighting or shadows</li>
            <li>• Blurry or low-quality images</li>
            <li>• Hair covering face/forehead</li>
            <li>• Sunglasses or face coverings</li>
            <li>• Busy backgrounds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
