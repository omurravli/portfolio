import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ömür Ravlı — Engineering Core",
  description:
    "Mechanical engineering student and multidisciplinary developer creating mobile apps, IoT systems, ML workflows, drone projects, optimization tools, and modern web experiences.",
  openGraph: {
    title: "Ömür Ravlı — Engineering Core",
    description:
      "Multidisciplinary engineer and developer building real-world software, hardware, AI, and product systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable} bg-void font-sans text-zinc-200 antialiased`}
      >
        {children}
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
