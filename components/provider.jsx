"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            color: "#0f172a",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
          },
          iconTheme: {
            primary: "#4f46e5",
            secondary: "#ffffff",
          },
        }}
      />
    </AuthProvider>
  );
}
