import { Upload, MessageSquare, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { title: "Upload Documents", url: "/", icon: Upload },
  { title: "Ask AI", url: "/ask", icon: MessageSquare },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-card/80 backdrop-blur-xl border-r border-border/40 flex flex-col py-6 px-4 scrollbar-none overflow-y-auto z-30">
      {/* Logo */}
      <div className="px-3 mb-10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
          <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Study<span className="text-primary">AI</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`relative flex items-center gap-3 h-11 px-3.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              activeClassName=""
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className="h-[18px] w-[18px] relative z-10" strokeWidth={1.8} />
              <span className="relative z-10">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 px-3">
        <div className="p-3.5 rounded-xl bg-accent/60 border border-border/30">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your library, now with a voice.
          </p>
        </div>
      </div>
    </aside>
  );
}
