import { Card, CardContent } from "@/components/ui/card";
import { Clock, Route, Lightbulb, Moon, Users, UserX, ShieldCheck, TriangleAlert, XCircle } from "lucide-react";
import { getSafetyColor, getSafetyIcon, getSafetyText } from "@/lib/ola-maps";
import type { RouteOption } from "@/lib/ola-maps";

interface RouteCardProps {
  route: RouteOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ route, index, isSelected, onSelect }: RouteCardProps) {
  const safetyColorClass = getSafetyColor(route.safetyScore);
  const safetyIconName = getSafetyIcon(route.safetyScore);
  const safetyText = getSafetyText(route.safetyScore);

  const getSafetyIconComponent = () => {
    if (safetyIconName === "shield-check") return ShieldCheck;
    if (safetyIconName === "triangle-alert") return TriangleAlert;
    return XCircle;
  };

  const SafetyIcon = getSafetyIconComponent();

  const getRouteFeature = () => {
    if (route.wellLit) return { icon: Lightbulb, text: "Well-lit path" };
    if (route.crowded) return { icon: Users, text: "Populated area" };
    return { icon: UserX, text: "Isolated path" };
  };

  const routeFeature = getRouteFeature();

  return (
    <Card 
      className={`route-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
      data-testid={`card-route-${index}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-primary">Route {index + 1}</h4>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${safetyColorClass}`}>
            <SafetyIcon className="w-3 h-3 mr-1" />
            {route.safetyScore}% Safe
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center" data-testid={`text-duration-${index}`}>
            <Clock className="w-4 h-4 mr-2" />
            <span>{route.duration} mins</span>
          </div>
          <div className="flex items-center" data-testid={`text-distance-${index}`}>
            <Route className="w-4 h-4 mr-2" />
            <span>{route.distance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center" data-testid={`text-feature-${index}`}>
            <routeFeature.icon className="w-4 h-4 mr-2" />
            <span>{routeFeature.text}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="safety-gradient h-2 rounded-full bg-gray-200">
            <div 
              className={`h-full rounded-full ${
                route.safetyScore >= 80 ? 'bg-green-500' : 
                route.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${route.safetyScore}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
