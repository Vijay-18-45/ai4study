import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { resendVerificationEmail, logout } from "@/services/authService";
import { auth } from "@/lib/firebase";

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.emailVerified) return <Navigate to="/" replace />;

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail(user);
      toast.success("Verification email sent!");
    } catch {
      toast.error("Failed to resend. Please wait a moment and try again.");
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerified = async () => {
    setChecking(true);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        toast.success("Email verified! Redirecting...");
        navigate("/");
        // Force re-render by reloading
        window.location.reload();
      } else {
        toast.error("Email not yet verified. Please check your inbox.");
      }
    } catch {
      toast.error("Failed to check status.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,hsl(226,70%,15%),hsl(222,47%,6%))]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border/30 rounded-3xl p-8 shadow-[0_0_80px_-20px_hsl(226,70%,55%,0.15)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Verify your email</h1>
          <p className="text-sm text-muted-foreground mb-2">
            We've sent a verification link to:
          </p>
          <p className="text-sm font-medium text-foreground mb-8">{user.email}</p>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckVerified}
              disabled={checking}
              className="w-full h-12 bg-gradient-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {checking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  I have verified
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleResend}
              disabled={resending}
              className="w-full h-12 bg-background/50 border border-border/50 rounded-xl text-sm font-medium text-foreground hover:bg-accent/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {resending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </motion.button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in with a different account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
