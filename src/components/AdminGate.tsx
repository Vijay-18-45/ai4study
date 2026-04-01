import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface AdminGateProps {
  onAuthenticated: () => void;
}

const ADMIN_USER = "srkr";
const ADMIN_PASS = "srkr";

export default function AdminGate({ onAuthenticated }: AdminGateProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem("admin_authenticated", "true");
        toast.success("Admin access granted");
        onAuthenticated();
      } else {
        toast.error("Invalid admin credentials");
      }
      setLoading(false);
    }, 600);
  };

  const inputClasses =
    "w-full h-[52px] px-4 rounded-[var(--radius)] bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-[var(--radius)] border border-border shadow-premium p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Admin Access Required</h2>
            <p className="text-sm text-muted-foreground mt-1.5 text-center">
              Enter admin credentials to access document uploads
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block ml-1">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={inputClasses}
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!username || !password || loading}
              className="w-full min-h-[52px] bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-[var(--radius)] shadow-lg hover:shadow-[0_8px_24px_-4px_hsl(226,70%,55%,0.35)] hover:brightness-110 active:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[15px] mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Authenticate"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
