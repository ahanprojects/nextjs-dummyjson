import type { Metadata } from 'next'
import { Space_Grotesk } from "next/font/google";
import './globals.css'

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ambisius Challenge - Farhan",
  description:
    "Develop CRUD functionality for `products` resources using the DummyJSON API (https://dummyjson.com/docs/products) by designing user-friendly tables and forms for the interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
