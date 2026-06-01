import type { Metadata } from "next";
import { Red_Hat_Display, Inter } from "next/font/google";
import "./globals.css";
import { CompletionProvider } from "@/components/completion";
import Shell from "@/components/Shell";
import { getChapters } from "@/lib/chapters";

const display = Red_Hat_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Analista Starter Kit — Citiesoft",
  description:
    "Manual de onboarding para novos analistas de negócio da Citiesoft.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chapters = await getChapters();

  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <CompletionProvider>
          <Shell chapters={chapters}>{children}</Shell>
        </CompletionProvider>
      </body>
    </html>
  );
}
