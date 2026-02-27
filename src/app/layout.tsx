import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BackToTop } from "@/components/shared/back-to-top";
import { baseMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = baseMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteData = websiteJsonLd();
  const organizationData = organizationJsonLd();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="llms" href="/llms.txt" />
      </head>
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        <ThemeProvider>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
          />
          <div className="relative min-h-screen bg-page text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_5%,rgba(222,111,73,0.15),transparent_30%),radial-gradient(circle_at_92%_10%,rgba(14,118,105,0.2),transparent_28%),radial-gradient(circle_at_50%_95%,rgba(15,23,42,0.07),transparent_38%)]" />
            <div className="relative z-10 flex min-h-screen flex-col">
              <a
                href="#main-content"
                className="sr-only left-4 top-4 z-50 rounded-full bg-slate-900 px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute"
              >
                Skip to content
              </a>
              <Navbar />
              <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
                {children}
              </main>
              <Footer />
              <BackToTop />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
