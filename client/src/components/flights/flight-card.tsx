import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import type { FlightWithAirports } from "@/lib/types";

interface FlightCardProps {
  flight: FlightWithAirports;
  onSelect?: () => void;
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (date: Date) => format(new Date(date), "HH:mm");
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`flight-card-${flight.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Flight Info */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sunblue rounded-full flex items-center justify-center">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-sunblue">{flight.airline}</span>
                  <span className="text-gray-500 ml-2">{flight.flightNumber}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {flight.aircraft}
              </Badge>
            </div>

            {/* Route and Times */}
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Departure */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900" data-testid={`flight-departure-time-${flight.id}`}>
                  {formatTime(flight.departureTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.departureAirportInfo?.code || flight.departureAirport}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.departureAirportInfo?.city}
                </div>
              </div>

              {/* Duration */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <Clock className="h-4 w-4" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 mt-1" data-testid={`flight-duration-${flight.id}`}>
                  {formatDuration(flight.duration)}
                </div>
                <div className="text-xs text-gray-400">Direct</div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900" data-testid={`flight-arrival-time-${flight.id}`}>
                  {formatTime(flight.arrivalTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.arrivalAirportInfo?.code || flight.arrivalAirport}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.arrivalAirportInfo?.city}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing and Action */}
          <div className="lg:w-48 space-y-3">
            {/* Economy Price */}
            <div className="text-center">
              <div className="text-xs text-gray-500">Economy from</div>
              <div className="text-2xl font-bold text-sunblue" data-testid={`flight-economy-price-${flight.id}`}>
                €{flight.economyPrice}
              </div>
              <div className="text-xs text-gray-500">
                {flight.economySeatsAvailable} seats left
              </div>
            </div>

            {/* Business Price */}
            {flight.businessPrice && (
              <div className="text-center">
                <div className="text-xs text-gray-500">Business from</div>
                <div className="text-lg font-semibold text-gray-700" data-testid={`flight-business-price-${flight.id}`}>
                  €{flight.businessPrice}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.businessSeatsAvailable} seats left
                </div>
              </div>
            )}

            {/* Select Button */}
            <Button
              onClick={onSelect}
              className="w-full bg-sunorange hover:bg-orange-600 text-white"
              data-testid={`flight-select-${flight.id}`}
            >
              Select Flight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
