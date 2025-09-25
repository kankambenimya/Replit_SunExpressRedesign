import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Users } from "lucide-react";

interface PassengerDropdownProps {
  adults: number;
  children: number;
  infants: number;
  seatClass: string;
  onPassengerChange: (type: "adults" | "children" | "infants", value: number) => void;
  onClassChange: (value: string) => void;
}

export default function PassengerDropdown({
  adults,
  children,
  infants,
  seatClass,
  onPassengerChange,
  onClassChange,
}: PassengerDropdownProps) {
  const [open, setOpen] = useState(false);

  const totalPassengers = adults + children + infants;
  const displayText = `${totalPassengers} ${totalPassengers === 1 ? "Passenger" : "Passengers"}, ${
    seatClass === "economy" ? "Economy" : "Business"
  }`;

  const adjustPassenger = (type: "adults" | "children" | "infants", increment: boolean) => {
    const current = type === "adults" ? adults : type === "children" ? children : infants;
    const newValue = increment ? current + 1 : Math.max(0, current - 1);
    
    // Adults minimum is 1
    if (type === "adults" && newValue < 1) return;
    // Maximum 9 passengers per type
    if (newValue > 9) return;
    
    onPassengerChange(type, newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left h-14 px-4"
          data-testid="passenger-selector-trigger"
        >
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span>{displayText}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start" data-testid="passenger-selector-dropdown">
        <div className="space-y-4">
          {/* Adults */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Adults</span>
              <p className="text-sm text-gray-500">12+ years</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => adjustPassenger("adults", false)}
                disabled={adults <= 1}
                data-testid="adults-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center" data-testid="adults-count">{adults}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => adjustPassenger("adults", true)}
                disabled={adults >= 9}
                data-testid="adults-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Children</span>
              <p className="text-sm text-gray-500">2-11 years</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => adjustPassenger("children", false)}
                disabled={children <= 0}
                data-testid="children-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center" data-testid="children-count">{children}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => adjustPassenger("children", true)}
                disabled={children >= 9}
                data-testid="children-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Infants</span>
              <p className="text-sm text-gray-500">0-2 years</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => adjustPassenger("infants", false)}
                disabled={infants <= 0}
                data-testid="infants-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center" data-testid="infants-count">{infants}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => adjustPassenger("infants", true)}
                disabled={infants >= 9}
                data-testid="infants-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">Cabin Class</label>
            <Select value={seatClass} onValueChange={onClassChange} data-testid="class-selector">
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
