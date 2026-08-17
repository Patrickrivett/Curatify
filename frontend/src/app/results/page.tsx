"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

// Mock data — will be replaced by a real fetch to /api/playlists once auth + scoring are built
const mockPlaylists = [
  { id: 1, name: "Playlist #1", creator: "Jane", compatibility: 72, discoveryRate: 80, coverUrl: "https://picsum.photos/seed/playlist1/300/300" },
  { id: 2, name: "Playlist #2", creator: "John", compatibility: 68, discoveryRate: 70, coverUrl: "https://picsum.photos/seed/playlist2/300/300" },
  { id: 3, name: "Playlist #3", creator: "Bob", compatibility: 61, discoveryRate: 58, coverUrl: "https://picsum.photos/seed/playlist3/300/300" },
];

export default function ResultsPage() {
  const [saved, setSaved] = useState<number[]>([]);

  function toggleSave(id: number) {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.wordmark}>Curatify.</h1>
      <h2 className={styles.heading}>Results:</h2>

      <div className={styles.grid}>
        {mockPlaylists.map((playlist) => (
          <div key={playlist.id} className={styles.card}>
            <Image
                src={playlist.coverUrl}
                alt={`Cover for ${playlist.name}`}
                width={160}
                height={160}
                className={styles.cover}
            />  
            <h3 className={styles.cardTitle}>{playlist.name}</h3>
            <p className={styles.creator}>Made by {playlist.creator}</p>
            <p className={styles.score}>Compatibility: {playlist.compatibility}%</p>
            <p className={styles.score}>Discovery Rate: {playlist.discoveryRate}%</p>

            <div className={styles.actions}>
              <button
                onClick={() => toggleSave(playlist.id)}
                className={`${styles.saveButton} ${saved.includes(playlist.id) ? styles.saved : ""}`}
              >
                {saved.includes(playlist.id) ? "✓ Saved" : "Save for Later"}
              </button>
              <a href="#" className={styles.spotifyLink}>
                Open in Spotify
              </a>
            </div>
          </div>
        ))}
      </div>

      <a href="/dashboard" className={styles.backButton}>
        ← Back to Dashboard
      </a>
    </main>
  );
}