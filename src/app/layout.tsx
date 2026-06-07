import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import {ReactNode} from "react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AppProviders>
      <html
        lang="en"
        className={`${outfit.variable} ${syne.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#fafafa] text-slate-900">
          {children}
        </body>
      </html>
    </AppProviders>
  );
}
