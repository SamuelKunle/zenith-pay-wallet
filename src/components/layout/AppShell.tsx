import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import WebSidebar from "./WebSidebar";
import { useSidebarState } from "@/contexts/SidebarContext";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const { collapsed } = useSidebarState();

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <WebSidebar />
      <main className={`flex-1 pb-[72px] lg:pb-0 transition-all duration-250 ease-premium ${collapsed ? "lg:ml-[64px]" : "lg:ml-[252px]"}`}>
        <div className="mx-auto max-w-2xl lg:max-w-5xl">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default AppShell;
