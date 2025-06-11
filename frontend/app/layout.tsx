import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../components/ThemeProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Learning portal for students",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "public/layout/favicon/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "public/layout/favicon/android-chrome-512x512.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      url: "public/layout/favicon/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "public/layout/favicon/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "public/layout/favicon/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "512x512",
      url: "/layout/favicon/android-chrome-512x512.png",
    },
  ],
  manifest: "/layout/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
