import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
