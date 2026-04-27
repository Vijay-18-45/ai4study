import { useState, useRef, useEffect } from "react";
import { Send, Copy, RefreshCw, FileText, ChevronRight, ChevronDown, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Message {
  role: "user" | "ai";
  content: string;
}

const SUGGESTIONS = [
  "Important topics in DBMS",
  "Repeated PYQs",
  "Explain normalization",
  "Quick revision for OS",
];

function StreamingText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
        onComplete();
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, 8);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed.split(/(\*\*.*?\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
      {!done && (
        <span className="inline-block w-[2px] h-[14px] bg-primary ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}

function SourceCard({ source, onClick }: { source: { name: string; subject: string; tag: string; snippet: string; confidence: number }; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className="flex-shrink-0 w-[220px] bg-card rounded-[var(--radius)] border border-border p-4 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-card group min-h-[44px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
          <FileText className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
          {source.tag}
        </span>
      </div>
      <p className="text-xs font-medium text-foreground truncate mb-1">{source.name}</p>
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{source.snippet}</p>
      <div className="mt-2 flex items-center gap-1">
        <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary/40 rounded-full" style={{ width: `${source.confidence}%` }} />
        </div>
        <span className="text-[9px] text-muted-foreground/60 font-medium">{source.confidence}%</span>
      </div>
    </motion.button>
  );
}

function SourcePreviewPanel({ source, onClose }: { source: { name: string; subject: string; tag: string; snippet: string; confidence: number } | null; onClose: () => void }) {
  if (!source) return null;

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 bottom-0 w-[85vw] sm:w-[340px] bg-card/95 backdrop-blur-xl border-l border-border/40 z-40 flex flex-col shadow-premium"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{source.name}</p>
            <span className="text-[10px] text-muted-foreground">{source.subject}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
        <div className="bg-accent/60 rounded-[var(--radius)] p-4 border border-border/30">
          <p className="text-[11px] font-medium text-primary mb-2">Relevant Excerpt</p>
          <p className="text-sm text-foreground leading-[1.7]">{source.snippet}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-accent">{source.tag}</span>
          <span>·</span>
          <span>{source.confidence}% relevance</span>
        </div>
      </div>
    </motion.div>
  );
}

function CollapsibleSources({ sources, onSourceClick }: { sources: { name: string; subject: string; tag: string; snippet: string; confidence: number }[]; onSourceClick: (s: any) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-1 min-h-[44px] hover:text-foreground transition-colors"
      >
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
        Sources ({sources.length})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 pt-2">
              {sources.map((ref) => (
                <SourceCard key={ref.name} source={ref} onClick={() => onSourceClick(ref)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
  const [previewSource, setPreviewSource] = useState<{ name: string; subject: string; tag: string; snippet: string; confidence: number } | null>(null);
  const [sources] = useState<{ name: string; subject: string; tag: string; snippet: string; confidence: number }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://vijay1845.app.n8n.cloud/webhook/3968e79c-0056-4c7d-a2fd-9ce8e1251bc2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "query", query: text.trim() }),
        }
      );

      let aiContent = "I couldn't find relevant information in your uploaded documents. Please upload study materials first.";
      if (response.ok) {
        const data = await response.json();
        aiContent = data.response || data.output || data.message || aiContent;
      }

      const aiMsg: Message = { role: "ai", content: aiContent };
      setMessages((prev) => {
        setStreamingIndex(prev.length);
        return [...prev, aiMsg];
      });
    } catch (error) {
      console.error("Query error:", error);
      const aiMsg: Message = { role: "ai", content: "Sorry, I couldn't process your request. Please try again." };
      setMessages((prev) => {
        setStreamingIndex(prev.length);
        return [...prev, aiMsg];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            /* Empty State */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-4 sm:px-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg mb-8"
              >
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </motion.div>

              <h1 className="text-3xl font-semibold text-foreground mb-3 text-center tracking-tight">
                Start learning with AI
              </h1>
              <p className="text-muted-foreground text-base mb-12 text-center leading-relaxed max-w-md">
                Ask questions from your uploaded study materials to get accurate explanations grounded in your notes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(s)}
                    className="px-4 py-4 min-h-[44px] rounded-[var(--radius)] bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-card transition-all duration-200 text-left"
                  >
                    <span className="text-primary mr-1.5">→</span> {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Chat Messages */
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto scrollbar-none px-4 sm:px-6 pt-6 pb-36"
            >
              {/* Header */}
              <div className="max-w-3xl mx-auto mb-6">
                <div className="flex items-center gap-2 text-muted-foreground/60">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Answers grounded in your uploaded documents</span>
                </div>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    {msg.role === "user" ? (
                      /* User Bubble */
                      <div className="max-w-[85%] sm:max-w-[75%] bg-primary text-primary-foreground px-5 py-3.5 rounded-2xl rounded-br-md text-sm leading-relaxed shadow-soft">
                        {msg.content}
                      </div>
                    ) : (
                      /* AI Response */
                      <div className="max-w-full w-full group">
                        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                          <div className="text-sm leading-[1.8] text-foreground/90 whitespace-pre-wrap">
                            {streamingIndex === i ? (
                              <StreamingText
                                text={msg.content}
                                onComplete={() => setStreamingIndex(null)}
                              />
                            ) : (
                              msg.content.split(/(\*\*.*?\*\*)/).map((part, j) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                  <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-2.5 px-1">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            <span className="text-[11px] text-muted-foreground/60">
                              Answer generated from your uploaded documents
                            </span>
                          </div>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => copyText(msg.content)}
                              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground/50 hover:text-foreground transition-colors"
                              title="Copy"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => sendMessage(messages[i - 1]?.content || "")}
                              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground/50 hover:text-foreground transition-colors"
                              title="Regenerate"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Sources - only if real sources exist */}
                        {streamingIndex !== i && sources.length > 0 && (
                          <CollapsibleSources sources={sources} onSourceClick={setPreviewSource} />
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Searching indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2.5 px-1">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.15s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.3s" }} />
                      </div>
                      <span className="text-xs font-medium text-primary/80">
                        Searching your study materials...
                      </span>
                    </div>
                    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40 space-y-3 min-h-[120px]">
                      <div className="h-3 w-3/4 bg-accent rounded-md animate-pulse" />
                      <div className="h-3 w-full bg-accent rounded-md animate-pulse" />
                      <div className="h-3 w-5/6 bg-accent rounded-md animate-pulse" />
                      <div className="h-3 w-2/3 bg-accent rounded-md animate-pulse" />
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Input */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground/40">
                <BookOpen className="h-4 w-4" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your notes..."
                className="w-full bg-card rounded-[var(--radius)] shadow-card pl-11 pr-14 py-4 min-h-[52px] text-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:scale-100 shadow-soft"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Source Preview Panel */}
      <AnimatePresence>
        {previewSource && (
          <SourcePreviewPanel source={previewSource} onClose={() => setPreviewSource(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
