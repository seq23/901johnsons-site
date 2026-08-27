import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "901 Johnsons | Family Reunion & Family Upkeep",
  description:
    "A warm family home online for Johnson reunions, family announcements, photos, videos, and the legacy of Evelena Johnson and Joe Johnson Jr.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://901johnsons.com"),
  // "./" resolves against metadataBase + the current route, giving every page a
  // self-canonical on the production domain. Without it the *.pages.dev preview
  // host is indexable as a primary and competes with 901johnsons.com.
  alternates: { canonical: "./" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
