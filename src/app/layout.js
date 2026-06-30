import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CoFoundry — Build Your Dream Team",
    template: "%s | CoFoundry",
  },
  description:
    "CoFoundry connects startup founders with talented collaborators — developers, designers, marketers and more — to build the next big thing together.",
  keywords: ["startup", "co-founder", "team building", "opportunities", "collaborators"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-surface text-text">
        {children}
      </body>
    </html>
  );
}
