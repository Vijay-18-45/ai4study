import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isGoogleOnly = user?.providerData[0]?.providerId === "google.com";

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.code === "auth/wrong-password" || err.code === "auth/invalid-credential"
        ? "Current password is incorrect"
        : "Failed to update password. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 pt-14 md:pt-16 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 max-w-lg"
      >
        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground text-base">Manage your account security</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="w-full max-w-md"
      >
        {/* User Info */}
        <div className="bg-card rounded-2xl border border-border/40 p-6 mb-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.displayName || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
          </div>

          {isGoogleOnly ? (
            <p className="text-sm text-muted-foreground">
              Your account uses Google sign-in. Password management is handled by Google.
            </p>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  required
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-50 text-sm"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Update Password"}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
