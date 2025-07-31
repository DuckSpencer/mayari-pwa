import type { Metadata } from "next";
import "./globals.css";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mayari - AI-Powered Children's Stories",
  description: "Create magical bedtime stories with your child, one question at a time. Transform screen time into valuable storytelling time.",
  manifest: "/manifest.json",
  themeColor: "#7B9AE0",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mayari",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full bg-primary-warm text-primary-navy font-sans">
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}