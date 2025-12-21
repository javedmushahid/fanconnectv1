import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerRegister from "@/components/pwa/service-worker-register";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FanConnect - Connect with Your Favorite Creators",
  description: "Join FanConnect to support and connect with your favorite creators. Subscribe, watch live streams, and access exclusive content.",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FanConnect",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "FanConnect",
    title: "FanConnect - Connect with Your Favorite Creators",
    description: "Join FanConnect to support and connect with your favorite creators",
  },
  twitter: {
    card: "summary_large_image",
    title: "FanConnect - Connect with Your Favorite Creators",
    description: "Join FanConnect to support and connect with your favorite creators",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ServiceWorkerRegister />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
