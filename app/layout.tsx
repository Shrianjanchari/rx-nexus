import type { Metadata } from "next";
import "./globals.css";
import { RefillProvider } from "./context/RefillContext";

export const metadata: Metadata = {
  title: "RxNexus",
  description: "Connect. Resolve. Complete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RefillProvider>{children}</RefillProvider>
      </body>
    </html>
  );
}