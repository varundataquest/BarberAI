
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scissors, Star, RotateCcw, Brain, ImageIcon, Sparkles, Wand2, Clock, Droplets, Copy, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function RecommendationResults({ 
  recommendations, 
  facialHairRecommendations = [],
  generatedPreviews = [],
  faceShape, 
  ethnicity,
  gender,
  ageGroup,
  hairLength,
  hairType,
  hairThickness,
  onStartOver 
}) {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text");
    }
  };

  // Find preview image for a specific hairstyle
  const getPreviewForStyle = (styleName, type = 'hair') => {
    return generatedPreviews.find(preview => 
      preview.style_name === styleName && preview.success && preview.type === type
    );
  };

  // Filter for successful previews
  const successfulPreviews = generatedPreviews.filter(p => p.success);
  const successfulPreviewsCount = successfulPreviews.length;
  const hairPreviews = successfulPreviews.filter(p => p.type === 'hair');
  const facialHairPreviews = successfulPreviews.filter(p => p.type === 'facial_hair');

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <Card className="luxury-shadow border-0 bg-gradient-to-r from-gray-50 to-white">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="flex justify-center mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
              alt="BarberAI Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center">
            Your Barber Instructions
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Show these recommendations to your barber for the perfect cut
          </p>
          {successfulPreviewsCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-green-800 font-medium text-sm">
                ✨ {hairPreviews.length} haircut preview{hairPreviews.length > 1 ? 's' : ''} 
                {facialHairPreviews.length > 0 && ` + ${facialHairPreviews.length} facial hair preview${facialHairPreviews.length > 1 ? 's' : ''}`} 
                {' '}created with your face!
              </p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Analysis Results */}
      <Card className="luxury-shadow border-0 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Face Analysis Complete</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-white rounded-lg p-3 sm:p-4 border">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Face Shape</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900 capitalize">{faceShape}</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 border">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Current Hair Length</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">{hairLength}</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 border">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Hair Type</p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">{hairType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-gray-900">Your Style Recommendations</h3>
        
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            const previewImage = getPreviewForStyle(rec.style_name, 'hair');

            return (
              <Card key={index} className="luxury-shadow border-0 overflow-hidden">
                <CardHeader className="bg-gray-50 border-b px-4 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                        <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span>{rec.style_name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {Math.round(rec.confidence_score * 100)}% Match
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {rec.maintenance_level} Maintenance
                        </Badge>
                        {previewImage && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            AI Preview Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* AI Generated Preview Image */}
                  {previewImage && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Preview: How You'll Look
                      </h4>
                      <div className="relative">
                        <img 
                          src={previewImage.image_url} 
                          alt={`Preview of ${rec.style_name}`}
                          className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          AI Generated
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Barber/Stylist Instructions - Highlighted */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900 flex items-center">
                        <Scissors className="w-4 h-4 mr-2" />
                        Tell Your Barber/Stylist
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(rec.instructions, `barber-${index}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {copiedIndex === `barber-${index}` ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-blue-800 font-medium text-sm sm:text-base">
                      "{rec.instructions}"
                    </p>
                  </div>

                  {/* Technique Details */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Technique Details:</h4>
                    <p className="text-gray-700 text-sm">{rec.technique_details}</p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="font-semibold text-gray-900 text-sm sm:text-base">
                        Why This Works for You
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {rec.why_it_fits}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="font-semibold text-gray-900 text-sm sm:text-base">
                        <Droplets className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-500" />
                        Styling Tips
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {rec.styling_tips}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="font-semibold text-gray-900 text-sm sm:text-base">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                        Maintenance Schedule
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {rec.maintenance_schedule}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="luxury-shadow border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Recommendations Generated
              </h3>
              <p className="text-gray-600 mb-6">
                The AI was unable to generate specific recommendations for this photo. Please try again with a different, clearer image.
              </p>
              <Button onClick={onStartOver}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Another Photo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modern Facial Hair Recommendations with AI Previews */}
      {facialHairRecommendations && facialHairRecommendations.length > 0 && (
        <div className="space-y-4 pt-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Modern Facial Hair Styles</h3>
            <p className="text-gray-600">Trending facial hair recommendations for your barber</p>
          </div>
          {facialHairRecommendations.map((rec, index) => {
            const previewImage = getPreviewForStyle(rec.style_name, 'facial_hair');
            
            return (
              <Card key={index} className="luxury-shadow border-0 overflow-hidden">
                <CardHeader className="bg-gray-50 border-b px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <span>{rec.style_name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending 2024
                      </Badge>
                      {previewImage && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          AI Preview
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* AI Generated Preview Image for Facial Hair */}
                  {previewImage && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Preview: How You'll Look
                      </h4>
                      <div className="relative">
                        <img 
                          src={previewImage.image_url} 
                          alt={`Preview of ${rec.style_name}`}
                          className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          AI Generated
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-900">Barber Instructions</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(rec.barber_instructions, `facial-${index}`)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        {copiedIndex === `facial-${index}` ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-purple-800 font-medium text-sm sm:text-base">
                      "{rec.barber_instructions}"
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="font-semibold text-gray-900 text-sm sm:text-base">
                        Why This Style Works
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {rec.why_it_fits}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="font-semibold text-gray-900 text-sm sm:text-base">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-500" />
                        Why It's Trending Now
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {rec.trending_appeal}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="font-semibold text-gray-900 text-sm sm:text-base">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                        Maintenance Level
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {rec.maintenance_level} maintenance required
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={onStartOver}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Another Photo
        </Button>
        
        <Link to={createPageUrl('Dashboard')}>
          <Button className="barber-gradient text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
              alt="BarberAI"
              className="w-4 h-4 mr-2 object-contain"
            />
            Save to History
          </Button>
        </Link>
      </div>
    </div>
  );
}
