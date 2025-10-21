import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrudProdutos - Sistema de Gerenciamento",
  description:
    "Sistema moderno de gerenciamento de produtos com interface intuitiva e funcionalidades completas de CRUD.",
  keywords: ["produtos", "gerenciamento", "CRUD", "sistema", "dashboard"],
  authors: [{ name: "CrudProdutos Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "CrudProdutos - Sistema de Gerenciamento",
    description:
      "Sistema moderno de gerenciamento de produtos com interface intuitiva e funcionalidades completas de CRUD.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrudProdutos - Sistema de Gerenciamento",
    description:
      "Sistema moderno de gerenciamento de produtos com interface intuitiva e funcionalidades completas de CRUD.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-200`}
      >
        <div className="page-container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
