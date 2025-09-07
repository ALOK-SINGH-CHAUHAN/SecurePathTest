import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Expand, Crosshair, Plus, Minus } from "lucide-react";
import type { RouteOption } from "@/lib/ola-maps";

interface InteractiveMapProps {
  routes: RouteOption[];
  selectedRoute: RouteOption | null;
}

export default function InteractiveMap({ routes, selectedRoute }: InteractiveMapProps) {
  const [zoomLevel, setZoomLevel] = useState(13);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 8));

  return (
    <Card className="shadow-lg border border-border overflow-hidden h-96 lg:h-[600px]">
      <div className="bg-muted p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Map className="mr-2 text-primary" />
            Route Map
          </h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              data-testid="button-expand-map"
            >
              <Expand className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              data-testid="button-center-map"
            >
              <Crosshair className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="map-container h-full flex items-center justify-center relative bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Map Placeholder - In real app, integrate Ola Maps SDK */}
        <div className="text-center text-muted-foreground">
          <Map className="w-16 h-16 mb-4 text-primary/30 mx-auto" />
          <p className="text-lg font-medium">Interactive Map View</p>
          <p className="text-sm">
            {routes.length > 0 
              ? `Showing ${routes.length} route${routes.length === 1 ? '' : 's'}`
              : "Enter locations to see safe routes"
            }
          </p>
          {selectedRoute && (
            <p className="text-sm mt-2 text-primary font-medium">
              Selected: Route with {selectedRoute.safetyScore}% safety score
            </p>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleZoomIn}
            data-testid="button-zoom-in"
            className="bg-white shadow-md"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleZoomOut}
            data-testid="button-zoom-out"
            className="bg-white shadow-md"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* Safety Legend */}
        <div className="absolute bottom-4 left-4 bg-white border border-border rounded-lg p-3 shadow-lg">
          <h4 className="text-sm font-semibold mb-2">Safety Rating</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>High Safety (80%+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Medium Safety (60-79%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Low Safety (&lt;60%)</span>
            </div>
          </div>
        </div>

        {/* Route visualization overlay */}
        {routes.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {routes.map((route, index) => (
                <g key={route.id}>
                  {/* Mock route path */}
                  <path
                    d={`M 20 ${100 + index * 30} Q 200 ${80 + index * 20} 380 ${120 + index * 25}`}
                    stroke={
                      route.safetyScore >= 80 ? '#10B981' :
                      route.safetyScore >= 60 ? '#F59E0B' : '#EF4444'
                    }
                    strokeWidth={selectedRoute?.id === route.id ? "4" : "2"}
                    fill="none"
                    opacity={selectedRoute ? (selectedRoute.id === route.id ? 1 : 0.3) : 0.7}
                  />
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
}
