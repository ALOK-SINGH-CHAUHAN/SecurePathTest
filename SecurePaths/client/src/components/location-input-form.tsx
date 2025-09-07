import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Flag, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLocationSuggestions, LocationSuggestion } from "@/lib/ola-maps";

interface LocationInputFormProps {
  onSearch: (startLocation: string, endLocation: string, preferences: any) => void;
  isLoading?: boolean;
}

export default function LocationInputForm({ onSearch, isLoading }: LocationInputFormProps) {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [preferences, setPreferences] = useState({
    prioritizeWellLit: true,
    avoidIsolated: true,
    preferPublicTransport: false,
  });

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  const { data: startSuggestions = [] } = useQuery<LocationSuggestion[]>({
    queryKey: ["/api/locations/suggest", startQuery],
    enabled: startQuery.length > 2,
    queryFn: () => getLocationSuggestions(startQuery),
  });

  const { data: endSuggestions = [] } = useQuery<LocationSuggestion[]>({
    queryKey: ["/api/locations/suggest", endQuery],
    enabled: endQuery.length > 2,
    queryFn: () => getLocationSuggestions(endQuery),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startLocation && endLocation) {
      onSearch(startLocation, endLocation, preferences);
    }
  };

  const handlePreferenceChange = (key: string, checked: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
          <MapPin className="mr-2" />
          Plan Your Safe Route
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Location */}
          <div className="relative">
            <Label htmlFor="start-location" className="block text-sm font-medium mb-2">
              <MapPin className="inline w-4 h-4 text-green-500 mr-1" />
              From
            </Label>
            <Input
              id="start-location"
              data-testid="input-start-location"
              type="text"
              placeholder="Enter starting location"
              value={startQuery}
              onChange={(e) => {
                setStartQuery(e.target.value);
                setShowStartSuggestions(true);
              }}
              onFocus={() => setShowStartSuggestions(true)}
              onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
              className="w-full"
            />
            {showStartSuggestions && startSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-border rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                {startSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    data-testid={`suggestion-start-${suggestion.place_id}`}
                    className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                    onClick={() => {
                      setStartLocation(suggestion.description);
                      setStartQuery(suggestion.description);
                      setShowStartSuggestions(false);
                    }}
                  >
                    <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                    <div className="text-muted-foreground text-xs">{suggestion.structured_formatting.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* End Location */}
          <div className="relative">
            <Label htmlFor="end-location" className="block text-sm font-medium mb-2">
              <Flag className="inline w-4 h-4 text-red-500 mr-1" />
              To
            </Label>
            <Input
              id="end-location"
              data-testid="input-end-location"
              type="text"
              placeholder="Enter destination"
              value={endQuery}
              onChange={(e) => {
                setEndQuery(e.target.value);
                setShowEndSuggestions(true);
              }}
              onFocus={() => setShowEndSuggestions(true)}
              onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
              className="w-full"
            />
            {showEndSuggestions && endSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-border rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                {endSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    data-testid={`suggestion-end-${suggestion.place_id}`}
                    className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                    onClick={() => {
                      setEndLocation(suggestion.description);
                      setEndQuery(suggestion.description);
                      setShowEndSuggestions(false);
                    }}
                  >
                    <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                    <div className="text-muted-foreground text-xs">{suggestion.structured_formatting.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Safety Preferences */}
          <div>
            <Label className="block text-sm font-medium mb-2">Safety Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="well-lit"
                  data-testid="checkbox-well-lit"
                  checked={preferences.prioritizeWellLit}
                  onCheckedChange={(checked) => handlePreferenceChange("prioritizeWellLit", checked as boolean)}
                />
                <Label htmlFor="well-lit" className="text-sm">Prioritize well-lit routes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="avoid-isolated"
                  data-testid="checkbox-avoid-isolated"
                  checked={preferences.avoidIsolated}
                  onCheckedChange={(checked) => handlePreferenceChange("avoidIsolated", checked as boolean)}
                />
                <Label htmlFor="avoid-isolated" className="text-sm">Avoid isolated areas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="public-transport"
                  data-testid="checkbox-public-transport"
                  checked={preferences.preferPublicTransport}
                  onCheckedChange={(checked) => handlePreferenceChange("preferPublicTransport", checked as boolean)}
                />
                <Label htmlFor="public-transport" className="text-sm">Prefer public transport routes</Label>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            data-testid="button-search-routes"
            disabled={!startLocation || !endLocation || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Search className="mr-2 w-4 h-4" />
            {isLoading ? "Finding Routes..." : "Find Safe Routes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
