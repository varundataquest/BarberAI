
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { HaircutRecommendation } from "@/entities/HaircutRecommendation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Scissors, Calendar, Star, Plus, Eye, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      
      // Always set to free for free and reset free attempts
      await User.updateMyUserData({ tier: 'free', free_attempts_used: 0 });
      setUser({ ...currentUser, tier: 'free', free_attempts_used: 0 });
      
      const userRecommendations = await HaircutRecommendation.filter(
        { user_id: currentUser.id },
        '-created_date'
      );
      setRecommendations(userRecommendations);
    } catch (error) {
      // Redirect to login using built-in login
      await User.login();
    }
    setLoading(false);
  };

  const getFaceShapeIcon = (shape) => {
    const icons = {
      oval: "⭕",
      round: "🔵", 
      square: "🟦",
      heart: "💖",
      diamond: "💎",
      oblong: "🟫"
    };
    return icons[shape] || "⭕";
  };
  
  const getAgeGroupIcon = (ageGroup) => {
    const icons = {
      adult: "🧑",
      child: "🧒",
      baby: "👶",
    };
    return icons[ageGroup] || "👤";
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
            alt="BarberAI Logo"
            className="w-16 h-16 object-contain"
          />
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                alt="BarberAI Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  My Dashboard
                </h1>
                <p className="text-gray-600">
                  Track your haircut recommendations - All Features FREE Forever!
                </p>
              </div>
            </div>
            <Link to={createPageUrl('Recommend')}>
              <Button className="barber-gradient text-white mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                New Free Recommendation
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Account Status - Always Free */}
          <Card className="luxury-shadow border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Status</p>
                  <div className="mt-2 barber-gradient text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>All Features FREE</span>
                  </div>
                </div>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                  alt="BarberAI"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Total Recommendations */}
          <Card className="luxury-shadow border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Recommendations</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{recommendations.length}</p>
                </div>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                  alt="BarberAI"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations History */}
        <Card className="luxury-shadow border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Recommendation History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div 
                    key={rec.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecommendation(selectedRecommendation === rec.id ? null : rec.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getFaceShapeIcon(rec.face_shape)}</span>
                        {rec.age_group && <span className="text-2xl">{getAgeGroupIcon(rec.age_group)}</span>}
                        <div>
                          <div className="flex items-center space-x-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-gray-900">
                              {rec.face_shape.charAt(0).toUpperCase() + rec.face_shape.slice(1)} Face Analysis
                            </h3>
                            <Badge variant="outline">
                              {rec.recommendations?.length || 0} styles
                            </Badge>
                            <Badge className="barber-gradient text-white">
                              Free
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(rec.created_date), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {selectedRecommendation === rec.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-4">
                          {rec.recommendations?.map((style, styleIndex) => (
                            <div key={styleIndex} className="bg-white rounded-lg p-4 border">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{style.style_name}</h4>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  {style.confidence_score}/10
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700 text-sm mb-2">{style.description}</p>
                              <div className="text-xs text-gray-600">
                                <strong>Styling Tips:</strong> {style.styling_tips}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                    alt="BarberAI"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No recommendations yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get your first AI-powered haircut recommendation, 100% free with unlimited AI previews!
                </p>
                <Link to={createPageUrl('Recommend')}>
                  <Button className="barber-gradient text-white">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png" 
                      alt="BarberAI"
                      className="w-4 h-4 mr-2 object-contain"
                    />
                    Get My First Free Recommendation
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
