import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ weight: '500', subsets: ["latin"] });

export const metadata = {
  title: "Newsky Statistics",
  description: "Newsky Statistics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}