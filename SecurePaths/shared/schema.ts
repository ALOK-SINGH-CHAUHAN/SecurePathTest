import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  routeData: text("route_data").notNull(), // JSON string of route coordinates
  safetyScore: integer("safety_score").notNull(), // 0-100
  distance: real("distance").notNull(), // in km
  duration: integer("duration").notNull(), // in minutes
  wellLit: boolean("well_lit").default(false),
  crowded: boolean("crowded").default(false),
  hasPolicePresence: boolean("has_police_presence").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const safetyReports = pgTable("safety_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  reportType: text("report_type").notNull(), // 'safe', 'unsafe', 'incident'
  description: text("description"),
  reportedAt: timestamp("reported_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export const insertSafetyReportSchema = createInsertSchema(safetyReports).omit({
  id: true,
  reportedAt: true,
});

export const routeSearchSchema = z.object({
  startLocation: z.string().min(1),
  endLocation: z.string().min(1),
  preferences: z.object({
    prioritizeWellLit: z.boolean().default(true),
    avoidIsolated: z.boolean().default(true),
    preferPublicTransport: z.boolean().default(false),
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type SafetyReport = typeof safetyReports.$inferSelect;
export type InsertSafetyReport = z.infer<typeof insertSafetyReportSchema>;
export type RouteSearch = z.infer<typeof routeSearchSchema>;
