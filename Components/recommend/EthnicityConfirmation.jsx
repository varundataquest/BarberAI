
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit, Brain, AlertTriangle } from 'lucide-react';

export default function EthnicityConfirmation({ detectedEthnicity, onConfirm }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedEthnicity, setSelectedEthnicity] = useState(detectedEthnicity);

  const ethnicityCategories = [
    {
      category: "European/Caucasian",
      options: [
        "Northern European (British, Irish, Scandinavian, German)",
        "Southern European (Italian, Spanish, Greek, Portuguese)",
        "Eastern European (Polish, Russian, Ukrainian, Czech)",
        "European (General/Mixed European)"
      ]
    },
    {
      category: "African/Black",
      options: [
        "West African",
        "East African (Ethiopian, Kenyan, Somali)",
        "South African",
        "African American",
        "Afro-Caribbean",
        "African (General/Mixed African)"
      ]
    },
    {
      category: "Asian",
      options: [
        "East Asian - Chinese",
        "East Asian - Japanese", 
        "East Asian - Korean",
        "South Asian - Indian",
        "South Asian - Pakistani",
        "South Asian - Bangladeshi",
        "Southeast Asian - Filipino",
        "Southeast Asian - Vietnamese",
        "Southeast Asian - Thai",
        "Southeast Asian - Indonesian",
        "Southeast Asian - Malaysian"
      ]
    },
    {
      category: "Middle Eastern/North African",
      options: [
        "Arab (General)",
        "Persian/Iranian",
        "Turkish",
        "Israeli/Jewish",
        "North African (Moroccan, Egyptian, etc.)"
      ]
    },
    {
      category: "Hispanic/Latino",
      options: [
        "Mexican",
        "Central American",
        "South American",
        "Caribbean Hispanic",
        "Hispanic/Latino (General)"
      ]
    },
    {
      category: "Other",
      options: [
        "Native American/Indigenous",
        "Pacific Islander - Hawaiian",
        "Pacific Islander - Samoan",
        "Pacific Islander - Other",
        "Mixed/Multiracial - European & Asian",
        "Mixed/Multiracial - European & African",
        "Mixed/Multiracial - Other combination",
        "Prefer not to specify"
      ]
    }
  ];

  const handleConfirm = () => {
    onConfirm(selectedEthnicity);
  };

  return (
    <Card className="luxury-shadow border-0 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl">Confirm Your Ethnicity</CardTitle>
        <CardDescription className="text-base">
          This ensures our AI generates preview images that truly represent you with 99%+ accuracy.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">AI Detection Result</h4>
              <p className="text-amber-700 text-sm mb-2">
                Our AI detected: <strong>{detectedEthnicity}</strong>
              </p>
              <p className="text-amber-600 text-xs">
                AI confidence was below 99%, so we'd like you to confirm for the most accurate preview images.
              </p>
            </div>
          </div>
        </div>

        {isCorrect === null && (
          <div className="space-y-4">
            <p className="text-center font-medium text-gray-700">
              Is this detection correct?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => onConfirm(detectedEthnicity)}
                className="flex-1 barber-gradient text-white"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Yes, That's Correct
              </Button>
              <Button
                onClick={() => setIsCorrect(false)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Edit className="w-5 h-5 mr-2" />
                No, Let Me Choose
              </Button>
            </div>
          </div>
        )}

        {isCorrect === false && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium text-gray-900 mb-2">Please select your ethnicity:</h4>
              <p className="text-sm text-gray-600">
                Choose the option that best represents your heritage for accurate styling recommendations.
              </p>
            </div>

            <div className="space-y-4">
              {ethnicityCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                  <h5 className="font-medium text-gray-800 text-sm border-b border-gray-200 pb-1">
                    {category.category}
                  </h5>
                  <div className="grid gap-2">
                    {category.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => setSelectedEthnicity(option)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selectedEthnicity === option
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{option}</span>
                          {selectedEthnicity === option && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleConfirm} 
              className="w-full barber-gradient text-white" 
              size="lg"
              disabled={!selectedEthnicity}
            >
              Confirm and Continue with "{selectedEthnicity}"
            </Button>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800 text-sm">
            <strong>Why we ask:</strong> 99%+ accurate ethnicity ensures our AI generates preview images that authentically represent how different hairstyles will look on you, respecting your unique features and heritage.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
