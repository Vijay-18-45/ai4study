import { Upload, MessageSquare } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const navItems = [
  { title: "Upload Documents", url: "/", icon: Upload },
  { title: "Ask AI", url: "/ask", icon: MessageSquare },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-secondary border-r border-border/50 flex flex-col p-4 scrollbar-none overflow-y-auto z-30">
      <div className="px-3 py-4 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Study<span className="text-primary">AI</span>
        </h1>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-card shadow-soft text-primary"
                  : "text-muted-foreground hover:bg-foreground/5"
              }`}
              activeClassName=""
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-3">
        <div className="text-xs text-muted-foreground">
          Your library, now with a voice.
        </div>
      </div>
    </aside>
  );
}
