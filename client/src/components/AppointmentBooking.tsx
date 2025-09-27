import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertAppointmentSchema, type InsertAppointment } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function AppointmentBooking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation('appointment');

  const form = useForm<InsertAppointment>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      message: ""
    }
  });

  // Generate available time slots (9 AM to 6 PM, excluding lunch 12-1 PM)
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  // Generate available dates (next 30 weekdays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 30) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const appointmentMutation = useMutation({
    mutationFn: (data: InsertAppointment) => apiRequest("POST", "/api/appointments", data),
    onSuccess: (data: any) => {
      toast({
        title: "Appointment Requested",
        description: data.message || "Your appointment request has been received. I'll contact you within 24 hours to confirm.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: any) => {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Unable to book appointment. Please try again or contact directly.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: InsertAppointment) => {
    appointmentMutation.mutate(data);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDateValue = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4" data-testid="booking-title">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="booking-subtitle">
            {t('subtitle')}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="booking-form-title">
              <Calendar className="h-5 w-5 text-primary" />
{t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.name')} *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-booking-name" />
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
                        <FormLabel>{t('form.email')} *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-booking-email" />
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
                        <FormLabel>{t('form.phone')}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-booking-phone" />
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
                        <FormLabel>{t('form.service')} *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-booking-service">
                              <SelectValue placeholder={t('form.service_placeholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="individual">Individual Therapy (50 min)</SelectItem>
                            <SelectItem value="couples">Couples Therapy (75 min)</SelectItem>
                            <SelectItem value="trauma">Trauma Recovery (50-90 min)</SelectItem>
                            <SelectItem value="stress">Stress Management (50 min)</SelectItem>
                            <SelectItem value="consultation">Initial Consultation (30 min)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-booking-date">
                              <SelectValue placeholder="Select a date" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDates.map((date) => (
                              <SelectItem key={getDateValue(date)} value={getDateValue(date)}>
                                {formatDate(date)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-booking-time">
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {time}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Let me know if you have any specific concerns or questions..."
                          rows={3}
                          data-testid="textarea-booking-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full group" 
                  disabled={appointmentMutation.isPending}
                  data-testid="button-book-appointment"
                >
                  {appointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Disclaimer */}
                <div className="text-sm text-muted-foreground text-center bg-muted/20 p-4 rounded-md">
                  <p data-testid="booking-disclaimer">
                    <strong>Note:</strong> This is a request for an appointment. I'll contact you within 24 hours 
                    to confirm your preferred time or suggest alternative slots if needed.
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}