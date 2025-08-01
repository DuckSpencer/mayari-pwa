import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: "Mayari - AI-Powered Children's Stories",
  description: "Create magical bedtime stories with your child, one question at a time. Transform screen time into valuable storytelling time.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mayari",
  },
  icons: {
    icon: "/icon-192x192.svg",
    apple: "/icon-192x192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#7B9AE0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full bg-[#FFF8F0] text-[#2C3E50] font-sans" suppressHydrationWarning>
        <AuthProvider>
          <div className="h-full">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}