import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavouritesProvider } from "@/contexts/FavouritesContext";
import { SidebarStateProvider } from "@/contexts/SidebarContext";
import AppShell from "@/components/layout/AppShell";
import Index from "./pages/Index";
import TransferPage from "./pages/TransferPage";
import ScanPage from "./pages/ScanPage";
import MerchantPage from "./pages/MerchantPage";
import MerchantQrPage from "./pages/MerchantQrPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import WelcomePage from "./pages/WelcomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import KycPage from "./pages/KycPage";
import PinSetupPage from "./pages/PinSetupPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import SecurityPage from "./pages/SecurityPage";
import CardsPage from "./pages/CardsPage";
import SavingsPage from "./pages/SavingsPage";
import SupportPage from "./pages/SupportPage";
import RewardsPage from "./pages/RewardsPage";
import InsightsPage from "./pages/InsightsPage";
import LandingPage from "./pages/LandingPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import FundWalletPage from "./pages/FundWalletPage";
import ScheduledPaymentsPage from "./pages/ScheduledPaymentsPage";
import RequestMoneyPage from "./pages/RequestMoneyPage";
import DisputesPage from "./pages/DisputesPage";
import SessionsPage from "./pages/SessionsPage";
import NotificationPreferencesPage from "./pages/NotificationPreferencesPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.title = "Zenith Pay";
    const faviconSvg = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0f766e"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="white">ZP</text></svg>',
    );
    const href = `data:image/svg+xml,${faviconSvg}`;
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.type = "image/svg+xml";
    favicon.href = href;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="zenith-pay-theme">
      <FavouritesProvider>
      <SidebarStateProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Full-screen experiences (no shell) */}
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/pin-setup" element={<PinSetupPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* App shell routes */}
            <Route
              path="*"
              element={
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/transfer" element={<TransferPage />} />
                    <Route path="/transfer/bank" element={<TransferPage />} />
                    <Route path="/merchant" element={<MerchantPage />} />
                    <Route path="/merchant/qr" element={<MerchantQrPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/history" element={<TransactionHistoryPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/cards" element={<CardsPage />} />
                    <Route path="/savings" element={<SavingsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                    <Route path="/fund-wallet" element={<FundWalletPage />} />
                    <Route path="/scheduled-payments" element={<ScheduledPaymentsPage />} />
                    <Route path="/request-money" element={<RequestMoneyPage />} />
                    <Route path="/disputes" element={<DisputesPage />} />
                    <Route path="/sessions" element={<SessionsPage />} />
                    <Route path="/notification-preferences" element={<NotificationPreferencesPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<TermsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppShell>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </SidebarStateProvider>
      </FavouritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
