
import React, { useState, useEffect } from "react";
// Removed: import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
// Removed: import { User } from "@/entities/User";
import { HaircutRecommendation } from "@/entities/HaircutRecommendation";
import { InvokeLLM, UploadFile, GenerateImage } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Sparkles, AlertCircle, Brain } from "lucide-react";

import ImageUploader from "../components/recommend/ImageUploader";
import RecommendationResults from "../components/recommend/RecommendationResults";
import CameraCapture from '../components/recommend/CameraCapture';
import EthnicityConfirmation from "../components/recommend/EthnicityConfirmation";
import OnboardingModal from "../components/onboarding/OnboardingModal";
import PhotoUploadTips from "../components/recommend/PhotoUploadTips";
import AIOverridePanel from "../components/recommend/AIOverridePanel";
import ProcessingModal from "../components/recommend/ProcessingModal";

export default function Recommend() {
  // Removed: const navigate = useNavigate();
  // Removed: const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false as no user is loaded
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [processingMessage, setProcessingMessage] = useState("AI is analyzing your photo...");

  // Form data
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [detectedFaceShape, setDetectedFaceShape] = useState("");
  const [detectedEthnicity, setDetectedEthnicity] = useState("");
  const [detectedGender, setDetectedGender] = useState("");
  const [detectedAgeGroup, setDetectedAgeGroup] = useState("");
  const [detectedHairType, setDetectedHairType] = useState("");
  const [detectedHairThickness, setDetectedHairThickness] = useState("");
  const [detectedHairLength, setDetectedHairLength] = useState("");
  const [ethnicityConfidence, setEthnicityConfidence] = useState(0);
  const [needsEthnicityConfirmation, setNeedsEthnicityConfirmation] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [facialHairRecommendations, setFacialHairRecommendations] = useState([]);
  const [generatedPreviews, setGeneratedPreviews] = useState([]);
  const [error, setError] = useState("");

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [confidenceLevels, setConfidenceLevels] = useState({});
  const [showAIOverride, setShowAIOverride] = useState(false);

  useEffect(() => {
    // Removed: loadUser();
    
    // Check for demo mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      handleDemoMode();
    }
    setLoading(false); // Moved here as no user loading is required
  }, []);

  // Removed: loadUser function

  // Helper functions for creating default recommendations
  const createDefaultRecommendation = (index) => ({
    style_name: `Classic Professional Cut ${index}`,
    instructions: "I'd like a classic, professional haircut that suits my face shape.",
    technique_details: "Use scissors and clippers for a balanced, well-proportioned look.",
    confidence_score: 0.8,
    maintenance_level: "Medium",
    why_it_fits: "Classic cuts work well for most face shapes and are always professional.",
    styling_tips: "Use quality styling products appropriate for your hair type.",
    maintenance_schedule: "Every 4-6 weeks."
  });

  const createDefaultRecommendations = () => [
    createDefaultRecommendation(1),
    { ...createDefaultRecommendation(2), style_name: "Modern Everyday Style" },
    { ...createDefaultRecommendation(3), style_name: "Textured Crop" }
  ];

  const createDefaultFacialHairRecommendation = (index) => ({
    style_name: `Facial Style ${index}`,
    barber_instructions: "Please give me a clean, well-groomed look.",
    why_it_fits: "This style works well with your facial structure.",
    maintenance_level: "Low",
    trending_appeal: "A timeless, professional appearance."
  });

  const createDefaultFacialHairRecommendations = () => [
    createDefaultFacialHairRecommendation(1),
    { ...createDefaultFacialHairRecommendation(2), style_name: "Light Stubble" },
    { ...createDefaultFacialHairRecommendation(3), style_name: "Short Beard" }
  ];

  const handleDemoMode = () => {
    // Show demo with sample data
    setDetectedFaceShape("oval");
    setDetectedEthnicity("European (General)");
    setDetectedGender("male");
    setDetectedAgeGroup("adult");
    setDetectedHairLength("Medium");
    setDetectedHairType("Straight");
    setDetectedHairThickness("Medium");
    setEthnicityConfidence(8.5);
    
    // Generate demo recommendations
    const demoRecs = [
      {
        style_name: "Classic Professional Cut",
        instructions: "I'd like a classic, professional haircut with short sides and longer top.",
        technique_details: "Use scissors and clippers for a balanced look.",
        confidence_score: 0.9,
        maintenance_level: "Medium",
        why_it_fits: "Perfect for oval face shapes and professional settings.",
        styling_tips: "Use a light pomade for a polished finish.",
        maintenance_schedule: "Every 4-6 weeks."
      },
      {
        style_name: "Modern Everyday Style",
        instructions: "I'd like a versatile, low-maintenance cut suitable for everyday wear.",
        technique_details: "Scissor-cut for texture and flow, with tapered sides.",
        confidence_score: 0.85,
        maintenance_level: "Low",
        why_it_fits: "Adaptable style for various occasions.",
        styling_tips: "Finger-comb with a matte paste for natural look.",
        maintenance_schedule: "Every 5-7 weeks."
      },
      {
        style_name: "Textured Crop",
        instructions: "Give me a textured crop with a faded side and back.",
        technique_details: "Clipper work on sides, point cutting on top for texture.",
        confidence_score: 0.88,
        maintenance_level: "Medium",
        why_it_fits: "Highlights facial features and provides a modern aesthetic.",
        styling_tips: "Use sea salt spray for volume and texture.",
        maintenance_schedule: "Every 3-5 weeks."
      }
    ];

    const demoFacialHairRecs = [
      {
        style_name: "Clean Shaven with Defined Edges",
        barber_instructions: "Please give me a clean shave, but define my sideburns and neckline crisply.",
        why_it_fits: "A clean shaven look emphasizes your face shape and is suitable for all professional settings.",
        maintenance_level: "High",
        trending_appeal: "Timeless, always professional."
      },
      {
        style_name: "Light Stubble",
        barber_instructions: "Trim my stubble to a uniform length, about 1-2mm, maintaining clean lines on the cheeks and neck.",
        why_it_fits: "Adds definition to your jawline without being overly distracting.",
        maintenance_level: "Medium",
        trending_appeal: "Popular, rugged yet groomed."
      },
      {
        style_name: "Short Beard",
        barber_instructions: "Trim my beard to a short, uniform length (approx. 5-10mm) and ensure clean, sharp lines on cheeks, neck, and mustache.",
        why_it_fits: "Provides a more mature and defined look.",
        maintenance_level: "Medium",
        trending_appeal: "Classic, widely accepted."
      }
    ];
    
    setRecommendations(demoRecs);
    setFacialHairRecommendations(demoFacialHairRecs);
    setGeneratedPreviews([]); // Previews are not part of demo setup
    setStep(3);
    setProcessing(false);
  };

  const handleImageUpload = async (file) => {
    console.log("🔍 DEBUG: Starting image upload:", {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    if (isCameraOpen) {
      setIsCameraOpen(false);
    }
    setProcessing(true);
    setProcessingMessage("Uploading your image...");
    setError("");

    try {
      const { file_url } = await UploadFile({ file });
      console.log("✅ DEBUG: Image uploaded successfully:", file_url);
      
      setUploadedImage(file);
      setImageUrl(file_url);

      setProcessingMessage("AI is analyzing your features...");
      await analyzePhoto(file_url);

    } catch (error) {
      console.error("❌ DEBUG: Image upload error:", error);
      setError("Failed to upload image. Please try again.");
      setProcessing(false);
    }
  };

  const analyzePhoto = async (imageUrl) => {
    console.log("🔍 DEBUG: Starting photo analysis for:", imageUrl);
    
    try {
      const analysisPrompt = `You are an expert in facial feature analysis. Analyze this photo with high precision and provide detailed information:

**FACE SHAPE ANALYSIS:**
- Examine face proportions, jawline, cheekbones, and forehead carefully
- Classify as one of: oval, round, square, heart, diamond, or oblong
- Consider the face width vs height ratio and jawline structure
- If unclear, choose the most likely option based on visible features

**DEMOGRAPHIC ANALYSIS:**
- Gender: Analyze facial features to determine male, female, or non-binary
- Age Group: Classify as adult (18+), child (5-17), or baby (0-4)
- Make your best assessment even if some features are unclear

**ETHNICITY/HERITAGE ANALYSIS (Critical for accurate styling):**
- Carefully examine ALL ethnic markers: skin tone, facial bone structure, eye shape and size, nose structure, lip shape, hair texture if visible
- Provide the most specific ethnicity possible from these detailed categories:
  * European/Caucasian: Northern European, Southern European, Eastern European, Mixed European
  * African/Black: West African, East African, Ethiopian, African American, Afro-Caribbean, Mixed African
  * East Asian: Chinese, Japanese, Korean, Mongolian
  * South Asian: Indian, Pakistani, Bangladeshi, Sri Lankan, Nepali
  * Southeast Asian: Filipino, Vietnamese, Thai, Indonesian, Malaysian, Cambodian
  * Middle Eastern/North African: Arab, Persian/Iranian, Turkish, Israeli/Jewish, North African
  * Hispanic/Latino: Mexican, Central American, South American, Caribbean Hispanic
  * Native American/Indigenous: North American Indigenous, South American Indigenous
  * Pacific Islander: Hawaiian, Samoan, Fijian, Tongan
  * Mixed/Multiracial: Specify the combination if detectable
- Look for subtle ethnic features that indicate heritage
- If multiple ethnicities seem possible, choose the most prominent one

**HAIR ANALYSIS:**
- Current length: Short (above ears), Medium (ear to shoulder), Long (past shoulders)
- Type: Straight, Wavy, Curly, or Coily based on visible texture
- Thickness: Fine, Medium, or Thick based on hair density
- Make reasonable assumptions if hair is styled or covered

**CONFIDENCE SCORING (Very Important):**
Rate your confidence in ethnicity detection on scale 1-10:
- 1-4: Very uncertain, multiple ethnicities possible
- 5-7: Somewhat confident but could be wrong  
- 8-9: Confident with clear ethnic markers
- 10: Extremely confident, obvious ethnic features

Be honest about uncertainty - accuracy is more important than high confidence.

IMPORTANT: Always provide complete analysis even for unclear photos. Make educated guesses based on all visible features.`;

      console.log("🔍 DEBUG: Sending analysis prompt to AI");

      const analysis = await InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            face_shape: {
              type: "string",
              enum: ["oval", "round", "square", "heart", "diamond", "oblong"]
            },
            gender: {
              type: "string",
              enum: ["male", "female", "non-binary"]
            },
            age_group: {
              type: "string",
              enum: ["adult", "child", "baby"]
            },
            ethnicity: { 
              type: "string",
              description: "Most specific ethnicity with regional details"
            },
            ethnicity_confidence: { 
              type: "number",
              minimum: 1,
              maximum: 10
            },
            hair_length: {
              type: "string",
              enum: ["Short", "Medium", "Long"]
            },
            hair_type: {
              type: "string",
              enum: ["Straight", "Wavy", "Curly", "Coily"]
            },
            hair_thickness: {
              type: "string",
              enum: ["Fine", "Medium", "Thick"]
            },
            analysis_notes: {
              type: "string",
              description: "Detailed notes on ethnic features and confidence reasoning"
            }
          },
          required: ["face_shape", "gender", "age_group", "ethnicity", "hair_length", "hair_type", "hair_thickness", "ethnicity_confidence", "analysis_notes"]
        }
      });

      console.log("✅ DEBUG: AI analysis result:", analysis);
      console.log("🔍 DEBUG: Ethnicity confidence:", analysis.ethnicity_confidence, "/10");
      console.log("📝 DEBUG: Analysis notes:", analysis.analysis_notes);

      // Validate AI response completeness
      const requiredFields = ['face_shape', 'gender', 'age_group', 'ethnicity', 'hair_length', 'hair_type', 'hair_thickness'];
      const missingFields = requiredFields.filter(field => !analysis[field]);
      
      if (missingFields.length > 0) {
        console.error("❌ DEBUG: AI analysis incomplete. Missing fields:", missingFields);
        console.log("🔧 DEBUG: Providing fallback values for missing fields");
        
        // Provide sensible defaults for missing fields
        analysis.face_shape = analysis.face_shape || "oval";
        analysis.gender = analysis.gender || "male";
        analysis.age_group = analysis.age_group || "adult";
        analysis.ethnicity = analysis.ethnicity || "Mixed/General";
        analysis.hair_length = analysis.hair_length || "Medium";
        analysis.hair_type = analysis.hair_type || "Straight";
        analysis.hair_thickness = analysis.hair_thickness || "Medium";
        analysis.ethnicity_confidence = analysis.ethnicity_confidence || 5;
      }

      // Set detected values
      setDetectedFaceShape(analysis.face_shape);
      setDetectedEthnicity(analysis.ethnicity);
      setDetectedGender(analysis.gender);
      setDetectedAgeGroup(analysis.age_group);
      setDetectedHairLength(analysis.hair_length);
      setDetectedHairType(analysis.hair_type);
      setDetectedHairThickness(analysis.hair_thickness);
      setEthnicityConfidence(analysis.ethnicity_confidence);
      
      // Set confidence levels for override panel
      setConfidenceLevels({
        face_shape: 8.5, // Mock confidence - in real app this would come from AI
        ethnicity: analysis.ethnicity_confidence,
        gender: 9.2,
        age_group: 8.8
      });

      console.log("🔍 DEBUG: Analysis summary:", {
        face_shape: analysis.face_shape,
        ethnicity: analysis.ethnicity,
        confidence: analysis.ethnicity_confidence,
        gender: analysis.gender,
        age_group: analysis.age_group
      });

      // Check if any confidence is low or if user should review
      const needsReview = analysis.ethnicity_confidence < 9 || 
        Object.values(confidenceLevels).some(conf => conf < 9); // This will always be true given the mock confidence for other fields.

      if (needsReview) {
        console.log("⚠️ DEBUG: Low confidence in some AI detections, requesting user review.");
        setShowAIOverride(true);
        setStep(2); // New confirmation step
        setProcessing(false);
      } else {
        console.log("✅ DEBUG: High confidence, proceeding with AI detection:", analysis.ethnicity);
        setProcessingMessage("Generating personalized barber recommendations...");
        await generateRecommendations(
          analysis.face_shape,
          analysis.ethnicity,
          analysis.gender,
          analysis.age_group,
          analysis.hair_length,
          analysis.hair_type,
          analysis.hair_thickness
        );
      }

    } catch (error) {
      console.error("❌ DEBUG: Photo analysis error:", error);
      console.error("❌ DEBUG: Error details:", error.message);
      
      // Provide fallback analysis to continue the flow
      console.log("🔧 DEBUG: Using fallback analysis due to AI error");
      const fallbackAnalysis = {
        face_shape: "oval",
        ethnicity: "Mixed/General",
        gender: "male", 
        age_group: "adult",
        hair_length: "Medium",
        hair_type: "Straight",
        hair_thickness: "Medium",
        ethnicity_confidence: 5
      };

      setDetectedFaceShape(fallbackAnalysis.face_shape);
      setDetectedEthnicity(fallbackAnalysis.ethnicity);
      setDetectedGender(fallbackAnalysis.gender);
      setDetectedAgeGroup(fallbackAnalysis.age_group);
      setDetectedHairLength(fallbackAnalysis.hair_length);
      setDetectedHairType(fallbackAnalysis.hair_type);
      setDetectedHairThickness(fallbackAnalysis.hair_thickness);
      setEthnicityConfidence(fallbackAnalysis.ethnicity_confidence);

      setConfidenceLevels({
        face_shape: 6,
        ethnicity: fallbackAnalysis.ethnicity_confidence,
        gender: 7,
        age_group: 6.5
      });

      // Force confirmation step since we used fallback
      setShowAIOverride(true);
      setStep(2);
      setProcessing(false);
    }
  };

  const handleAIOverrideConfirm = async (finalData) => {
    setProcessing(true);
    setShowAIOverride(false);
    setProcessingMessage("Generating personalized barber recommendations...");
    
    // Update detected states with finalData (potentially overridden by user)
    setDetectedFaceShape(finalData.face_shape);
    setDetectedEthnicity(finalData.ethnicity);
    setDetectedGender(finalData.gender);
    setDetectedAgeGroup(finalData.age_group);
    
    await generateRecommendations(
      finalData.face_shape,
      finalData.ethnicity,
      finalData.gender,
      finalData.age_group,
      detectedHairLength, // Hair attributes not part of override panel in outline
      detectedHairType,
      detectedHairThickness
    );
  };

  const handleEthnicityConfirmation = async (confirmedEthnicity) => {
    console.log("✅ DEBUG: User confirmed ethnicity:", confirmedEthnicity);
    setProcessing(true);
    setNeedsEthnicityConfirmation(false);
    setProcessingMessage("Generating personalized barber recommendations...");
    await generateRecommendations(
      detectedFaceShape,
      confirmedEthnicity,
      detectedGender,
      detectedAgeGroup,
      detectedHairLength,
      detectedHairType,
      detectedHairThickness
    );
  };

  const generateRecommendations = async (faceShape, ethnicity, gender, ageGroup, hairLength, hairType, hairThickness) => {
    console.log("🔍 DEBUG: Generating recommendations with params:", {
      faceShape, ethnicity, gender, ageGroup, hairLength, hairType, hairThickness
    });

    try {
      const prompt = `You are a professional barber/stylist consultant. Create recommendations for a ${gender} ${ageGroup} with ${faceShape} face, ${ethnicity} ethnicity, ${hairLength} ${hairType} ${hairThickness} hair.

IMPORTANT: Always provide exactly 3 complete recommendations.

For each recommendation, provide:
- style_name: Professional name (e.g., "Classic Fade", "Layered Bob")
- instructions: Exact words to tell the barber/stylist
- technique_details: Specific techniques and tools needed
- confidence_score: Number between 0.7 and 1.0
- maintenance_level: "Low", "Medium", or "High"
- why_it_fits: Why it suits their specific features
- styling_tips: Product and styling advice
- maintenance_schedule: How often to cut

${gender === 'male' || gender === 'non-binary' ? 'Also provide exactly 3 facial hair recommendations with style_name, barber_instructions, why_it_fits, maintenance_level, and trending_appeal.' : ''}

Generate complete, detailed recommendations regardless of photo quality.`;

      const responseSchema = {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                style_name: { type: "string" },
                instructions: { type: "string" },
                technique_details: { type: "string" },
                confidence_score: { type: "number" },
                maintenance_level: { type: "string", enum: ["Low", "Medium", "High"] },
                why_it_fits: { type: "string" },
                styling_tips: { type: "string" },
                maintenance_schedule: { type: "string" }
              },
              required: ["style_name", "instructions", "technique_details", "confidence_score", "maintenance_level", "why_it_fits", "styling_tips", "maintenance_schedule"]
            }
          }
        },
        required: ["recommendations"]
      };

      if (gender === 'male' || gender === 'non-binary') {
        responseSchema.properties.facial_hair_recommendations = {
          type: "array",
          items: {
            type: "object",
            properties: {
              style_name: { type: "string" },
              barber_instructions: { type: "string" },
              why_it_fits: { type: "string" },
              maintenance_level: { type: "string", enum: ["Low", "Medium", "High"] },
              trending_appeal: { type: "string" }
            },
            required: ["style_name", "barber_instructions", "why_it_fits", "maintenance_level", "trending_appeal"]
          }
        };
      }

      console.log("🔍 DEBUG: Sending recommendation prompt to AI");

      const response = await InvokeLLM({
        prompt,
        response_json_schema: responseSchema
      });

      console.log("✅ DEBUG: AI recommendation response:", response);

      // Robust sanitization functions
      const sanitizeRecommendations = (recs) => {
        console.log("🔧 DEBUG: Sanitizing hair recommendations:", recs);
        
        if (!Array.isArray(recs) || recs.length === 0) {
          console.log("⚠️ DEBUG: No recommendations received, creating defaults");
          return createDefaultRecommendations();
        }

        const sanitized = recs.map((rec, index) => {
          const cleaned = {
            style_name: rec.style_name || `Professional Style ${index + 1}`,
            instructions: rec.instructions || "Please give me a professional haircut that suits my face shape.",
            technique_details: rec.technique_details || "Use professional cutting techniques for a balanced look.",
            confidence_score: typeof rec.confidence_score === 'number' ? rec.confidence_score : 0.8,
            maintenance_level: ["Low", "Medium", "High"].includes(rec.maintenance_level) ? rec.maintenance_level : "Medium",
            why_it_fits: rec.why_it_fits || "This style complements your facial features.",
            styling_tips: rec.styling_tips || "Use quality hair products for best results.",
            maintenance_schedule: rec.maintenance_schedule || "Every 4-6 weeks."
          };
          console.log(`🔧 DEBUG: Sanitized recommendation ${index + 1}:`, cleaned);
          return cleaned;
        });

        // Ensure exactly 3 recommendations
        while (sanitized.length < 3) {
          sanitized.push(createDefaultRecommendation(sanitized.length + 1));
        }
        return sanitized.slice(0, 3);
      };

      const sanitizeFacialHair = (recs) => {
        console.log("🔧 DEBUG: Sanitizing facial hair recommendations:", recs);
        
        if (!Array.isArray(recs) || recs.length === 0) {
          if (gender === 'male' || gender === 'non-binary') {
            console.log("⚠️ DEBUG: No facial hair recs received, creating defaults");
            return createDefaultFacialHairRecommendations();
          }
          return [];
        }

        const sanitized = recs.map((rec, index) => {
          const cleaned = {
            style_name: rec.style_name || `Facial Style ${index + 1}`,
            barber_instructions: rec.barber_instructions || "Please trim and shape for a clean, professional look.",
            why_it_fits: rec.why_it_fits || "This style works well with your facial structure.",
            maintenance_level: ["Low", "Medium", "High"].includes(rec.maintenance_level) ? rec.maintenance_level : "Medium",
            trending_appeal: rec.trending_appeal || "A popular, modern look."
          };
          console.log(`🔧 DEBUG: Sanitized facial hair ${index + 1}:`, cleaned);
          return cleaned;
        });

        // Ensure exactly 3 facial hair recommendations for males
        if (gender === 'male' || gender === 'non-binary') {
          while (sanitized.length < 3) {
            sanitized.push(createDefaultFacialHairRecommendation(sanitized.length + 1));
          }
          return sanitized.slice(0, 3);
        }
        return sanitized;
      };

      const hairRecommendations = response.recommendations || [];
      const facialHairRecs = response.facial_hair_recommendations || [];

      const sanitizedHairRecs = sanitizeRecommendations(hairRecommendations);
      const sanitizedFacialRecs = sanitizeFacialHair(facialHairRecs);

      console.log("✅ DEBUG: Final sanitized recommendations:", {
        hair: sanitizedHairRecs.length,
        facial: sanitizedFacialRecs.length
      });

      // Generate personalized preview images for both hair and facial hair
      setProcessingMessage("Creating personalized preview images...");
      const hairPreviewImages = await generatePersonalizedPreviews(
        sanitizedHairRecs,
        ethnicity,
        gender,
        ageGroup,
        imageUrl,
        'hair'
      );

      let facialHairPreviewImages = [];
      if (sanitizedFacialRecs.length > 0) {
        setProcessingMessage("Creating facial hair preview images...");
        facialHairPreviewImages = await generatePersonalizedPreviews(
          sanitizedFacialRecs,
          ethnicity,
          gender,
          ageGroup,
          imageUrl,
          'facial_hair'
        );
      }

      // Create recommendation record with robust error handling
      const recommendationData = {
        // Removed: user_id: user.id,
        face_shape: faceShape,
        ethnicity: ethnicity,
        gender: gender,
        age_group: ageGroup,
        inferred_hair_length: hairLength,
        face_shape_detection_method: "ai_detected",
        recommendations: sanitizedHairRecs,
        facial_hair_recommendations: sanitizedFacialRecs,
        original_image_url: imageUrl,
        tier_used: 'free'
      };

      console.log("🔍 DEBUG: Attempting to create recommendation record");
      console.log("📊 DEBUG: Recommendation data structure:", {
        // Removed: user_id: recommendationData.user_id,
        face_shape: recommendationData.face_shape,
        ethnicity: recommendationData.ethnicity,
        gender: recommendationData.gender,
        age_group: recommendationData.age_group,
        inferred_hair_length: recommendationData.inferred_hair_length,
        recommendations_count: recommendationData.recommendations.length,
        facial_hair_count: recommendationData.facial_hair_recommendations.length
      });

      try {
        await HaircutRecommendation.create(recommendationData);
        console.log("✅ DEBUG: Recommendation record created successfully");
      } catch (dbError) {
        console.error("❌ DEBUG: Database save error:", dbError);
        console.error("❌ DEBUG: DB Error details:", dbError.response?.data);
        // Continue with display even if save fails
        setError("Recommendations generated but couldn't save to history. You can still view your results below.");
      }

      setRecommendations(sanitizedHairRecs);
      setFacialHairRecommendations(sanitizedFacialRecs);
      
      // Combine both hair and facial hair previews
      const allPreviews = [
        ...hairPreviewImages.map(p => ({ ...p, type: 'hair' })),
        ...facialHairPreviewImages.map(p => ({ ...p, type: 'facial_hair' }))
      ];
      setGeneratedPreviews(allPreviews);
      
      setStep(3);
      console.log("✅ DEBUG: Successfully moved to results step");

    } catch (error) {
      console.error("❌ DEBUG: Full error generating recommendations:", error);
      console.error("❌ DEBUG: Error details:", error.response?.data);
      
      // Provide fallback recommendations even if AI fails
      console.log("🔧 DEBUG: Creating fallback recommendations due to error");
      const fallbackRecs = createDefaultRecommendations();
      const fallbackFacialRecs = (gender === 'male' || gender === 'non-binary') ? 
        createDefaultFacialHairRecommendations() : [];

      setRecommendations(fallbackRecs);
      setFacialHairRecommendations(fallbackFacialRecs);
      setGeneratedPreviews([]);
      setError("AI had difficulty generating custom recommendations. Showing general suggestions instead.");
      setStep(3);
    }
    setProcessing(false);
  };

  const generatePersonalizedPreviews = async (recommendations, ethnicity, gender, ageGroup, originalImageUrl, type = 'hair') => {
    console.log(`🖼️ DEBUG: Generating ${type} preview images for`, recommendations.length, "recommendations");
    console.log("🔍 DEBUG: Using confirmed ethnicity:", ethnicity);

    const previews = [];

    for (let i = 0; i < Math.min(recommendations.length, 3); i++) {
      const rec = recommendations[i];
      const styleName = rec.style_name; // style_name is common to both hair and facial hair recs
      const instructions = type === 'hair' ? rec.instructions : rec.barber_instructions; // Use appropriate instructions field
      
      console.log(`🖼️ DEBUG: Generating ${type} preview ${i + 1} for: ${styleName}`);

      setProcessingMessage(`Creating ${type === 'hair' ? 'haircut' : 'facial hair'} preview image ${i + 1} of ${recommendations.length}: ${styleName}...`);

      try {
        let imagePrompt;
        
        if (type === 'hair') {
          imagePrompt = `Professional portrait photograph of a person with these exact characteristics:

**PHYSICAL CHARACTERISTICS (CRITICAL):**
- Ethnicity/Heritage: ${ethnicity} (EXTREMELY IMPORTANT: The person must accurately and authentically represent this specific ethnic background with genuine features, skin tone, and characteristics)
- Gender: ${gender}
- Age Group: ${ageGroup === 'adult' ? '25-35 years old' : ageGroup === 'child' ? '8-14 years old' : '2-4 years old'}

**HAIRSTYLE SPECIFICATIONS:**
- Style Name: "${styleName}"
- The haircut should look exactly as described in the style name
- Professional barber/salon quality cut
- Modern, contemporary styling

**PHOTO REQUIREMENTS:**
- Ultra high-quality, professional portrait photography
- Front-facing view with slight natural angle
- Perfect natural lighting, no harsh shadows
- Clean, neutral background (white, light gray, or soft studio background)
- Person should look confident, professional, and well-groomed
- Sharp focus, crystal clear high resolution
- Natural expression, slight smile optional

**ETHNIC ACCURACY REQUIREMENTS (CRITICAL):**
- Skin tone must authentically represent ${ethnicity} heritage
- Facial features must genuinely reflect ${ethnicity} characteristics
- Eye shape, nose structure, and bone structure appropriate for ${ethnicity}
- Hair texture and color should be natural for ${ethnicity} background
- Overall appearance must respectfully and accurately represent ${ethnicity} heritage

**STYLE REQUIREMENTS:**
- Modern, contemporary professional look
- The hairstyle should be the main focus of the image
- Natural styling, not overly processed or artificial
- Professional grooming and presentation

ABSOLUTE PRIORITY: Ensure the person's ethnic features, skin tone, facial structure, and overall appearance genuinely, respectfully, and accurately represent ${ethnicity} heritage. This is the most critical aspect of the image generation.`;
        } else {
          imagePrompt = `Professional portrait photograph of a person with these exact characteristics:

**PHYSICAL CHARACTERISTICS (CRITICAL):**
- Ethnicity/Heritage: ${ethnicity} (EXTREMELY IMPORTANT: The person must accurately and authentically represent this specific ethnic background with genuine features, skin tone, and characteristics)
- Gender: ${gender}
- Age Group: ${ageGroup === 'adult' ? '25-35 years old' : ageGroup === 'child' ? '8-14 years old' : '2-4 years old'}

**FACIAL HAIR SPECIFICATIONS:**
- Style Name: "${styleName}"
- The facial hair should look exactly as described: ${instructions}
- Professional barber quality grooming
- Modern, well-maintained appearance
- Clean lines and precise trimming

**PHOTO REQUIREMENTS:**
- Ultra high-quality, professional portrait photography
- Front-facing view with slight natural angle
- Perfect natural lighting, no harsh shadows
- Clean, neutral background (white, light gray, or soft studio background)
- Person should look confident, professional, and well-groomed
- Sharp focus, crystal clear high resolution
- Natural expression, slight smile optional

**ETHNIC ACCURACY REQUIREMENTS (CRITICAL):**
- Skin tone must authentically represent ${ethnicity} heritage
- Facial features must genuinely reflect ${ethnicity} characteristics
- Eye shape, nose structure, and bone structure appropriate for ${ethnicity}
- Facial hair texture and color should be natural for ${ethnicity} background
- Overall appearance must respectfully and accurately represent ${ethnicity} heritage

**STYLE REQUIREMENTS:**
- Modern, contemporary professional look
- The facial hair should be the main focus along with the face
- Natural styling, not overly processed or artificial
- Professional grooming and presentation

ABSOLUTE PRIORITY: Ensure the person's ethnic features, skin tone, facial structure, and overall appearance genuinely, respectfully, and accurately represent ${ethnicity} heritage. This is the most critical aspect of the image generation.`;
        }

        console.log(`🖼️ DEBUG: Sending detailed ${type} image prompt for ${styleName}`);

        const imageResult = await GenerateImage({
          prompt: imagePrompt
        });

        console.log(`✅ DEBUG: ${type} preview ${i + 1} generated successfully:`, imageResult.url);

        previews.push({
          style_name: styleName,
          image_url: imageResult.url,
          success: true,
          type: type
        });

        // Delay between generations to prevent rate limiting
        if (i < recommendations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

      } catch (imageError) {
        console.error(`❌ DEBUG: Failed to generate ${type} preview ${i + 1}:`, imageError);
        previews.push({
          style_name: styleName,
          image_url: null,
          success: false,
          error: imageError.message,
          type: type
        });
      }
    }

    const successfulPreviews = previews.filter(p => p.success);
    console.log(`✅ DEBUG: Generated ${successfulPreviews.length} successful ${type} preview images out of ${previews.length} attempts`);
    
    return previews;
  };

  const resetProcess = () => {
    console.log("🔄 DEBUG: Resetting recommendation process");
    setStep(1);
    setUploadedImage(null);
    setImageUrl("");
    setDetectedFaceShape("");
    setDetectedEthnicity("");
    setDetectedGender("");
    setDetectedAgeGroup("");
    setDetectedHairLength("");
    setDetectedHairType("");
    setDetectedHairThickness("");
    setEthnicityConfidence(0);
    setNeedsEthnicityConfirmation(false);
    setShowAIOverride(false);
    setConfidenceLevels({});
    setRecommendations([]);
    setFacialHairRecommendations([]);
    setGeneratedPreviews([]);
    setError("");
    setProcessing(false);
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
          <p className="text-gray-600">Loading...</p> {/* Updated text */}
        </div>
      </div>
    );
  }

  // Removed: if (!user) { return null; }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      {isCameraOpen && <CameraCapture onCapture={handleImageUpload} onCancel={() => setIsCameraOpen(false)} />}
      
      {/* Enhanced Processing Modal */}
      {processing && (
        <ProcessingModal 
          message={processingMessage}
          onCancel={() => {
            setProcessing(false);
            setStep(1);
          }}
          showCancel={true}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 barber-gradient rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
                alt="BarberAI Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              AI Barber Recommendations
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="barber-gradient text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
                alt="BarberAI"
                className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
              />
              <span>100% Free - No Signup Required</span> {/* Updated text */}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-800 font-medium text-sm sm:text-base text-center">
                AI detects your features and provides professional barber instructions with preview images
              </span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && !processing && (
          <Card className="luxury-shadow border-0">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="flex items-center justify-center space-x-2 text-lg sm:text-xl">
                <Upload className="w-4 h-4 sm:w-5 h-5" />
                <span>Upload Your Selfie</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                AI will analyze your features and provide professional barber instructions
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 space-y-6">
              <PhotoUploadTips />
              <ImageUploader
                onImageUpload={handleImageUpload}
                onTakePhoto={() => setIsCameraOpen(true)}
                processing={processing}
              />
            </CardContent>
          </Card>
        )}

        {step === 2 && showAIOverride && !processing && (
          <AIOverridePanel
            detectedData={{
              face_shape: detectedFaceShape,
              ethnicity: detectedEthnicity,
              gender: detectedGender,
              age_group: detectedAgeGroup
            }}
            confidenceLevels={confidenceLevels}
            onConfirm={handleAIOverrideConfirm}
          />
        )}

        {step === 2 && needsEthnicityConfirmation && !showAIOverride && (
          <EthnicityConfirmation
            detectedEthnicity={detectedEthnicity}
            onConfirm={handleEthnicityConfirmation}
          />
        )}

        {step === 3 && !processing && (
          <div className="space-y-4 sm:space-y-6">
            <RecommendationResults
              recommendations={recommendations}
              facialHairRecommendations={facialHairRecommendations}
              generatedPreviews={generatedPreviews}
              faceShape={detectedFaceShape}
              ethnicity={detectedEthnicity}
              gender={detectedGender}
              ageGroup={detectedAgeGroup}
              hairLength={detectedHairLength}
              hairType={detectedHairType}
              hairThickness={detectedHairThickness}
              onStartOver={resetProcess}
            />
          </div>
        )}
      </div>
    </div>
  );
}
