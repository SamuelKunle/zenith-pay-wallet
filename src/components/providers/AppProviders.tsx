import { type ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FavouritesProvider } from "@/contexts/FavouritesContext";
import { SidebarStateProvider } from "@/contexts/SidebarContext";
import { createAppQueryClient } from "@/lib/query-client";
import { STORAGE_KEYS } from "@/lib/constants/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionTelemetrySync } from "@/components/telemetry/SessionTelemetrySync";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey={STORAGE_KEYS.theme}>
        <AuthProvider>
          <SessionTelemetrySync />
          <FavouritesProvider>
            <SidebarStateProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
              </TooltipProvider>
            </SidebarStateProvider>
          </FavouritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
