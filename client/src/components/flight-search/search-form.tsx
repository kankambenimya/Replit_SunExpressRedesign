import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Check, ChevronsUpDown, Calendar as CalendarIcon, ArrowRightLeft, PlaneTakeoff, PlaneLanding, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { flightSearchSchema } from "@shared/schema";
import type { FlightSearchFormData } from "@/lib/types";
import { AIRPORTS } from "@/lib/constants";
import PassengerSelector from "./passenger-selector";
import { useQuery } from "@tanstack/react-query";

interface SearchFormProps {
  className?: string;
}

export default function SearchForm({ className }: SearchFormProps) {
  const [, setLocation] = useLocation();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [departureCalendarOpen, setDepartureCalendarOpen] = useState(false);
  const [returnCalendarOpen, setReturnCalendarOpen] = useState(false);

  const form = useForm<FlightSearchFormData>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      from: "Frankfurt",
      to: "Antalya",
      departureDate: format(new Date(2024, 11, 20), "yyyy-MM-dd"),
      returnDate: format(new Date(2024, 11, 27), "yyyy-MM-dd"),
      adults: 1,
      children: 0,
      infants: 0,
      seatClass: "economy",
      tripType: "roundtrip",
    },
  });

  const tripType = form.watch("tripType");

  const { data: airports = AIRPORTS } = useQuery<any[]>({
    queryKey: ["/api/airports"],
    select: (data) => data || AIRPORTS,
  });

  const onSubmit = (data: FlightSearchFormData) => {
    const searchParams = new URLSearchParams({
      from: data.from,
      to: data.to,
      departureDate: data.departureDate,
      ...(data.returnDate && tripType === "roundtrip" && { returnDate: data.returnDate }),
      adults: data.adults.toString(),
      children: data.children.toString(),
      infants: data.infants.toString(),
      seatClass: data.seatClass,
      tripType: data.tripType,
    });

    setLocation(`/search?${searchParams.toString()}`);
  };

  const swapAirports = () => {
    const fromValue = form.getValues("from");
    const toValue = form.getValues("to");
    form.setValue("from", toValue);
    form.setValue("to", fromValue);
  };

  return (
    <Card className={cn("search-form-shadow", className)}>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Trip Type */}
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-6"
                      data-testid="trip-type-selector"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="roundtrip" id="roundtrip" />
                        <Label htmlFor="roundtrip">Round trip</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oneway" id="oneway" />
                        <Label htmlFor="oneway">One way</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="multicity" id="multicity" />
                        <Label htmlFor="multicity">Multi-city</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* From */}
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From</FormLabel>
                    <Popover open={fromOpen} onOpenChange={setFromOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={fromOpen}
                            className="w-full justify-between h-14 px-4"
                            data-testid="from-selector"
                          >
                            <div className="flex items-center space-x-2">
                              <PlaneTakeoff className="h-5 w-5 text-gray-400" />
                              <span>{field.value || "Select departure"}</span>
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search airports..." />
                          <CommandList>
                            <CommandEmpty>No airport found.</CommandEmpty>
                            <CommandGroup>
                              {airports.map((airport) => (
                                <CommandItem
                                  key={airport.code}
                                  value={`${airport.city} ${airport.code} ${airport.name}`}
                                  onSelect={() => {
                                    field.onChange(airport.city);
                                    setFromOpen(false);
                                  }}
                                  data-testid={`from-option-${airport.code}`}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === airport.city ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <div className="font-medium">{airport.city} ({airport.code})</div>
                                    <div className="text-sm text-gray-500">{airport.name}</div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To */}
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>To</FormLabel>
                    <div className="relative">
                      <Popover open={toOpen} onOpenChange={setToOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={toOpen}
                              className="w-full justify-between h-14 px-4"
                              data-testid="to-selector"
                            >
                              <div className="flex items-center space-x-2">
                                <PlaneLanding className="h-5 w-5 text-gray-400" />
                                <span>{field.value || "Select destination"}</span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search airports..." />
                            <CommandList>
                              <CommandEmpty>No airport found.</CommandEmpty>
                              <CommandGroup>
                                {airports.map((airport) => (
                                  <CommandItem
                                    key={airport.code}
                                    value={`${airport.city} ${airport.code} ${airport.name}`}
                                    onSelect={() => {
                                      field.onChange(airport.city);
                                      setToOpen(false);
                                    }}
                                    data-testid={`to-option-${airport.code}`}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === airport.city ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div>
                                      <div className="font-medium">{airport.city} ({airport.code})</div>
                                      <div className="text-sm text-gray-500">{airport.name}</div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={swapAirports}
                        data-testid="swap-airports"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Departure Date */}
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure</FormLabel>
                    <Popover open={departureCalendarOpen} onOpenChange={setDepartureCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start h-14 px-4"
                            data-testid="departure-date-selector"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                            {field.value ? format(new Date(field.value), "MMM dd, yyyy") : "Select date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                              setDepartureCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Return Date */}
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return</FormLabel>
                    <Popover open={returnCalendarOpen} onOpenChange={setReturnCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start h-14 px-4"
                            disabled={tripType === "oneway"}
                            data-testid="return-date-selector"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                            {field.value && tripType !== "oneway" 
                              ? format(new Date(field.value), "MMM dd, yyyy") 
                              : tripType === "oneway" 
                                ? "One way" 
                                : "Select date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                              setReturnCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => {
                            const departureDate = form.getValues("departureDate");
                            return date < new Date(departureDate);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passengers */}
              <div className="flex flex-col space-y-2">
                <Label>Passengers</Label>
                <PassengerSelector
                  adults={form.watch("adults")}
                  children={form.watch("children")}
                  infants={form.watch("infants")}
                  seatClass={form.watch("seatClass")}
                  onPassengerChange={(type, value) => form.setValue(type, value)}
                  onClassChange={(value) => form.setValue("seatClass", value as "economy" | "business")}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                className="bg-sunorange hover:bg-orange-600 text-white font-bold py-4 px-12 text-lg h-auto"
                data-testid="search-flights-button"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Flights
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
