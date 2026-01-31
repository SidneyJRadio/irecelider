import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RadioPlayerProvider } from "@/contexts/RadioPlayerContext";
import { AudioPlayer } from "@/components/radio/AudioPlayer";
import { GlobalMiniPlayer } from "@/components/radio/GlobalMiniPlayer";
import Index from "./pages/Index";
import Noticias from "./pages/Noticias";
import NoticiaDetalhe from "./pages/NoticiaDetalhe";
import Comunicadores from "./pages/Comunicadores";
import Radios from "./pages/Radios";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import NewsAdmin from "./pages/admin/NewsAdmin";
import NewsForm from "./pages/admin/NewsForm";
import CommunicatorsAdmin from "./pages/admin/CommunicatorsAdmin";
import RadiosAdmin from "./pages/admin/RadiosAdmin";
import RegionsAdmin from "./pages/admin/RegionsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import BannersAdmin from "./pages/admin/BannersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";

const queryClient = new QueryClient();

// Component to conditionally render mini player (hide on admin pages)
function MiniPlayerWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  
  if (isAdminPage) return null;
  return <GlobalMiniPlayer />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RadioPlayerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AudioPlayer />
          <BrowserRouter>
            <MiniPlayerWrapper />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/noticias/:slug" element={<NoticiaDetalhe />} />
              <Route path="/radios" element={<Radios />} />
              <Route path="/comunicadores" element={<Comunicadores />} />
              <Route path="/contato" element={<Contato />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/noticias" element={<NewsAdmin />} />
              <Route path="/admin/noticias/nova" element={<NewsForm />} />
              <Route path="/admin/noticias/:id" element={<NewsForm />} />
              <Route path="/admin/comunicadores" element={<CommunicatorsAdmin />} />
              <Route path="/admin/radios" element={<RadiosAdmin />} />
              <Route path="/admin/banners" element={<BannersAdmin />} />
              <Route path="/admin/regioes" element={<RegionsAdmin />} />
              <Route path="/admin/usuarios" element={<UsersAdmin />} />
              <Route path="/admin/configuracoes" element={<SettingsAdmin />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RadioPlayerProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
