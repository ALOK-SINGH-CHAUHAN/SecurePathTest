import { Shield, AlertTriangle, XCircle } from "lucide-react";

export interface RouteOption {
  id: string;
  distance: number;     // in meters
  duration: number;     // in seconds
  safetyScore: number;  // 0–100
  polyline?: string;    // encoded polyline if available
}

/**
 * Fetch routes (through backend proxy to avoid CORS)
 */
export async function searchRoutes(
  startLocation: string,
  endLocation: string,
  preferences: any
): Promise<RouteOption[]> {
  try {
    const response = await fetch(
      `http://localhost:5000/api/directions?origin=${encodeURIComponent(
        startLocation
      )}&destination=${encodeURIComponent(endLocation)}`
    );

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.routes || []).map((route: any, index: number) => ({
      id: `route-${index}`,
      distance: route.summary?.lengthInMeters ?? 0,
      duration: route.summary?.travelTimeInSeconds ?? 0,
      safetyScore: Math.floor(Math.random() * 30) + 70,
      polyline: route.polyline,
    }));
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}

/**
 * Convert a safety score into UI color
 */
export function getSafetyColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 50) return "orange";
  return "red";
}

/**
 * Convert a safety score into descriptive text
 */
export function getSafetyText(score: number): string {
  if (score >= 80) return "Safe Route";
  if (score >= 50) return "Moderate Risk";
  return "Unsafe Route";
}

/**
 * Convert a safety score into an icon
 */
export function getSafetyIcon(score: number) {
  if (score >= 80) return Shield;
  if (score >= 50) return AlertTriangle;
  return XCircle;
}

/**
 * Location suggestions (now also via backend proxy)
 */
export async function getLocationSuggestions(query: string): Promise<string[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `http://localhost:5000/api/autocomplete?input=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.predictions || []).map((p: any) => p.description);
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
}
