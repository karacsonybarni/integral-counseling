import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactInquirySchema, insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(validatedData);
      
      // Log the inquiry for the therapist (in a real app, this would send an email)
      console.log("New contact inquiry received:", {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        serviceType: inquiry.serviceType,
        message: inquiry.message.substring(0, 100) + "..."
      });
      
      res.json({ 
        success: true, 
        message: "Thank you for reaching out. I'll get back to you within 24 hours.",
        inquiryId: inquiry.id
      });
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your form data and try again.",
          errors: error.errors
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Something went wrong. Please try again later."
        });
      }
    }
  });

  // Book appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      
      // Log the appointment for the therapist (in a real app, this would send an email)
      console.log("New appointment booking:", {
        id: appointment.id,
        name: appointment.name,
        email: appointment.email,
        serviceType: appointment.serviceType,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime
      });
      
      res.json({ 
        success: true, 
        message: "Your appointment request has been received. I'll contact you within 24 hours to confirm.",
        appointmentId: appointment.id
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your appointment details and try again.",
          errors: error.errors
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Something went wrong. Please try again later."
        });
      }
    }
  });

  // NOTE: Admin endpoints removed for security - would require authentication in production
  // GET /api/contact and GET /api/appointments endpoints removed to protect sensitive client data
  // These would only be accessible with proper authentication/authorization in a real implementation

  const httpServer = createServer(app);

  return httpServer;
}
