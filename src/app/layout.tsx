import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dashboard.getfixpair.com"),
  title: "Fixpair",
  description: "Dashboard for Fixpair",
  openGraph: {
    type: "website",
    siteName: "Fixpair",
    title: "Fixpair",
    description: "Dashboard for Fixpair",
    images: [{
      url: "/fixpair-share-logo.png",
      width: 633,
      height: 633,
      alt: "Fixpair logo",
    }],
  },
  twitter: {
    card: "summary",
    title: "Fixpair",
    description: "Dashboard for Fixpair",
    images: ["/fixpair-share-logo.png"],
  },
  icons: {
    apple: "/fixpair-share-logo.png",
  },
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
        suppressHydrationWarning
      >
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
