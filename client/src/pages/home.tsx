import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, Heart, Luggage, Armchair, Utensils, Wifi } from "lucide-react";
import SearchForm from "@/components/flight-search/search-form";
import DestinationCard from "@/components/destinations/destination-card";
import { apiRequest } from "@/lib/queryClient";
import type { Destination } from "@shared/schema";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { t, href } = useI18n();

  const { data: destinations = [], isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", { popular: true }],
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sunorange opacity-10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white opacity-5 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t("hero_title")}
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              {t("hero_tagline_1")}
            </p>
            <p className="text-lg text-blue-200">
              {t("hero_tagline_2")}
            </p>
          </div>

          {/* Flight Search Form */}
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid w-fit grid-cols-3 mb-6 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="flights" className="data-[state=active]:bg-white data-[state=active]:text-sunblue" data-testid="flights-tab">
                  {t("tab_flights")}
                </TabsTrigger>
                <TabsTrigger value="hotels" className="data-[state=active]:bg-white data-[state=active]:text-sunblue" data-testid="hotels-tab">
                  {t("tab_hotels")}
                </TabsTrigger>
                <TabsTrigger value="packages" className="data-[state=active]:bg-white data-[state=active]:text-sunblue" data-testid="packages-tab">
                  {t("tab_packages")}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="flights">
                <SearchForm />
              </TabsContent>
              
              <TabsContent value="hotels">
                <Card className="search-form-shadow">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">Hotel Search Coming Soon</h3>
                      <p className="text-gray-600">We're working on bringing you the best hotel deals.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="packages">
                <Card className="search-form-shadow">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">Package Deals Coming Soon</h3>
                      <p className="text-gray-600">Complete vacation packages with flights and hotels.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12 bg-gradient-to-r from-sunorange to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{t("offers_title")}</h2>
            <p className="text-xl mb-6">{t("offers_subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[200px]">
                <div className="text-2xl font-bold">€89</div>
                <div className="text-sm">from Frankfurt</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[200px]">
                <div className="text-2xl font-bold">€125</div>
                <div className="text-sm">from London</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[200px]">
                <div className="text-2xl font-bold">€159</div>
                <div className="text-sm">from Paris</div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-sunorange hover:bg-gray-100"
              data-testid="view-offers-button"
            >
              {t("offers_view_all")}
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("popular_title")}</h2>
            <p className="text-lg text-gray-600">{t("popular_subtitle")}</p>
          </div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-6 rounded-b-lg">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={() => {
                    window.location.href = href(`/search?to=${encodeURIComponent(destination.city)}`);
                  }}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button 
              variant="default" 
              size="lg"
              className="bg-sunblue hover:bg-blue-700"
              data-testid="view-destinations-button"
            >
              {t("destinations_view_all")}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("why_title")}</h2>
            <p className="text-lg text-gray-600">{t("why_subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-sunblue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("feature_safety")}</h3>
              <p className="text-gray-600">Award-winning safety record with the latest aircraft technology and rigorous maintenance standards.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-sunorange rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("feature_otp")}</h3>
              <p className="text-gray-600">Reliable schedules with industry-leading punctuality rates to get you to your destination on time.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-sunblue rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("feature_service")}</h3>
              <p className="text-gray-600">{t("feature_service_desc")}</p>
            </div>
          </div>

          {/* Additional Services */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer" data-testid="service-baggage">
              <Luggage className="text-sunblue h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{t("service_baggage")}</h4>
              <p className="text-sm text-gray-600">{t("service_baggage_desc")}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer" data-testid="service-seats">
              <Armchair className="text-sunblue h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{t("service_seats")}</h4>
              <p className="text-sm text-gray-600">{t("service_seats_desc")}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer" data-testid="service-meals">
              <Utensils className="text-sunblue h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{t("service_meals")}</h4>
              <p className="text-sm text-gray-600">{t("service_meals_desc")}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer" data-testid="service-wifi">
              <Wifi className="text-sunblue h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{t("service_wifi")}</h4>
              <p className="text-sm text-gray-600">{t("service_wifi_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-sunblue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t("newsletter_title")}</h2>
          <p className="text-blue-100 mb-8 text-lg">{t("newsletter_subtitle")}</p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white"
              required
              data-testid="newsletter-email-input"
            />
            <Button
              type="submit"
              className="bg-sunorange hover:bg-orange-600 text-white font-bold"
              data-testid="newsletter-subscribe-button"
            >
              {t("newsletter_subscribe")}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
