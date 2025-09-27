import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactInquirySchema, type InsertContactInquiry } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContactInquiry>({
    resolver: zodResolver(insertContactInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
      preferredContact: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: (data: InsertContactInquiry) => apiRequest("/api/contact", "POST", data),
    onSuccess: (data: any) => {
      toast({
        title: "Message Sent",
        description: data.message || "Thank you for reaching out. I'll get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: (error: any) => {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Unable to send message. Please try again or contact directly.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: InsertContactInquiry) => {
    contactMutation.mutate(data);
  };

  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="contact-title">
            Get Started Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="contact-subtitle">
            Taking the first step towards better mental health is courageous. 
            I'm here to support you on this journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="form-title">Request a Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Interested In</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-service">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">Individual Therapy</SelectItem>
                              <SelectItem value="couples">Couples Therapy</SelectItem>
                              <SelectItem value="trauma">Trauma Recovery</SelectItem>
                              <SelectItem value="stress">Stress Management</SelectItem>
                              <SelectItem value="consultation">Initial Consultation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="preferredContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-preference">
                              <SelectValue placeholder="How would you like to be contacted?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="either">Either email or phone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell me a bit about what brings you here *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share what you'd like to work on or any questions you have..."
                            rows={4}
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={contactMutation.isPending}
                    data-testid="button-submit-form"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="contact-info-title">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground" data-testid="contact-phone">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground" data-testid="contact-email">dr.thompson@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Office Location</p>
                    <p className="text-muted-foreground" data-testid="contact-address">
                      123 Wellness Way<br />
                      Los Angeles, CA 90210
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Office Hours</p>
                    <p className="text-muted-foreground" data-testid="contact-hours">
                      Monday - Friday: 9:00 AM - 7:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2" data-testid="emergency-title">
                  Emergency Support
                </h3>
                <p className="text-sm text-muted-foreground mb-3" data-testid="emergency-description">
                  If you're experiencing a mental health emergency, please contact:
                </p>
                <ul className="text-sm space-y-1">
                  <li data-testid="emergency-hotline">• Crisis Hotline: 988 (Suicide & Crisis Lifeline)</li>
                  <li data-testid="emergency-911">• Emergency Services: 911</li>
                  <li data-testid="emergency-text">• Crisis Text Line: Text HOME to 741741</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}