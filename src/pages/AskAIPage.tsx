import { useState, useRef, useEffect } from "react";
import { Send, Copy, RefreshCw, FileText, ChevronRight, ChevronLeft } from "lucide-react";
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

const MOCK_REFS = [
  { name: "DBMS Unit 3 Notes.pdf", subject: "Database Systems", confidence: 92 },
  { name: "OS PYQ 2023.pdf", subject: "Operating Systems", confidence: 78 },
  { name: "CN Important Questions.docx", subject: "Computer Networks", confidence: 65 },
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `Based on your uploaded documents, here's what I found:\n\n**Key Concepts:**\n\n1. **Normalization** — The process of organizing data to reduce redundancy. Your notes cover 1NF through BCNF with examples.\n\n2. **Transaction Management** — ACID properties ensure database reliability. This topic appears in 3 of your uploaded PYQs.\n\n3. **Indexing** — B+ trees and hash indexing are covered extensively in Unit 4.\n\nI've cross-referenced this with your PYQ papers and these topics have appeared consistently over the last 4 semesters.`,
};

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showRefs, setShowRefs] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
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

    await new Promise((r) => setTimeout(r, 2000));

    const aiMsg: Message = { role: "ai", content: MOCK_RESPONSES.default };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
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
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-6"
            >
              <h1 className="text-3xl font-bold text-foreground mb-3 text-center">
                Ask anything from your study materials
              </h1>
              <p className="text-muted-foreground text-lg mb-10 text-center">
                AI will answer using your uploaded documents.
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-4 py-2 rounded-full bg-card ring-soft text-sm text-muted-foreground hover:text-foreground hover:shadow-soft transition-all duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto scrollbar-none px-6 pt-8 pb-32"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    {msg.role === "user" ? (
                      <div className="max-w-[80%] bg-secondary text-foreground px-5 py-3 rounded-[20px] rounded-tr-none text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="max-w-full w-full group">
                        <div className="bg-card shadow-card rounded-3xl p-8 border-l-4 border-primary">
                          <div className="text-sm leading-[1.7] text-foreground whitespace-pre-wrap">
                            {msg.content.split(/(\*\*.*?\*\*)/).map((part, j) =>
                              part.startsWith("**") && part.endsWith("**") ? (
                                <strong key={j} className="font-semibold">
                                  {part.slice(2, -2)}
                                </strong>
                              ) : (
                                <span key={j}>{part}</span>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 ml-2">
                          <span className="text-xs text-muted-foreground/60">
                            Answer generated from uploaded materials
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyText(msg.content)}
                              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => sendMessage(messages[i - 1]?.content || "")}
                              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-muted-foreground text-xs font-medium"
                  >
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-dot-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-dot-2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-dot-3" />
                    </div>
                    AI is searching your documents...
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Input */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about important topics, PYQs, or request quick revision..."
              className="w-full bg-card rounded-[32px] shadow-premium px-8 py-5 pr-16 text-base ring-soft focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gradient-primary text-primary-foreground rounded-full hover:opacity-90 transition-all active:scale-95 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Referenced Documents Panel */}
      {hasMessages && (
        <>
          <button
            onClick={() => setShowRefs(!showRefs)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-card shadow-soft rounded-l-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ right: showRefs ? 300 : 0 }}
          >
            {showRefs ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {showRefs && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-l border-border/50 bg-card/50 backdrop-blur-md overflow-hidden"
              >
                <div className="p-6 w-[300px]">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Referenced Documents
                  </h3>
                  <div className="space-y-4">
                    {MOCK_REFS.map((ref) => (
                      <div key={ref.name} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {ref.name}
                            </p>
                            <span className="text-xs text-muted-foreground">{ref.subject}</span>
                          </div>
                        </div>
                        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${ref.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
