import { motion } from 'framer-motion';

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/2347073692261"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring' }}
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse-glow blur-md" />
      <div className="relative w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all hover:scale-110">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
          <path d="M17.6 6.3A7.85 7.85 0 0 0 12 4a7.95 7.95 0 0 0-6.85 11.9L4 20l4.2-1.1A7.95 7.95 0 0 0 12 20a8 8 0 0 0 5.6-13.7zM12 18.3a6.3 6.3 0 0 1-3.2-.9l-.23-.13-2.5.66.67-2.42-.15-.25a6.3 6.3 0 1 1 5.4 3.04zm3.5-4.7c-.2-.1-1.15-.57-1.32-.63s-.3-.1-.43.1-.5.63-.62.76-.23.15-.43.05a8 8 0 0 1-2.36-1.45 8.7 8.7 0 0 1-1.63-2.03c-.17-.3 0-.45.13-.6s.3-.35.43-.52a2 2 0 0 0 .3-.5.37.37 0 0 0 0-.35c0-.1-.43-1.03-.58-1.4s-.3-.32-.43-.33h-.37a.7.7 0 0 0-.5.23 2 2 0 0 0-.63 1.5 3.5 3.5 0 0 0 .73 1.85 8 8 0 0 0 3.06 2.7c.43.18.76.3 1.02.38a2.5 2.5 0 0 0 1.13.07c.35-.05 1.15-.47 1.3-.92s.2-.84.13-.92-.2-.13-.4-.23z" />
        </svg>
      </div>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap glass px-3 py-1.5 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with me
      </span>
    </motion.a>
  );
}
