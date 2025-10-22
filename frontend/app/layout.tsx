import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gerson Carranza | Ingeniero de Sistemas & Data Analyst",
  description: "Portafolio profesional de Gerson Josue Carranza Amaya - Ingeniero de Sistemas, Analista de Datos y Desarrollador Backend especializado en Azure, SQL Server, Power BI y automatización de procesos.",
  keywords: [
    "Gerson Carranza",
    "Ingeniero de Sistemas",
    "Data Analyst",
    "Backend Developer",
    "Azure",
    "SQL Server",
    "Power BI",
    "ETL",
    "Business Intelligence",
    "Automatización",
    "Python",
    "C#",
    "ASP.NET",
    "Next.js",
    "Lima Perú"
  ],
  authors: [{ name: "Gerson Josue Carranza Amaya", url: "https://github.com/GersonJC" }],
  creator: "Gerson Carranza",
  publisher: "Gerson Carranza",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL), // Cambiarás esto después del deploy
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Gerson Carranza | Ingeniero de Sistemas & Data Analyst",
    description: "Portafolio profesional mostrando proyectos de análisis de datos, desarrollo backend y business intelligence",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Gerson Carranza Portfolio',
    images: [
      {
        url: '/og-image.png', // Crearás esta imagen después
        width: 1200,
        height: 630,
        alt: 'Gerson Carranza - Portafolio',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Gerson Carranza | Ingeniero de Sistemas & Data Analyst",
    description: "Portafolio profesional de desarrollo backend, análisis de datos y business intelligence",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregarás estos después de crear las cuentas
    // google: 'tu-codigo-de-verificacion',
    // yandex: 'tu-codigo-de-verificacion',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0066FF" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
