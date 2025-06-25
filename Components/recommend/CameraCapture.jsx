import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);

  const startCamera = useCallback(async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser.");
      }

      // Request camera permission
      const constraints = {
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      };

      console.log('🎥 DEBUG: Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ DEBUG: Camera access granted');
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('✅ DEBUG: Video metadata loaded');
          setIsReady(true);
          setIsLoading(false);
        };

        videoRef.current.oncanplay = () => {
          console.log('✅ DEBUG: Video can play');
          setIsReady(true);
          setIsLoading(false);
        };

        // Fallback timeout
        setTimeout(() => {
          if (!isReady) {
            console.log('⚠️ DEBUG: Video ready timeout, forcing ready state');
            setIsReady(true);
            setIsLoading(false);
          }
        }, 3000);
      }
    } catch (err) {
      console.error("❌ DEBUG: Camera error:", err);
      setIsLoading(false);
      setHasPermission(false);
      
      if (err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access in your browser settings and refresh the page.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found. Please ensure your device has a camera.");
      } else if (err.name === "NotSupportedError") {
        setError("Camera is not supported in this browser. Try using Chrome, Firefox, or Safari.");
      } else if (err.name === "NotReadableError") {
        setError("Camera is already in use by another application. Please close other apps using the camera and try again.");
      } else {
        setError(`Camera error: ${err.message}. Please check your browser settings and try again.`);
      }
    }
  }, [isReady]);

  const stopCamera = useCallback(() => {
    if (stream) {
      console.log('🛑 DEBUG: Stopping camera stream');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`🛑 DEBUG: Stopped track: ${track.kind}`);
      });
      setStream(null);
    }
    setIsReady(false);
    setIsLoading(false);
  }, [stream]);

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isReady) {
      console.error('❌ DEBUG: Cannot capture - video or canvas not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ensure video is playing
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('❌ DEBUG: Video not ready for capture');
      setError('Video not ready. Please wait a moment and try again.');
      return;
    }
    
    // Set canvas size to video dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    console.log(`📸 DEBUG: Capturing photo at ${canvas.width}x${canvas.height}`);
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `barber-ai-photo-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        console.log('✅ DEBUG: Photo captured successfully:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        // Stop camera before calling onCapture
        stopCamera();
        onCapture(file);
      } else {
        console.error('❌ DEBUG: Failed to create blob from canvas');
        setError('Failed to capture photo. Please try again.');
      }
    }, 'image/jpeg', 0.8);
  }, [onCapture, isReady, stopCamera]);

  const retryCamera = () => {
    setError('');
    setHasPermission(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Take Your Photo</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {error ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              
              <div className="text-center">
                <Button onClick={retryCamera} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
              
              {hasPermission === false && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <h4 className="font-medium text-blue-800 mb-2">How to enable camera:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Look for a camera icon in your browser's address bar</li>
                    <li>• Click "Allow" when prompted for camera access</li>
                    <li>• Refresh the page if needed</li>
                    <li>• Make sure no other apps are using your camera</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>
              
              {/* Overlay guide */}
              {isReady && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-60 border-2 border-white/50 rounded-full flex items-center justify-center">
                    <div className="text-white/70 text-center text-sm">
                      <div>Position your face</div>
                      <div>in the oval</div>
                    </div>
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
          
          {!error && (
            <div className="mt-4 text-xs text-gray-600 text-center">
              {isLoading ? "Setting up camera..." : "Make sure your face is well-lit and clearly visible"}
            </div>
          )}
        </div>
        
        <div className="flex gap-3 p-4 bg-gray-50 border-t">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={capturePhoto}
            disabled={!isReady || error || isLoading}
            className="flex-1 barber-gradient text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            {isLoading ? 'Loading...' : 'Capture'}
          </Button>
        </div>
      </div>
    </div>
  );
}
