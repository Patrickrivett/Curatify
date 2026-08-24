import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curatify",
  description: "Discover human-curated Spotify playlists that match your taste",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
