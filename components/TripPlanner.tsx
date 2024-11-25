"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users, Heart, Home, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { NumberInput } from "@/components/ui/number-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function TripPlanner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    destination: "",
    startDate: new Date("2024-12-28"),
    endDate: new Date("2025-01-04"),
    adults: 1,
    childrens: 0,
    interests: [] as string[],
    startingLocation: "",
    accommodationType: "",
  });
  const [showInspirationModal, setShowInspirationModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const ecoFriendlySpots = [
    { name: "Costa Rica", description: "Known for its biodiversity and eco-lodges" },
    { name: "Iceland", description: "Leader in renewable energy and stunning natural landscapes" },
    { name: "Palau", description: "Island nation with strong marine conservation efforts" },
    { name: "Slovenia", description: "Europe's green gem with sustainable tourism practices" },
    { name: "Bhutan", description: "Carbon-negative country with strict environmental policies" }
  ];

  const interestOptions = [
    { value: "nightlife", label: "Night Life" },
    { value: "citytours", label: "City Tours" },
    { value: "adventure", label: "Adventure" },
    { value: "culture", label: "Culture" },
    { value: "family", label: "Family Activities" },
    { value: "nature", label: "Nature & Wildlife" },
    { value: "eco", label: "Eco-Adventures" },
    { value: "local", label: "Local Communities" }
  ];

  const requestLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
            if (!apiKey) {
              setLocationError("API key is missing.");
              return;
            }

            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.results?.[0]?.formatted) {
              updateFormData("startingLocation", data.results[0].formatted);
            }
          } catch (error) {
            setLocationError("Error fetching location details.");
            console.error("Error fetching location:", error);
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          setLocationError("Unable to retrieve your location.");
          console.error("Error getting location:", error);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex flex-col space-y-3 p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-500" />
                <div className="flex-grow flex items-center space-x-3">
                  <Input
                    value={formData.destination}
                    onChange={(e) => updateFormData("destination", e.target.value)}
                    placeholder="Where would you like to go?"
                    className="flex-grow"
                  />
                  <Button 
                    variant="outline" 
                    className="text-green-600 hover:text-green-700 whitespace-nowrap"
                    onClick={() => setShowInspirationModal(true)}
                  >
                    Get Inspired
                  </Button>
                </div>
              </div>
            </div>
        
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-white rounded-lg border">
              <Calendar className="h-5 w-5 text-green-500" />
              <div className="text-sm w-full">
                <DateRangePicker
                  value={[formData.startDate, formData.endDate]}
                  onChange={(dates: Date[]) => {
                    updateFormData("startDate", dates[0]);
                    updateFormData("endDate", dates[1]);
                  }}
                  className="w-full"
                />
              </div>
            </div>
        
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <Users className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex items-center space-x-4 flex-grow">
                <div className="flex items-center space-x-2">
                  <span className="text-sm whitespace-nowrap">Adults:</span>
                  <NumberInput
                    value={formData.adults}
                    onChange={(value: number) => updateFormData("adults", value)}
                    min={1}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm whitespace-nowrap">Children:</span>
                  <NumberInput
                    value={formData.childrens}
                    onChange={(value: number) => updateFormData("childrens", value)}
                    min={0}
                  />
                </div>
              </div>
              <Building className="h-5 w-5 text-green-500 flex-shrink-0" />
              <Select
                value={formData.accommodationType}
                onValueChange={(value: string) => updateFormData("accommodationType", value)}
              >
                <SelectTrigger className="w-full border-0 focus:ring-0">
                  <SelectValue placeholder="Accommodation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eco-hotel">Eco-Hotel</SelectItem>
                  <SelectItem value="hostel">Sustainable Hostel</SelectItem>
                  <SelectItem value="apartment">Green Apartment</SelectItem>
                  <SelectItem value="eco-lodge">Eco-Lodge</SelectItem>
                  <SelectItem value="homestay">Local Homestay</SelectItem>
                </SelectContent>
              </Select>
            </div>
        
            <div className="flex flex-col space-y-3 p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-green-500" />
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium">Select your interests</span>
                  <Button 
                    variant="outline"
                    className="text-green-600 hover:text-green-700 w-full sm:w-auto"
                    onClick={() => setShowInterestsModal(true)}
                  >
                    {formData.interests.length > 0 ? `${formData.interests.length} selected` : "Choose interests"}
                  </Button>
                </div>
              </div>
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interestOptions.find(option => option.value === interest)?.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
        
            <div className="flex flex-col space-y-3 p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5 text-green-500" />
                <div className="flex-grow flex items-center space-x-3">
                  <Input 
                    value={formData.startingLocation}
                    placeholder="Where are you starting from?"
                    className="flex-grow"
                    onChange={(e) => updateFormData("startingLocation", e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    className="text-green-600 hover:text-green-700 whitespace-nowrap"
                    onClick={requestLocation}
                    disabled={locationLoading}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {locationLoading ? "Getting location..." : "Use my location"}
                  </Button>
                </div>
              </div>
              {locationError && (
                <div className="text-sm text-red-500 mt-2">
                  {locationError}
                </div>
              )}
            </div>
        
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
              onClick={nextStep}
            >
              Plan My Eco-Trip
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6 shadow-lg max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[300px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>
      <Dialog open={showInspirationModal} onOpenChange={setShowInspirationModal}>
        <DialogContent className="sm:max-w-[500px] bg-green-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-800">Eco-Friendly Tourism Spots</DialogTitle>
            <DialogDescription className="text-green-700">
              Discover these inspiring eco-friendly destinations:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {ecoFriendlySpots.map((spot, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-xl text-green-700 mb-2">{spot.name}</h3>
                <p className="text-sm text-green-600 mb-4">{spot.description}</p>
                <Button
                  variant="outline"
                  className="w-full text-green-600 hover:text-white hover:bg-green-600 border-green-600 transition-colors duration-300"
                  onClick={() => {
                    updateFormData("destination", spot.name);
                    setShowInspirationModal(false);
                  }}
                >
                  Select This Destination
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showInterestsModal} onOpenChange={setShowInterestsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Your Interests</DialogTitle>
            <DialogDescription>
              Choose the activities you&apos;re interested in for your eco-trip:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {interestOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={formData.interests.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newInterests = checked
                      ? [...formData.interests, option.value]
                      : formData.interests.filter((i) => i !== option.value);
                    updateFormData("interests", newInterests);
                  }}
                />
                <label htmlFor={option.value} className="text-sm">{option.label}</label>
              </div>
            ))}
          </div>
          <Button
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setShowInterestsModal(false)}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}