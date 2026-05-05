import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useChatWithAI } from "@workspace/api-client-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Xin chào! Tôi là trợ lý BELUGA. Tôi có thể giúp bạn tư vấn về dịch vụ catering, báo giá và đặt tiệc. Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`chat_${Date.now()}`);

  const chatMutation = useChatWithAI();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const result = await chatMutation.mutateAsync({
        data: {
          messages: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          session_id: sessionId.current,
        }
      });
      setMessages((prev) => [...prev, { role: "assistant", content: (result as unknown as { reply: string }).reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại hoặc gọi 0909 123 456." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Trợ lý BELUGA</p>
                <p className="text-white/70 text-xs">Luôn sẵn sàng hỗ trợ</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-border bg-white flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 text-sm px-3 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/30"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || chatMutation.isPending}
                className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
