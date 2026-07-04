import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/components/provider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TinerURL — Link Management",
  description: "Create, manage, and track your shortened links",
  icons: {
    icon: "/url.ico", // points to public/url.ico
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
