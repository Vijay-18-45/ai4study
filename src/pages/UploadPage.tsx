import { useState, useCallback } from "react";
import { Upload, FileText, Check, Loader2, X, CloudUpload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const TAGS = ["PYQ", "Notes", "Important Questions", "Syllabus"];
const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

interface UploadNotification {
  id: number;
  name: string;
  tags: string[];
  status: "Processing" | "Ready";
}

let notifId = 0;

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [regulation, setRegulation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState<UploadNotification[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.txt";
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) setFile(f);
    };
    input.click();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const reader = new FileReader();
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const payload = {
        type: "upload",
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileBase64,
        subject: subject || "General",
        semester,
        regulation,
        tags: selectedTags,
      };

      const response = await fetch(
        "https://awaara.app.n8n.cloud/webhook/3968e79c-0056-4c7d-a2fd-9ce8e1251bc2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Webhook failed");

      const currentId = ++notifId;
      setNotifications((prev) => [
        { id: currentId, name: file.name, tags: [...selectedTags], status: "Processing" },
        ...prev,
      ]);

      // Auto-mark as ready after 3s
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === currentId ? { ...n, status: "Ready" } : n))
        );
      }, 3000);

      // Auto-dismiss after 8s
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== currentId));
      }, 8000);

      setFile(null);
      setSubject("");
      setSemester("");
      setRegulation("");
      setSelectedTags([]);
      toast.success("Document successfully added. You can now ask questions from it.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 pt-14 md:pt-16 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-12 max-w-lg"
      >
        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
          Upload Study Materials
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Organize notes, PYQs, and academic resources to make them searchable with AI.
        </p>
      </motion.div>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="w-full max-w-2xl"
      >
        <div
          onClick={handleFileSelect}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`group relative bg-card rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragging
              ? "border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] scale-[1.01]"
              : file
              ? "border-success/50 shadow-soft"
              : "border-border/60 hover:border-primary/40 hover:shadow-card hover:scale-[1.005]"
          }`}
        >
          <div className="flex flex-col items-center gap-4 py-16 px-8">
            {file ? (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center"
                >
                  <Check className="h-7 w-7 text-success" strokeWidth={1.8} />
                </motion.div>
                <div className="text-center">
                  <p className="text-foreground font-semibold text-[15px]">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(0)} KB · Click to change file
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <CloudUpload className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-semibold text-[15px]">
                    Drag & drop your study documents
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    or click to browse files
                  </p>
                </div>
                <p className="text-xs text-muted-foreground/50 mt-1 tracking-wide">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </>
            )}
          </div>
        </div>

        {/* Metadata Form */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder=" "
                className="peer w-full h-13 px-4 pt-5 pb-2 rounded-xl bg-card border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder-transparent"
              />
              <label className="absolute left-4 top-2 text-[11px] font-medium text-muted-foreground/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
                Subject Name
              </label>
            </div>
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full h-13 px-4 pt-5 pb-2 rounded-xl bg-card border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-[11px] font-medium text-muted-foreground/70 pointer-events-none">
                Semester
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
              placeholder=" "
              className="peer w-full h-13 px-4 pt-5 pb-2 rounded-xl bg-card border border-border/60 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder-transparent"
            />
            <label className="absolute left-4 top-2 text-[11px] font-medium text-muted-foreground/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/50 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none">
              Regulation (e.g., R2021)
            </label>
          </div>

          {/* Tags */}
          <div>
            <p className="text-[11px] font-medium text-muted-foreground/70 mb-2.5 ml-1">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                      active
                        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-md"
                        : "bg-card border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full sm:w-auto bg-gradient-primary text-primary-foreground font-semibold py-3.5 px-10 rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-sm"
          >
            {isUploading ? (
              <span className="flex items-center gap-2.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing document...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" strokeWidth={2} />
                Upload & Train AI
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-sm"
              >
                <div className="h-1 w-full bg-accent rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Upload Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-card rounded-xl shadow-premium border border-border/40 p-4 flex items-start gap-3"
            >
              <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                notif.status === "Ready" ? "bg-success/10" : "bg-primary/10"
              }`}>
                {notif.status === "Ready" ? (
                  <Check className="h-4 w-4 text-success" strokeWidth={2} />
                ) : (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{notif.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {notif.tags.length > 0 && (
                    <span className="text-[10px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                      {notif.tags[0]}
                    </span>
                  )}
                  <span className={`text-[10px] font-medium ${
                    notif.status === "Ready" ? "text-success" : "text-primary"
                  }`}>
                    {notif.status === "Ready" ? "Ready" : "Processing..."}
                  </span>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
