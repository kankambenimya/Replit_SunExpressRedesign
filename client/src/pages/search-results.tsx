import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, SortAsc, Calendar, Users, MapPin } from "lucide-react";
import FlightCard from "@/components/flights/flight-card";
import type { FlightWithAirports } from "@/lib/types";
import { format } from "date-fns";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("price");
  const [filterByTime, setFilterByTime] = useState("all");

  // Get search parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchParams = {
    from: urlParams.get("from") || "",
    to: urlParams.get("to") || "",
    departureDate: urlParams.get("departureDate") || "",
    returnDate: urlParams.get("returnDate") || "",
    adults: parseInt(urlParams.get("adults") || "1"),
    children: parseInt(urlParams.get("children") || "0"),
    infants: parseInt(urlParams.get("infants") || "0"),
    seatClass: urlParams.get("seatClass") || "economy",
    tripType: urlParams.get("tripType") || "roundtrip",
  };

  const { data: flights = [], isLoading, error } = useQuery<FlightWithAirports[]>({
    queryKey: ["/api/flights/search", searchParams],
    enabled: !!(searchParams.from && searchParams.to && searchParams.departureDate),
  });

  // Filter and sort flights
  const filteredAndSortedFlights = useMemo(() => {
    let filtered = [...flights];

    // Filter by time
    if (filterByTime === "morning") {
      filtered = filtered.filter(flight => {
        const hour = new Date(flight.departureTime).getHours();
        return hour >= 6 && hour < 12;
      });
    } else if (filterByTime === "afternoon") {
      filtered = filtered.filter(flight => {
        const hour = new Date(flight.departureTime).getHours();
        return hour >= 12 && hour < 18;
      });
    } else if (filterByTime === "evening") {
      filtered = filtered.filter(flight => {
        const hour = new Date(flight.departureTime).getHours();
        return hour >= 18 || hour < 6;
      });
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseFloat(a.economyPrice) - parseFloat(b.economyPrice);
        case "duration":
          return a.duration - b.duration;
        case "departure":
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        case "arrival":
          return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, sortBy, filterByTime]);

  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;

  const handleFlightSelect = (flightId: string) => {
    setLocation(`/booking/${flightId}?${urlParams.toString()}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Search Error</h2>
              <p className="text-gray-600">We couldn't find flights for your search criteria. Please try again with different parameters.</p>
              <Button 
                onClick={() => setLocation("/")}
                className="mt-4"
                data-testid="back-to-search-button"
              >
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{searchParams.from} → {searchParams.to}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>{format(new Date(searchParams.departureDate), "MMM dd, yyyy")}</span>
                  {searchParams.returnDate && searchParams.tripType === "roundtrip" && (
                    <>
                      <span>-</span>
                      <span>{format(new Date(searchParams.returnDate), "MMM dd, yyyy")}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>{totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}</span>
                </div>
                <Badge variant="secondary">{searchParams.seatClass}</Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                data-testid="modify-search-button"
              >
                Modify Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Departure Time</label>
                  <Select value={filterByTime} onValueChange={setFilterByTime} data-testid="time-filter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Times</SelectItem>
                      <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                      <SelectItem value="evening">Evening (6PM - 6AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy} data-testid="sort-selector">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price (Low to High)</SelectItem>
                      <SelectItem value="duration">Duration (Shortest)</SelectItem>
                      <SelectItem value="departure">Departure Time</SelectItem>
                      <SelectItem value="arrival">Arrival Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Flight Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Flights:</span>
                    <span className="font-medium" data-testid="total-flights-count">{filteredAndSortedFlights.length}</span>
                  </div>
                  {filteredAndSortedFlights.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">From:</span>
                        <span className="font-medium">€{Math.min(...filteredAndSortedFlights.map(f => parseFloat(f.economyPrice)))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="font-medium">
                          €{Math.round(filteredAndSortedFlights.reduce((sum, f) => sum + parseFloat(f.economyPrice), 0) / filteredAndSortedFlights.length)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="outbound" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="outbound" data-testid="outbound-tab">
                  Outbound Flights
                </TabsTrigger>
                {searchParams.tripType === "roundtrip" && (
                  <TabsTrigger value="return" data-testid="return-tab">
                    Return Flights
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="outbound" className="space-y-4">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredAndSortedFlights.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-xl font-semibold mb-2">No Flights Found</h3>
                      <p className="text-gray-600 mb-4">
                        We couldn't find any flights matching your criteria. Try adjusting your filters or search parameters.
                      </p>
                      <Button 
                        onClick={() => setLocation("/")}
                        data-testid="new-search-button"
                      >
                        Start New Search
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAndSortedFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={() => handleFlightSelect(flight.id)}
                    />
                  ))
                )}
              </TabsContent>

              {searchParams.tripType === "roundtrip" && (
                <TabsContent value="return" className="space-y-4">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-xl font-semibold mb-2">Return Flight Selection</h3>
                      <p className="text-gray-600">
                        Return flights will be available after you select your outbound flight.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
