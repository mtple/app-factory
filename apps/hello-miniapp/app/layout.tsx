import { helloMiniAppMetadata, helloMiniAppViewport } from "../lib/metadata";
import "./globals.css";

export const metadata = helloMiniAppMetadata;
export const viewport = helloMiniAppViewport;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
