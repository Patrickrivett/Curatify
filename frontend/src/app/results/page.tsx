"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const mockPlaylists = [
  { id: 1, name: "Late Night Melancholy", creator: "oceanwaves_", compatibility: 72, discoveryRate: 80, coverUrl: "https://picsum.photos/seed/playlist1/300/300" },
  { id: 2, name: "Analog Afternoons", creator: "tapedeck.fm", compatibility: 68, discoveryRate: 70, coverUrl: "https://picsum.photos/seed/playlist2/300/300" },
  { id: 3, name: "Golden Hour Frequencies", creator: "sundial.sounds", compatibility: 61, discoveryRate: 58, coverUrl: "https://picsum.photos/seed/playlist3/300/300" },
];

export default function ResultsPage() {
  const [saved, setSaved] = useState<number[]>([]);

  function toggleSave(id: number) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  return (
    <main className={styles.main}>
      <p className="eyebrow">Matched to your taste</p>
      <h1 className={styles.heading}>Discover playlists</h1>

      <div className={styles.grid}>
        {mockPlaylists.map((playlist, i) => (
          <div
            key={playlist.id}
            className={styles.card}
            style={{ "--tilt": `${(i % 3) - 1}deg` } as React.CSSProperties}
          >
            <Image src={playlist.coverUrl} alt={`${playlist.name} cover`} width={300} height={300} className={styles.cover} />
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{playlist.name}</h3>
              <p className={styles.creator}>by @{playlist.creator}</p>

              <div className={styles.scores}>
                <div className={styles.scoreItem}>
                  <p className={styles.scoreNum}>{playlist.compatibility}%</p>
                  <p className={styles.scoreLabel}>Compatibility</p>
                </div>
                <div className={styles.scoreItem}>
                  <p className={styles.scoreNum}>{playlist.discoveryRate}%</p>
                  <p className={styles.scoreLabel}>Discovery</p>
                </div>
              </div>

              <div className={styles.actions}>
                <button onClick={() => toggleSave(playlist.id)} className={styles.saveButton}>
                  {saved.includes(playlist.id) ? "✓ Saved" : "Save for later"}
                </button>
                <a href="#" className={styles.openButton}>Open on Spotify</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a href="/dashboard" className={styles.backLink}>← Back to Dashboard</a>
    </main>
  );
}