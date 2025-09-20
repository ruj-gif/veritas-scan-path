import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import ConsumerDashboard from "./pages/consumer/ConsumerDashboard";
import Scanner from "./pages/Scanner";
import KYC from "./pages/KYC";
import NotFound from "./pages/NotFound";

import "./lib/i18n";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Role-based Dashboard Component
function RoleDashboard() {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }
  
  switch (profile.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'consumer':
      return <ConsumerDashboard />;
    case 'distributor':
      // TODO: Implement distributor dashboard
      return <div className="p-6"><h1 className="text-2xl font-bold">Distributor Dashboard (Coming Soon)</h1></div>;
    default:
      return <Navigate to="/auth" replace />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<RoleDashboard />} />
              <Route path="kyc" element={<KYC />} />
              <Route path="supply-chain" element={<div className="p-6"><h1 className="text-2xl font-bold">Supply Chain (Coming Soon)</h1></div>} />
              <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports (Coming Soon)</h1></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>} />
            </Route>
            
            {/* Direct routes */}
            <Route path="/scanner" element={<Scanner />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;