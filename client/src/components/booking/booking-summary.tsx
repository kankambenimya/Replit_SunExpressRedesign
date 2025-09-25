import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import type { FlightWithAirports } from "@/lib/types";

interface BookingSummaryProps {
  flight: FlightWithAirports;
  passengers: number;
  seatClass: string;
  totalPrice: number;
}

export default function BookingSummary({ flight, passengers, seatClass, totalPrice }: BookingSummaryProps) {
  const formatTime = (date: Date | string) => format(new Date(date), "HH:mm");
  const formatDate = (date: Date | string) => format(new Date(date), "MMM dd, yyyy");
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const basePrice = parseFloat(seatClass === "business" 
    ? flight.businessPrice || "0" 
    : flight.economyPrice || "0");

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plane className="h-5 w-5" />
          <span>Booking Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Flight Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-sunblue">{flight.airline}</span>
              <span className="text-gray-500 ml-2">{flight.flightNumber}</span>
            </div>
            <Badge variant="secondary">{flight.aircraft}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(flight.departureTime)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>
                {flight.departureAirportInfo?.city} → {flight.arrivalAirportInfo?.city}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}</span>
              <span className="text-gray-400">({formatDuration(flight.duration)})</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Passenger and Class Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>Passengers:</span>
            </div>
            <span className="font-medium">{passengers}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Class:</span>
            <span className="font-medium capitalize">{seatClass}</span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base fare (per person):</span>
            <span>€{basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Passengers:</span>
            <span>×{passengers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes & fees:</span>
            <span>Included</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-sunblue" data-testid="total-price">€{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-800 mb-2">Included:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Standard carry-on baggage</li>
            <li>• Seat selection (standard seats)</li>
            <li>• In-flight refreshments</li>
            <li>• 24/7 customer support</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
