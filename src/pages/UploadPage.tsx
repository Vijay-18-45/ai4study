import { useState, useCallback } from "react";
import { Upload, FileText, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const TAGS = ["PYQ", "Notes", "Important Questions", "Syllabus"];
const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

interface RecentUpload {
  name: string;
  subject: string;
  time: string;
  status: "Processing" | "Ready";
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [regulation, setRegulation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<RecentUpload[]>([
    { name: "DBMS Unit 3 Notes.pdf", subject: "Database Systems", time: "2 hours ago", status: "Ready" },
    { name: "OS PYQ 2023.pdf", subject: "Operating Systems", time: "5 hours ago", status: "Ready" },
    { name: "CN Important Questions.docx", subject: "Computer Networks", time: "1 day ago", status: "Processing" },
  ]);

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

      setUploads((prev) => [
        { name: file.name, subject: subject || "General", time: "Just now", status: "Processing" },
        ...prev,
      ]);
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
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Upload Your Study Materials
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
          Add notes, PYQs, and academic documents to make them searchable with AI.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Upload Card */}
        <div
          onClick={handleFileSelect}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`bg-card rounded-3xl p-12 shadow-premium border-2 border-dashed cursor-pointer transition-colors duration-200 ${
            isDragging
              ? "border-primary bg-primary/5"
              : file
              ? "border-success/40"
              : "border-border hover:border-primary/40"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            {file ? (
              <>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-success" strokeWidth={1.5} />
                </div>
                <p className="text-foreground font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">Click to change file</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground/60" strokeWidth={1.5} />
                <p className="text-foreground font-medium text-lg">
                  Drag & drop your documents here
                </p>
                <p className="text-muted-foreground">or click to browse files</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </>
            )}
          </div>
        </div>

        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <input
            type="text"
            placeholder="Subject Name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-12 px-4 rounded-xl bg-secondary border-none ring-soft text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="h-12 px-4 rounded-xl bg-secondary border-none ring-soft text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
          >
            <option value="" className="text-muted-foreground">Semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Regulation (e.g., R2021)"
            value={regulation}
            onChange={(e) => setRegulation(e.target.value)}
            className="h-12 px-4 rounded-xl bg-secondary border-none ring-soft text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <div className="flex flex-wrap gap-2 items-center h-12">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary ring-soft text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="bg-gradient-primary text-primary-foreground font-semibold py-4 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing document and preparing AI responses...
              </span>
            ) : (
              "Upload & Train AI"
            )}
          </button>

          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-md"
              >
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 2.2, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Recent Uploads */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-16"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h2>
        <div className="space-y-2">
          {uploads.map((upload, i) => (
            <div
              key={`${upload.name}-${i}`}
              className="bg-card shadow-soft rounded-xl py-4 px-6 flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="font-medium text-foreground">{upload.name}</span>
              </div>
              <span className="text-muted-foreground hidden sm:block">{upload.subject}</span>
              <span className="text-muted-foreground hidden md:block font-mono text-xs">{upload.time}</span>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  upload.status === "Ready"
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {upload.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
