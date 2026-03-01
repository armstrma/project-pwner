import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Pwner",
  description: "Agent orchestration task board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
