import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheck, FiInfo, FiAlertCircle } from "react-icons/fi";

interface ToastMessage {
  id: string;
  text: string;
  type?: "success" | "info" | "error";
}

interface ToastContextType {
  showToast: (text: string, type?: "success" | "info" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium bg-[#1D1D1F]/90 dark:bg-[#FFFFFF]/90 text-white dark:text-[#1D1D1F] backdrop-blur-md shadow-lg shadow-black/10 transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-2 pointer-events-auto"
          >
            {toast.type === "success" && <FiCheck className="w-3.5 h-3.5 text-[#34C759] dark:text-[#30D158]" />}
            {toast.type === "info" && <FiInfo className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#0A84FF]" />}
            {toast.type === "error" && <FiAlertCircle className="w-3.5 h-3.5 text-[#FF3B30] dark:text-[#FF453A]" />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (text: string) => console.log("[Toast]", text),
    };
  }
  return context;
};

export default ToastProvider;
