import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM Tool",
  description: "Herramienta de gestión de proyectos construida en el taller",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
