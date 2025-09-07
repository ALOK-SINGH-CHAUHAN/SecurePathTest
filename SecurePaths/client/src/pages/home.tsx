import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import SafetyMottoBanner from "@/components/safety-motto-banner";
import LocationInputForm from "@/components/location-input-form";
import InteractiveMap from "@/components/interactive-map";
import RouteCard from "@/components/route-card";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, AlertTriangle, Flag, Users, CheckCircle, Phone, Shield } from "lucide-react";
import { searchRoutes, type RouteOption } from "@/lib/ola-maps";

export default function Home() {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: ({ startLocation, endLocation, preferences }: {
      startLocation: string;
      endLocation: string;
      preferences: any;
    }) => searchRoutes(startLocation, endLocation, preferences),
    onSuccess: (data) => {
      setRoutes(data);
      setSelectedRoute(data[0] || null);
      toast({
        title: "Routes Found",
        description: `Found ${data.length} route${data.length === 1 ? '' : 's'} for your journey.`,
      });
    },
    onError: (error) => {
      console.error("Route search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to find routes. Please check your locations and try again.",
        variant: "destructive",
      });
    },
  });

  const handleRouteSearch = (startLocation: string, endLocation: string, preferences: any) => {
    searchMutation.mutate({ startLocation, endLocation, preferences });
  };

  const handleEmergencyCall = (number: string) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${number}`, '_self');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SafetyMottoBanner />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Route Planning */}
          <div className="lg:col-span-1 space-y-6">
            <LocationInputForm 
              onSearch={handleRouteSearch}
              isLoading={searchMutation.isPending}
            />

            {/* Safety Tips */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-secondary flex items-center">
                  <Shield className="mr-2" />
                  Safety Tips
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span>Share your route with trusted contacts</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span>Keep your phone charged and accessible</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span>Trust your instincts about routes</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span>Use well-lit and populated paths</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-red-600 flex items-center">
                  <Phone className="mr-2" />
                  Emergency Contacts
                </h3>
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleEmergencyCall('112')}
                    data-testid="button-emergency-112"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    Emergency: 112
                  </Button>
                  <Button 
                    onClick={() => handleEmergencyCall('1091')}
                    data-testid="button-emergency-1091"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Shield className="mr-2 w-4 h-4" />
                    Women Helpline: 1091
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center & Right Panel - Map and Routes */}
          <div className="lg:col-span-2 space-y-6">
            <InteractiveMap routes={routes} selectedRoute={selectedRoute} />

            {/* Route Options */}
            {routes.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {routes.map((route, index) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    index={index}
                    isSelected={selectedRoute?.id === route.id}
                    onSelect={() => setSelectedRoute(route)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Safety Features */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Share Location */}
          <Card className="shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Share Location</h3>
              <p className="text-sm text-muted-foreground mb-3">Share your real-time location with trusted contacts</p>
              <Button 
                data-testid="button-share-location"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Share Now
              </Button>
            </CardContent>
          </Card>

          {/* SOS Alert */}
          <Card className="shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-red-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">SOS Alert</h3>
              <p className="text-sm text-muted-foreground mb-3">Send emergency alert to your emergency contacts</p>
              <Button 
                data-testid="button-sos-alert"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Emergency
              </Button>
            </CardContent>
          </Card>

          {/* Safety Report */}
          <Card className="shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flag className="text-yellow-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Report Safety</h3>
              <p className="text-sm text-muted-foreground mb-3">Report safety incidents to help other women</p>
              <Button 
                data-testid="button-report-safety"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Report
              </Button>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-3">Connect with other women for safety tips</p>
              <Button 
                data-testid="button-join-community"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Join
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
