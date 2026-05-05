import { motion } from "framer-motion";
import { useState } from "react";
import { MessageSquare, X, Phone } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function WhatsAppZalo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 bg-white rounded-2xl shadow-xl border border-border overflow-hidden w-56"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Liên hệ ngay</p>
            </div>
            <div className="p-3 space-y-2">
              <a
                href="tel:0909123456"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700">Gọi điện</p>
                  <p className="text-xs text-green-600">0909 123 456</p>
                </div>
              </a>
              <a
                href="https://zalo.me/0909123456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700">Zalo</p>
                  <p className="text-xs text-blue-600">Chat ngay</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-green-500 text-white rounded-full shadow-xl shadow-green-500/30 flex items-center justify-center hover:bg-green-600 transition-colors"
        aria-label="Liên hệ Zalo"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
