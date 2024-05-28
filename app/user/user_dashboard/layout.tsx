import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserLayout from '../../components/UserLayout'
import '../../globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Syllab",
  description: "...where learning meets excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserLayout>
        {children}
        </UserLayout>
        </body>
    </html>
  );
}
