import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Empire",
  description: "Bigger than chess",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
