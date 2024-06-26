import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ToastProvider from "../lib/react-toastify/ToastProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WDAT-Syllabus App",
  description: "Empower your learning journey with our comprehensive web development syllabus app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ToastProvider>
        <UserProvider>
        <main>
        {children}
        </main>
        </UserProvider>
      </ToastProvider>
        </body>
    </html>
  );
}

