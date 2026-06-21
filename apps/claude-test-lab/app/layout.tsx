import { claudeTestLabMetadata, claudeTestLabViewport } from "../lib/metadata";
import "./globals.css";

export const metadata = claudeTestLabMetadata;
export const viewport = claudeTestLabViewport;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
