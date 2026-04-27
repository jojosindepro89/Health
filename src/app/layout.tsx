import type { Metadata } from "next";
import "./globals.css";

import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/lib/toast";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "DHS Hospital Workspace",
  description: "DHS Hospital Management System — A comprehensive workspace for healthcare administration, patient management, pharmacy, laboratory, finance, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StoreProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

