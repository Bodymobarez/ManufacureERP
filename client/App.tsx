import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PLM from "./pages/PLM";
import Inventory from "./pages/Inventory";
import Production from "./pages/Production";
import IoT from "./pages/IoT";
import Quality from "./pages/Quality";
import HRM from "./pages/HRM";
import Accounting from "./pages/Accounting";
import Procurement from "./pages/Procurement";
import SCM from "./pages/SCM";
import Sales from "./pages/Sales";
import MRP from "./pages/MRP";
import CMMS from "./pages/CMMS";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plm" element={<PLM />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/production" element={<Production />} />
            <Route path="/iot" element={<IoT />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/hrm" element={<HRM />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/scm" element={<SCM />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/mrp" element={<MRP />} />
            <Route path="/cmms" element={<CMMS />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
