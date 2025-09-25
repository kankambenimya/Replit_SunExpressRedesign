import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard, Lock, Shield } from "lucide-react";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function PaymentForm({ form, onSubmit, isLoading }: PaymentFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card Number */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number *</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="text-lg"
                  data-testid="card-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                  <Input
                    placeholder="MM/YY"
                    data-testid="card-expiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV *</label>
                  <Input
                    placeholder="123"
                    maxLength={4}
                    data-testid="card-cvv"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                <Input
                  placeholder="Name as it appears on card"
                  data-testid="cardholder-name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Country *</label>
                <Select data-testid="billing-country">
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="TR">Turkey</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Postal Code *</label>
                <Input
                  placeholder="Enter postal code"
                  data-testid="billing-postal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address *</label>
              <Input
                placeholder="Enter your address"
                data-testid="billing-address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <Input
                  placeholder="Enter city"
                  data-testid="billing-city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State/Province</label>
                <Input
                  placeholder="Enter state/province"
                  data-testid="billing-state"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Secure Payment</h4>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure. We never store your credit card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-6">
            <Button
              type="submit"
              className="w-full bg-sunorange hover:bg-orange-600 text-white font-bold py-4 text-lg"
              disabled={isLoading}
              data-testid="complete-booking"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Complete Booking
                </>
              )}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-3">
              By completing this booking, you agree to our terms and conditions
            </p>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
