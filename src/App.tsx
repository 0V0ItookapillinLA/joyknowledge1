import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CaseDetail from "./pages/CaseDetail";
import ExpertLibrary from "./pages/ExpertLibrary";
import PersonalZone from "./pages/PersonalZone";
import KnowledgeExtract from "./pages/KnowledgeExtract";
import KnowledgeList from "./pages/KnowledgeList";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import DepartmentSpace from "./pages/DepartmentSpace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/case/:id" element={<CaseDetail />} />
          <Route path="/experts" element={<ExpertLibrary />} />
          <Route path="/profile" element={<PersonalZone />} />
          <Route path="/extract" element={<KnowledgeExtract />} />
          <Route path="/knowledge" element={<KnowledgeList />} />
          <Route path="/community" element={<Community />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
