import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plane, Users, Calendar, MapPin, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { passengerSchema } from "@shared/schema";
import type { FlightWithAirports, PassengerFormData } from "@/lib/types";
import PassengerForm from "@/components/booking/passenger-form";
import BookingSummary from "@/components/booking/booking-summary";
import PaymentForm from "@/components/booking/payment-form";

const bookingFormSchema = z.object({
  passengers: z.array(passengerSchema),
  contactEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms and conditions"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingPageProps {
  flightId: string;
}

export default function Booking({ flightId }: BookingPageProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("passengers");
  const { toast } = useToast();

  // Get search parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchParams = {
    adults: parseInt(urlParams.get("adults") || "1"),
    children: parseInt(urlParams.get("children") || "0"),
    infants: parseInt(urlParams.get("infants") || "0"),
    seatClass: urlParams.get("seatClass") || "economy",
  };

  const { data: flight, isLoading: flightLoading, error } = useQuery<FlightWithAirports>({
    queryKey: ["/api/flights", flightId],
    enabled: !!flightId,
  });

  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;

  // Initialize passengers array
  const initialPassengers: PassengerFormData[] = [
    ...Array(searchParams.adults).fill(null).map(() => ({
      title: "Mr" as const,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      type: "adult" as const,
    })),
    ...Array(searchParams.children).fill(null).map(() => ({
      title: "Mr" as const,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      type: "child" as const,
    })),
    ...Array(searchParams.infants).fill(null).map(() => ({
      title: "Mr" as const,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      type: "infant" as const,
    })),
  ];

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passengers: initialPassengers,
      contactEmail: "",
      phoneNumber: "",
      agreeToTerms: false,
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const basePrice = parseFloat(searchParams.seatClass === "business" 
        ? flight?.businessPrice || "0" 
        : flight?.economyPrice || "0");
      
      const totalPrice = basePrice * totalPassengers;

      return apiRequest("POST", "/api/bookings", {
        flightId,
        passengerDetails: data.passengers,
        seatClass: searchParams.seatClass,
        totalPrice: totalPrice.toFixed(2),
        contactEmail: data.contactEmail,
        status: "confirmed",
      });
    },
    onSuccess: async (response) => {
      const booking = await response.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${booking.bookingReference}`,
      });
      setLocation(`/confirmation/${booking.bookingReference}`);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const calculateTotalPrice = () => {
    if (!flight) return 0;
    const basePrice = parseFloat(searchParams.seatClass === "business" 
      ? flight.businessPrice || "0" 
      : flight.economyPrice || "0");
    return basePrice * totalPassengers;
  };

  const canProceedToPayment = () => {
    const passengers = form.watch("passengers");
    return passengers.every(p => p.firstName && p.lastName && p.dateOfBirth && p.nationality);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Flight Not Found</h2>
              <p className="text-gray-600 mb-4">The flight you're looking for could not be found.</p>
              <Button onClick={() => setLocation("/search")} data-testid="back-to-search">
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
            data-testid="back-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Please fill in passenger details and payment information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="passengers" data-testid="passengers-tab">
                  <Users className="mr-2 h-4 w-4" />
                  Passengers
                </TabsTrigger>
                <TabsTrigger 
                  value="seats" 
                  disabled={!canProceedToPayment()}
                  data-testid="seats-tab"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Seats
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  disabled={!canProceedToPayment()}
                  data-testid="payment-tab"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="passengers">
                <PassengerForm
                  form={form}
                  passengers={form.watch("passengers")}
                  onNext={() => canProceedToPayment() && setActiveTab("payment")}
                />
              </TabsContent>

              <TabsContent value="seats">
                <Card>
                  <CardHeader>
                    <CardTitle>Seat Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Seat Selection Coming Soon</h3>
                      <p className="text-gray-600 mb-6">
                        Standard seats are included with your booking. Premium seat selection will be available soon.
                      </p>
                      <Button
                        onClick={() => setActiveTab("payment")}
                        className="bg-sunblue hover:bg-blue-700"
                        data-testid="continue-to-payment"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <PaymentForm
                  form={form}
                  onSubmit={onSubmit}
                  isLoading={createBookingMutation.isPending}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            {flightLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : flight ? (
              <BookingSummary
                flight={flight}
                passengers={totalPassengers}
                seatClass={searchParams.seatClass}
                totalPrice={calculateTotalPrice()}
              />
            ) : null}

            {/* Security Notice */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-sm">Secure Booking</h4>
                    <p className="text-xs text-gray-600">Your data is protected with SSL encryption</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
