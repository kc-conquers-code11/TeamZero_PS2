import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import FacilityDashboard from "./pages/FacilityDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import NotFound from "./pages/NotFound";

import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { AccessibilityMenu } from "./components/AccessibilityMenu";

import { LanguageProvider } from "./components/LanguageProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/citizen" element={<CitizenDashboard />} />
                <Route path="/collector" element={<CollectorDashboard />} />
                <Route path="/facility" element={<FacilityDashboard />} />
                <Route path="/authority" element={<AuthorityDashboard />} />
                <Route path="/blockchain" element={<BlockchainExplorer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
          <AccessibilityMenu />
        </TooltipProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
