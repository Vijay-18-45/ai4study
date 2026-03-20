import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className={`flex-1 min-h-screen ${isMobile ? "ml-0" : "ml-[260px]"}`}>
        {children}
      </main>
    </div>
  );
}
