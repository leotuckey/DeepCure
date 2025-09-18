"use client";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, useTheme } from "./theme-context";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

function BodyWithTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className={`theme-${theme} min-h-dvh antialiased`}>
      {children}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${robotoMono.variable}`}>
      <body className="bg-background text-foreground font-sans">
        <ThemeProvider>
          <BodyWithTheme>{children}</BodyWithTheme>
        </ThemeProvider>
      </body>
    </html>
  );
}
