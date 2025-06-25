import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Image as ImageIcon, Brain, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImageUploader({ onImageUpload, onTakePhoto, processing }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError('');
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image file is too large. Please use an image smaller than 10MB.');
        return;
      }
      
      console.log('📁 DEBUG: File dropped:', { name: file.name, size: file.size, type: file.type });
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileInput = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image file is too large. Please use an image smaller than 10MB.');
        return;
      }
      
      console.log('📁 DEBUG: File selected:', { name: file.name, size: file.size, type: file.type });
      onImageUpload(file);
    }
  };

  const handleTakePhoto = () => {
    setUploadError('');
    console.log('📸 DEBUG: Take photo button clicked');
    
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setUploadError('Camera is not supported in this browser. Please upload a photo instead.');
      return;
    }
    
    onTakePhoto();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Drag and Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 sm:p-8 transition-all duration-300 ${
          dragActive 
            ? "border-blue-400 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400"
        } ${processing ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {processing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10 rounded-xl">
            <Brain className="animate-pulse w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 animate-bounce">Analyzing Photo...</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Please wait while AI works its magic.</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={processing}
        />
        
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Drag & Drop or Choose File
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
            AI will analyze your face shape for personalized recommendations
          </p>
          
          <Button variant="outline" disabled={processing} size="sm" className="sm:size-default">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>

      {/* Camera Capture Option */}
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6">
          <Button 
            variant="default" 
            className="w-full sm:w-auto barber-gradient text-white"
            disabled={processing}
            size="sm"
            onClick={handleTakePhoto}
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        </div>
      </div>

      {/* AI Analysis Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">AI Analysis Includes:</h4>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
              <li>• Automatic face shape detection (oval, round, square, etc.)</li>
              <li>• Gender recognition for appropriate styling</li>
              <li>• Age group detection (adult, child, baby)</li>
              <li>• Ethnicity recognition for personalized styling</li>
              <li>• Facial feature analysis for optimal haircut matching</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Photo Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">📸 Photo Tips:</h4>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-1 text-sm">✅ Good Photos:</h5>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              <li>• Face the camera directly</li>
              <li>• Good lighting (natural or bright indoor)</li>
              <li>• Clear, sharp image quality</li>
              <li>• Hair pulled back to show face shape</li>
              <li>• Clean, simple background</li>
              <li>• Neutral facial expression</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-1 text-sm">❌ Avoid:</h5>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              <li>• Side profiles or extreme angles</li>
              <li>• Blurry or low-quality images</li>
              <li>• Poor lighting or shadows on face</li>
              <li>• Hair covering face/forehead</li>
              <li>• Busy or distracting backgrounds</li>
              <li>• Sunglasses or face coverings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
