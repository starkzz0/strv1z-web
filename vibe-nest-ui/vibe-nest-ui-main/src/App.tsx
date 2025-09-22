import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import Feed from "./pages/Feed";
import Communities from "./pages/Communities";
import Mood from "./pages/Mood";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Therapists from "./pages/Therapists";
import Friends from "./pages/Friends";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Feed />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/communities" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Communities />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/mood" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Mood />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/resources" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Resources />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Profile />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Settings />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <AdminDashboard />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/therapists" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Therapists />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/friends" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Friends />
                      <BottomNav />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
