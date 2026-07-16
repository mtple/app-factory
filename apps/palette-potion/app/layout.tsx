import { palettePotionMetadata, palettePotionViewport } from "../lib/metadata";
import "./globals.css";

export const metadata = palettePotionMetadata;
export const viewport = palettePotionViewport;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
