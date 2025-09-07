import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { routeSearchSchema, insertSafetyReportSchema } from "@shared/schema";
import { z } from "zod";

// 🔑 Hardcoded API keys (⚠️ use only for local testing, remove before pushing to GitHub)
const OLA_MAPS_API_KEY = "2HJ3MMxNppRpYxwHZsI35A48WiMqflvC9sVjYzAZ";
const GEOCODING_API_KEY = "QUXMIFIPVVIgQkFTRSBBUkUgQKVMT05HIFRPIFVT";

const OLA_MAPS_BASE_URL = "https://api.olamaps.io";

// Mock route data for fallback
function createMockRoutes(startLocation: string, endLocation: string) {
  const baseDistance = 5 + Math.random() * 10;
  const baseDuration = Math.round(baseDistance * 4 + Math.random() * 10);

  return [
    {
      id: "route_0",
      startLocation,
      endLocation,
      routeData: JSON.stringify({ mock: true, path: "safest_route" }),
      safetyScore: 90,
      distance: baseDistance,
      duration: baseDuration,
      wellLit: true,
      crowded: true,
      hasPolicePresence: true,
    },
  ];
}

interface OlaRouteResponse {
  routes: Array<{
    legs: Array<{
      distance: { value: number; text: string };
      duration: { value: number; text: string };
    }>;
  }>;
}

// Simple mock safety scoring
function calculateSafetyScore(): number {
  let score = 70;
  const random = Math.random();
  if (random > 0.7) score += 20;
  if (random > 0.5) score += 10;
  if (random < 0.3) score -= 25;
  return Math.max(10, Math.min(100, score));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // 🚦 Route search
  app.post("/api/routes/search", async (req, res) => {
    try {
      const searchData = routeSearchSchema.parse(req.body);
      let processedRoutes;

      try {
        // Step 1: Geocode start + end
        const [startRes, endRes] = await Promise.all([
          fetch(
            `${OLA_MAPS_BASE_URL}/places/v1/geocode?input=${encodeURIComponent(
              searchData.startLocation
            )}&api_key=${GEOCODING_API_KEY}`
          ),
          fetch(
            `${OLA_MAPS_BASE_URL}/places/v1/geocode?input=${encodeURIComponent(
              searchData.endLocation
            )}&api_key=${GEOCODING_API_KEY}`
          ),
        ]);

        const startData = await startRes.json();
        const endData = await endRes.json();

        if (!startData?.results?.[0] || !endData?.results?.[0]) {
          throw new Error("Geocoding failed for start or end location");
        }

        const startCoords = startData.results[0].geometry.location;
        const endCoords = endData.results[0].geometry.location;

        // Step 2: Call Ola Maps Routing API (✅ GET request with query params)
        const olaResponse = await fetch(
          `${OLA_MAPS_BASE_URL}/routing/v1/directions?origin=${startCoords.lat},${startCoords.lng}&destination=${endCoords.lat},${endCoords.lng}&alternatives=true&api_key=${OLA_MAPS_API_KEY}`
        );

        if (!olaResponse.ok) throw new Error("Ola Routing API failed");

        const olaData: OlaRouteResponse = await olaResponse.json();

        // Step 3: Process results
        processedRoutes = olaData.routes.map((route, index) => {
          const leg = route.legs[0];
          const distance = leg.distance.value / 1000; // km
          const duration = Math.round(leg.duration.value / 60); // minutes
          const safetyScore = calculateSafetyScore();

          return {
            id: `route_${index}`,
            startLocation: searchData.startLocation,
            endLocation: searchData.endLocation,
            routeData: JSON.stringify(route),
            safetyScore,
            distance,
            duration,
            wellLit: safetyScore > 80,
            crowded: safetyScore > 70,
            hasPolicePresence: safetyScore > 85,
          };
        });
      } catch (err) {
        console.error("Ola Maps failed, using mock data:", err);
        processedRoutes = createMockRoutes(
          searchData.startLocation,
          searchData.endLocation
        );
      }

      // Save to in-memory storage
      for (const route of processedRoutes) {
        await storage.createRoute(route);
      }

      res.json({ routes: processedRoutes });
    } catch (error) {
      console.error("Route search error:", error);
      res.status(500).json({
        message: "Failed to search routes",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // 📍 Autocomplete suggestions
  app.get("/api/locations/suggest", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const olaResponse = await fetch(
        `${OLA_MAPS_BASE_URL}/places/v1/autocomplete?input=${encodeURIComponent(
          query
        )}&api_key=${OLA_MAPS_API_KEY}`
      );

      if (!olaResponse.ok) throw new Error("Autocomplete API error");

      const data = await olaResponse.json();
      res.json(data);
    } catch (error) {
      console.error("Location suggest error:", error);
      res.status(500).json({
        message: "Failed to get location suggestions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // 🛡️ Safety reports
  app.post("/api/safety/report", async (req, res) => {
    try {
      const reportData = insertSafetyReportSchema.parse(req.body);
      const report = await storage.createSafetyReport(reportData);
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit safety report" });
      }
    }
  });

  app.get("/api/safety/reports", async (req, res) => {
    try {
      const { lat, lng, radius = 1 } = req.query;
      if (!lat || !lng) {
        return res
          .status(400)
          .json({ message: "Latitude and longitude are required" });
      }
      const reports = await storage.getSafetyReports(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius as string)
      );
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to get safety reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
