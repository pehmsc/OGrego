import type { Metadata } from "next";
import "./ui/globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Providers } from "./providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-title",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "O Grego Restaurante",
  description: "Aqui, come-se devagar, conversa-se mais e volta-se sempre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
