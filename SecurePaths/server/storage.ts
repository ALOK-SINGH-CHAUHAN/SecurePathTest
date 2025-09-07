import { type User, type InsertUser, type Route, type InsertRoute, type SafetyReport, type InsertSafetyReport } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createRoute(route: InsertRoute): Promise<Route>;
  getRoutes(startLocation: string, endLocation: string): Promise<Route[]>;
  
  createSafetyReport(report: InsertSafetyReport): Promise<SafetyReport>;
  getSafetyReports(latitude: number, longitude: number, radius: number): Promise<SafetyReport[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private routes: Map<string, Route>;
  private safetyReports: Map<string, SafetyReport>;

  constructor() {
    this.users = new Map();
    this.routes = new Map();
    this.safetyReports = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { 
      ...insertRoute, 
      id,
      createdAt: new Date(),
      wellLit: insertRoute.wellLit ?? false,
      crowded: insertRoute.crowded ?? false,
      hasPolicePresence: insertRoute.hasPolicePresence ?? false
    };
    this.routes.set(id, route);
    return route;
  }

  async getRoutes(startLocation: string, endLocation: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(
      (route) => route.startLocation === startLocation && route.endLocation === endLocation
    );
  }

  async createSafetyReport(insertReport: InsertSafetyReport): Promise<SafetyReport> {
    const id = randomUUID();
    const report: SafetyReport = {
      ...insertReport,
      id,
      reportedAt: new Date(),
      description: insertReport.description ?? null
    };
    this.safetyReports.set(id, report);
    return report;
  }

  async getSafetyReports(latitude: number, longitude: number, radius: number): Promise<SafetyReport[]> {
    // Simple distance calculation for demo - in real app would use proper geospatial queries
    return Array.from(this.safetyReports.values()).filter(report => {
      const distance = Math.sqrt(
        Math.pow(report.latitude - latitude, 2) + Math.pow(report.longitude - longitude, 2)
      );
      return distance <= radius;
    });
  }
}

export const storage = new MemStorage();
