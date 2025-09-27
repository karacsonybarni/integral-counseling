import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  serviceType: text("service_type"),
  message: text("message").notNull(),
  preferredContact: text("preferred_contact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  serviceType: text("service_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  message: text("message"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phone: z.string().optional().transform(val => val?.trim() || undefined),
  serviceType: z.string().optional().transform(val => val?.trim() || undefined),
  message: z.string().min(1, "Message is required").max(2000, "Message must be less than 2000 characters").trim(),
  preferredContact: z.string().optional().transform(val => val?.trim() || undefined),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phone: z.string().optional().transform(val => val?.trim() || undefined),
  serviceType: z.string().min(1, "Service type is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  message: z.string().optional().transform(val => val?.trim() || undefined),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
