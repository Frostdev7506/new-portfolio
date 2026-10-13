import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { PageHeader } from "@/components/layout/page-header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { baseMetadata, websiteJsonLd } from "@/lib/seo";

const noteFont = Caveat({
  subsets: ["latin"],
  variable: "--font-note",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = baseMetadata();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={noteFont.variable + " antialiased"}>
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteJsonLd()),
            }}
          />
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <div className="site-shell">
            <Navbar />
            <div className="page-column">
              <PageHeader />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
