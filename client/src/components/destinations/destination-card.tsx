import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
}

export default function DestinationCard({ destination, onClick }: DestinationCardProps) {
  return (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      data-testid={`destination-card-${destination.id}`}
    >
      <div className="relative">
        <img
          src={destination.imageUrl}
          alt={`${destination.name} - ${destination.description}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-sunorange text-white px-3 py-1 rounded-full text-sm font-semibold">
          From €{destination.startingPrice}
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid={`destination-name-${destination.id}`}>
          {destination.name}
        </h3>
        <p className="text-gray-600 mb-4" data-testid={`destination-description-${destination.id}`}>
          {destination.description}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          <span data-testid={`destination-flight-time-${destination.id}`}>{destination.flightTime} flight</span>
        </div>
      </CardContent>
    </Card>
  );
}
