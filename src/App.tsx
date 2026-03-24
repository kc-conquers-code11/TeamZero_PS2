import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import FacilityDashboard from "./pages/FacilityDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { AccessibilityMenu } from "./components/AccessibilityMenu";

import { LanguageProvider } from "./components/LanguageProvider";

const queryClient = new QueryClient();

// Protected Route Component with role validation
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const userStr = localStorage.getItem('tb_user');
  
  // Check if user is logged in
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if user has the required role
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have permission, redirect to their own dashboard
      return <Navigate to={`/${user.role}`} replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    // Invalid user data, clear and redirect to login
    localStorage.removeItem('tb_user');
    return <Navigate to="/login" replace />;
  }
};

// Public route - accessible to everyone, but redirects logged-in users from login/signup
const PublicRoute = ({ children, redirectIfLoggedIn = false }: { children: React.ReactNode; redirectIfLoggedIn?: boolean }) => {
  const userStr = localStorage.getItem('tb_user');
  
  if (redirectIfLoggedIn && userStr) {
    try {
      const user = JSON.parse(userStr);
      return <Navigate to={`/${user.role}`} replace />;
    } catch (error) {
      localStorage.removeItem('tb_user');
    }
  }
  
  return <>{children}</>;
};

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
                {/* Landing Page - Always accessible to everyone */}
                <Route path="/" element={<Landing />} />
                
                {/* Index route - redirect to landing */}
                <Route path="/index" element={<Navigate to="/" replace />} />
                
                {/* Auth Pages - Accessible to everyone, but redirects logged-in users */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute redirectIfLoggedIn={true}>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute redirectIfLoggedIn={true}>
                      <SignUp />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected Routes with Strict Role-Based Access */}
                <Route 
                  path="/citizen" 
                  element={
                    <ProtectedRoute allowedRoles={['citizen']}>
                      <CitizenDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/collector" 
                  element={
                    <ProtectedRoute allowedRoles={['collector']}>
                      <CollectorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/facility" 
                  element={
                    <ProtectedRoute allowedRoles={['facility']}>
                      <FacilityDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/authority" 
                  element={
                    <ProtectedRoute allowedRoles={['authority']}>
                      <AuthorityDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Blockchain Explorer - Accessible to all logged-in users */}
                <Route 
                  path="/blockchain" 
                  element={
                    <ProtectedRoute allowedRoles={['citizen', 'collector', 'facility', 'authority']}>
                      <BlockchainExplorer />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route */}
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