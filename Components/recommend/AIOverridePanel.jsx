import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Check, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AIOverridePanel({ 
  detectedData, 
  confidenceLevels,
  onOverride,
  onConfirm 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [overrides, setOverrides] = useState({});

  const faceShapes = [
    { value: 'oval', label: 'Oval' },
    { value: 'round', label: 'Round' },
    { value: 'square', label: 'Square' },
    { value: 'heart', label: 'Heart' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'oblong', label: 'Oblong' }
  ];

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' }
  ];

  const ageGroups = [
    { value: 'adult', label: 'Adult (18+)' },
    { value: 'child', label: 'Child (5-17)' },
    { value: 'baby', label: 'Baby (0-4)' }
  ];

  const ethnicityOptions = [
    { category: "European/Caucasian", options: [
      "Northern European (British, Irish, Scandinavian, German)",
      "Southern European (Italian, Spanish, Greek, Portuguese)",
      "Eastern European (Polish, Russian, Ukrainian, Czech)",
      "European (General/Mixed European)"
    ]},
    { category: "African/Black", options: [
      "West African", "East African", "South African",
      "African American", "Afro-Caribbean", "African (General)"
    ]},
    { category: "Asian", options: [
      "East Asian - Chinese", "East Asian - Japanese", "East Asian - Korean",
      "South Asian - Indian", "South Asian - Pakistani", "South Asian - Bangladeshi",
      "Southeast Asian - Filipino", "Southeast Asian - Vietnamese", "Southeast Asian - Thai"
    ]},
    { category: "Other", options: [
      "Middle Eastern/Arab", "Hispanic/Latino", "Native American/Indigenous",
      "Pacific Islander", "Mixed/Multiracial", "Prefer not to specify"
    ]}
  ];

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 9) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
    if (confidence >= 7) return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
  };

  const needsReview = Object.values(confidenceLevels).some(conf => conf < 9);

  const handleConfirm = () => {
    const finalData = { ...detectedData, ...overrides };
    onConfirm(finalData);
  };

  const handleOverrideChange = (field, value) => {
    setOverrides(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="luxury-shadow border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5 text-blue-600" />
            <span>AI Detection Results</span>
          </CardTitle>
          {needsReview && (
            <Badge className="bg-amber-100 text-amber-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Review Needed
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {needsReview 
            ? "AI confidence is low for some features. Please review and correct if needed."
            : "Review the AI's analysis and make any corrections."
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Face Shape */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">Face Shape:</span>
              <span className="text-gray-700 capitalize">
                {overrides.face_shape || detectedData.face_shape}
              </span>
              {getConfidenceBadge(confidenceLevels.face_shape)}
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Face shape affects which hairstyles will look best</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isEditing && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Face Shape</label>
              <Select 
                value={overrides.face_shape || detectedData.face_shape}
                onValueChange={(value) => handleOverrideChange('face_shape', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select face shape" />
                </SelectTrigger>
                <SelectContent>
                  {faceShapes.map((shape) => (
                    <SelectItem key={shape.value} value={shape.value}>
                      {shape.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <Select 
                value={overrides.gender || detectedData.gender}
                onValueChange={(value) => handleOverrideChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <Select 
                value={overrides.age_group || detectedData.age_group}
                onValueChange={(value) => handleOverrideChange('age_group', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((age) => (
                    <SelectItem key={age.value} value={age.value}>
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
              <Select 
                value={overrides.ethnicity || detectedData.ethnicity}
                onValueChange={(value) => handleOverrideChange('ethnicity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {ethnicityOptions.map((category) => (
                    <div key={category.category}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                        {category.category}
                      </div>
                      {category.options.map((option) => (
                        <SelectItem key={option} value={option} className="pl-4">
                          {option}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
          <Button onClick={handleConfirm} className="barber-gradient text-white">
            <Check className="w-4 h-4 mr-2" />
            {Object.keys(overrides).length > 0 ? 'Use My Corrections' : 'Looks Good'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
