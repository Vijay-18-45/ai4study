import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  resetPassword,
} from "@/services/authService";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && user.emailVerified) return <Navigate to="/" replace />;
  if (user && !user.emailVerified && user.providerData[0]?.providerId !== "google.com") {
    return <Navigate to="/verify-email" replace />;
  }
  if (user && user.providerData[0]?.providerId === "google.com") return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) { toast.error("Please enter your name"); setIsLoading(false); return; }
        await signUpWithEmail(email, password, name);
        toast.success("Account created! Please verify your email.");
        navigate("/verify-email");
      } else {
        const u = await signInWithEmail(email, password);
        if (!u.emailVerified && u.providerData[0]?.providerId !== "google.com") {
          navigate("/verify-email");
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      }
    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use" ? "Email already registered"
        : err.code === "auth/invalid-credential" ? "Invalid email or password"
        : err.code === "auth/weak-password" ? "Password must be at least 6 characters"
        : err.code === "auth/invalid-email" ? "Invalid email address"
        : "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome!");
      navigate("/");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") toast.error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) { toast.error("Please enter your email"); return; }
    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail);
      toast.success("Password reset link sent. Please check your Gmail.");
      setShowForgot(false);
      setForgotEmail("");
    } catch {
      toast.error("Failed to send reset email. Check your email address.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,hsl(226,70%,15%),hsl(222,47%,6%))]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border/30 rounded-3xl p-8 shadow-[0_0_80px_-20px_hsl(226,70%,55%,0.15)]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg mb-4">
              <Sparkles className="h-6 w-6 text-primary-foreground" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Study<span className="text-primary">AI</span> Assistant
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignup ? "Create your account" : "Welcome back"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : isSignup ? "Create Account" : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Google */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 bg-background/50 border border-border/50 rounded-xl text-sm font-medium text-foreground hover:bg-accent/50 transition-all disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </motion.button>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignup(!isSignup); setName(""); }}
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgot(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-6 bg-card border border-border/30 rounded-2xl shadow-premium"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Reset Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your email and we'll send you a reset link.
              </p>
              <div className="relative mb-4">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgot(false)}
                  className="flex-1 h-10 rounded-xl border border-border/50 text-sm text-muted-foreground hover:bg-accent transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="flex-1 h-10 bg-gradient-primary text-primary-foreground font-medium rounded-xl text-sm disabled:opacity-50"
                >
                  {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Send Link"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
