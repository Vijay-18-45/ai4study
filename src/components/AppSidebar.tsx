import { Upload, MessageSquare, Sparkles, Moon, Sun, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useCallback, useRef } from "react";

const navItems = [
  { title: "Upload Documents", url: "/", icon: Upload },
  { title: "Ask AI", url: "/ask", icon: MessageSquare },
];

const SIDEBAR_KEY = "studyai-sidebar-open";

export function AppSidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(() => {
    if (typeof window !== "undefined" && !isMobile) {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      return stored !== "false";
    }
    return false;
  });

  // Persist sidebar state (desktop only)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(SIDEBAR_KEY, String(mobileOpen));
    }
  }, [mobileOpen, isMobile]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  // Swipe-to-open gesture on mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      
      // Swipe right from left edge to open
      if (!mobileOpen && touchStartX.current < 30 && deltaX > 60 && deltaY < 80) {
        setMobileOpen(true);
      }
      // Swipe left to close
      if (mobileOpen && deltaX < -60 && deltaY < 80) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-3 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
            <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Study<span className="text-primary">AI</span>
          </h1>
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
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
              onClick={() => isMobile && setMobileOpen(false)}
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
      <div className="mt-auto pt-6 px-3 space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 h-10 px-3.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? (
                <Sun className="h-[18px] w-[18px]" strokeWidth={1.8} />
              ) : (
                <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              )}
            </motion.span>
          </AnimatePresence>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <div className="p-3.5 rounded-xl bg-accent/60 border border-border/30">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your library, now with a voice.
          </p>
        </div>
      </div>
    </>
  );

  // Mobile: hamburger + overlay drawer
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card shadow-card border border-border/40"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                drag="x"
                dragConstraints={{ left: -280, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) setMobileOpen(false);
                }}
                className="fixed left-0 top-0 bottom-0 w-[260px] bg-card/95 backdrop-blur-xl border-r border-border/40 flex flex-col py-6 px-4 z-50"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-card/80 backdrop-blur-xl border-r border-border/40 flex flex-col py-6 px-4 scrollbar-none overflow-y-auto z-30">
      {sidebarContent}
    </aside>
  );
}
