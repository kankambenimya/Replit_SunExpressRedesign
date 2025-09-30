import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SearchResults from "@/pages/search-results";
import Booking from "@/pages/booking";
import Confirmation from "@/pages/confirmation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
// locale helpers are used by pages/components

function RedirectToDefault() {
  const [, setLocation] = useLocation();
  // redirect to /en while preserving search/hash
  const search = typeof window !== "undefined" ? (window.location.search + window.location.hash) : "";
  setLocation(`/en${search}`);
  return null;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          {/* default root -> redirect to /en */}
          <Route path="/" component={RedirectToDefault} />

          {/* localized routes */}
          <Route path="/:lang" component={Home} />
          <Route path="/:lang/search" component={SearchResults} />
          <Route path="/:lang/booking/:flightId">
            {(params) => <Booking flightId={params.flightId} />}
          </Route>
          <Route path="/:lang/confirmation/:bookingRef">
            {(params) => <Confirmation bookingRef={params.bookingRef} />}
          </Route>
          {/* catch-all, including unknown locale */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
