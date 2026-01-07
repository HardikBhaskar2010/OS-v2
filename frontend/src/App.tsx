import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SpaceProvider } from "./contexts/SpaceContext";
import { CoupleProvider } from "./contexts/CoupleContext";
import ErrorBoundary from "./components/ErrorBoundary";
import SpaceSelection from "./pages/SpaceSelection";
import CookieDashboard from "./pages/CookieDashboard";
import SenoritaDashboard from "./pages/SenoritaDashboard";
import NotFound from "./pages/NotFound";
import Letters from "./pages/Letters";
import Gallery from "./pages/Gallery";
import Questions from "./pages/Questions";
import MoodEnhanced from "./pages/MoodEnhanced";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SpaceProvider>
              <CoupleProvider>
                <Routes>
                  <Route path="/" element={<SpaceSelection />} />
                  <Route path="/cookie" element={<CookieDashboard />} />
                  <Route path="/senorita" element={<SenoritaDashboard />} />
                  <Route path="/letters" element={<Letters />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/questions" element={<Questions />} />
                  <Route path="/mood" element={<MoodEnhanced />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CoupleProvider>
            </SpaceProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;