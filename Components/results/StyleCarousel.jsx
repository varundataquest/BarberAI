import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Heart, Share2, Download, Copy, CheckCircle, Star } from 'lucide-react';

export default function StyleCarousel({ 
  recommendations, 
  previews, 
  type = 'hair',
  onSave,
  onShare 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedStyles, setSavedStyles] = useState(new Set());
  const [copiedIndex, setCopiedIndex] = useState(null);

  const nextStyle = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevStyle = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const handleSave = (style, index) => {
    setSavedStyles(prev => new Set([...prev, index]));
    onSave?.(style, type);
  };

  const handleShare = (style, preview) => {
    onShare?.(style, preview, type);
  };

  const copyInstructions = async (instructions, index) => {
    try {
      await navigator.clipboard.writeText(instructions);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text");
    }
  };

  const getPreviewForStyle = (styleName) => {
    return previews.find(preview => 
      preview.style_name === styleName && preview.success && preview.type === type
    );
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const currentStyle = recommendations[currentIndex];
  const currentPreview = getPreviewForStyle(currentStyle.style_name);
  const instructions = type === 'hair' ? currentStyle.instructions : currentStyle.barber_instructions;

  return (
    <Card className="luxury-shadow border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Navigation Header */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              {currentIndex + 1} of {recommendations.length}
            </Badge>
            <h3 className="font-semibold text-gray-900">{currentStyle.style_name}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={prevStyle} disabled={recommendations.length <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextStyle} disabled={recommendations.length <= 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* AI Preview Image */}
          {currentPreview && (
            <div className="relative">
              <img 
                src={currentPreview.image_url} 
                alt={`Preview of ${currentStyle.style_name}`}
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                AI Generated
              </div>
              {/* Watermark */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                BarberAI
              </div>
            </div>
          )}

          {/* Style Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {type === 'hair' && currentStyle.confidence_score && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  {Math.round(currentStyle.confidence_score * 100)}% Match
                </Badge>
              )}
              <Badge variant="outline">
                {currentStyle.maintenance_level} Maintenance
              </Badge>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900">
                  {type === 'hair' ? 'Tell Your Barber' : 'Facial Hair Instructions'}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyInstructions(instructions, currentIndex)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {copiedIndex === currentIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-blue-800 font-medium">
                "{instructions}"
              </p>
            </div>

            {/* Why It Works */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="font-medium text-gray-900 mb-1">Why This Works for You:</h5>
              <p className="text-gray-700 text-sm">{currentStyle.why_it_fits}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(currentStyle, currentIndex)}
              className={savedStyles.has(currentIndex) ? 'bg-red-50 text-red-700 border-red-200' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${savedStyles.has(currentIndex) ? 'fill-current' : ''}`} />
              {savedStyles.has(currentIndex) ? 'Saved' : 'Save Look'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare(currentStyle, currentPreview)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {currentPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentPreview.image_url;
                  link.download = `${currentStyle.style_name}-preview.jpg`;
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>

        {/* Style Dots Indicator */}
        {recommendations.length > 1 && (
          <div className="flex justify-center space-x-2 pb-4">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
