
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import ProfileTalentHub from "./pages/Profile_talenthub";
import DashboardTalentHub from "./pages/Dashboard_talenthub";
import PositionsTalentHub from "./pages/Positions_talenthub";
import CandidatesTalentHub from "./pages/Candidates_talenthub";
import OrganizationTalentHub from "./pages/Organization_talenthub";
import CreatePositionTalentHub from "./pages/CreatePosition_talenthub";
import PublicProfile from "./pages/PublicProfile";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Milestones from "./pages/Milestones";
import Auth from "./pages/Auth";
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />

          {/* TalentHub Routes */}
          <Route path="/talenthub" element={<DashboardTalentHub />} />
          <Route path="/talenthub/profile" element={<ProfileTalentHub />} />
          <Route path="/talenthub/positions" element={<PositionsTalentHub />} />
          <Route path="/talenthub/candidates" element={<CandidatesTalentHub />} />
          <Route path="/talenthub/organization" element={<OrganizationTalentHub />} />
          <Route path="/talenthub/create-position" element={<CreatePositionTalentHub />} />

          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
