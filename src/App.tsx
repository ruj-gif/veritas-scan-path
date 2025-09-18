import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import KYC from "./pages/KYC";
import NotFound from "./pages/NotFound";

import "./lib/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login Page - No sidebar/header */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Dashboard Routes - With sidebar/header */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="supply-chain" element={<div className="p-6"><h1 className="text-2xl font-bold">Supply Chain (Coming Soon)</h1></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports (Coming Soon)</h1></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>} />
          </Route>
          
          {/* Direct routes without dashboard layout */}
          <Route path="/scanner" element={<Scanner />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;