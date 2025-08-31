import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/templates/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DepositsPage from "./pages/DepositsPage";
import WalletContextProvider from "./contexts/WalletContext";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Users from "./pages/Users";
import { AllContext } from "./contexts/composition";
import WithdrawReceipt from "./pages/WithdrawReceipt";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AllContext>
        <WalletContextProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/deposits"
              element={
                <ProtectedRoute restricted>
                  <DashboardLayout>
                    <DepositsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/deposits"
              element={
                <ProtectedRoute restricted>
                  <DashboardLayout>
                    <DepositsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/withdraws/:id"
              element={
                <ProtectedRoute restricted>
                  <DashboardLayout>
                    <WithdrawReceipt />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute restricted>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute restricted>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WalletContextProvider>
      </AllContext>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
