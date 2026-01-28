import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { MinistryBanner } from "@/components/ministry-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radiology Friend - Ministry of Health Albania",
  description: "Professional AI-powered medical imaging analysis system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MinistryBanner />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
