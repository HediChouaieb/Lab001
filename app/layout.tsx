import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bibliothèque Publique de Carthage",
  description: "Your community library - Browse, borrow, and discover books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
