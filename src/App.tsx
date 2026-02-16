import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import TripDetail from "./pages/TripDetail";
import PublishTrip from "./pages/PublishTrip";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/publish" element={<PublishTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
