import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Download, Mail, Plane, Calendar, MapPin, Users, CreditCard } from "lucide-react";
import { format } from "date-fns";
import type { BookingWithFlight } from "@/lib/types";

interface ConfirmationPageProps {
  bookingRef: string;
}

export default function Confirmation({ bookingRef }: ConfirmationPageProps) {
  const { data: booking, isLoading, error } = useQuery<BookingWithFlight>({
    queryKey: ["/api/bookings", bookingRef],
    enabled: !!bookingRef,
  });

  const formatTime = (date: Date | string) => format(new Date(date), "HH:mm");
  const formatDate = (date: Date | string) => format(new Date(date), "MMM dd, yyyy");

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Not Found</h2>
              <p className="text-gray-600">The booking reference you're looking for could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-green-700 mb-4">
              Your flight has been successfully booked. A confirmation email has been sent to your email address.
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-48 mx-auto" />
            ) : (
              <div className="text-2xl font-bold text-green-800" data-testid="booking-reference">
                Booking Reference: {booking?.bookingReference}
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : booking && booking.flight ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flight Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5" />
                  <span>Flight Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sunblue">{booking.flight.airline}</span>
                    <span className="text-gray-500 ml-2">{booking.flight.flightNumber}</span>
                  </div>
                  <Badge variant="secondary">{booking.flight.aircraft}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(booking.flight.departureTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.flight.departureAirportInfo?.code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.flight.departureAirportInfo?.city}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-400 mb-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <Plane className="h-4 w-4" />
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.floor(booking.flight.duration / 60)}h {booking.flight.duration % 60}m
                    </div>
                    <div className="text-xs text-gray-400">Direct</div>
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(booking.flight.arrivalTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.flight.arrivalAirportInfo?.code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.flight.arrivalAirportInfo?.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(booking.flight.departureTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">{booking.seatClass}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference:</span>
                    <span className="font-semibold">{booking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-semibold">{Array.isArray(booking.passengerDetails) ? booking.passengerDetails.length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-semibold capitalize">{booking.seatClass}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Paid:</span>
                      <span className="text-sunblue">€{booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Passenger Details
                  </h4>
                  <div className="space-y-2">
                    {Array.isArray(booking.passengerDetails) && booking.passengerDetails.map((passenger: any, index: number) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">
                          {passenger.title} {passenger.firstName} {passenger.lastName}
                        </span>
                        <span className="text-gray-500 ml-2 capitalize">({passenger.type})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Action Buttons */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                data-testid="download-ticket"
              >
                <Download className="h-4 w-4" />
                <span>Download E-Ticket</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                data-testid="email-confirmation"
              >
                <Mail className="h-4 w-4" />
                <span>Email Confirmation</span>
              </Button>
              <Button
                className="bg-sunblue hover:bg-blue-700 flex items-center space-x-2"
                onClick={() => window.location.href = "/"}
                data-testid="book-another-flight"
              >
                <Plane className="h-4 w-4" />
                <span>Book Another Flight</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Important Information</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
              <li>• Check-in opens 24 hours before departure</li>
              <li>• Ensure all passengers have valid travel documents</li>
              <li>• Review baggage allowances and restrictions</li>
              <li>• For any changes or cancellations, contact our customer service</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
