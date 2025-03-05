import { type Metadata } from "next";
import { Karla as FontSans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import "~/styles/globals.css";

const fontSans = FontSans({
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "Davstream",
  description: "Meilleur site de streaming",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`dark min-h-svh w-screen overflow-x-hidden ${fontSans.variable}`}
    >
      <body className="flex flex-col">
        <NextTopLoader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
