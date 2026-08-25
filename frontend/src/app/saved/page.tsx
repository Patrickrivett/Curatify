"use client";

import { useState } from "react";
import styles from "./page.module.css";

const mockSaved = [
  {
    id: 1,
    name: "Late Night Melancholy",
    creator: "oceanwaves_",
    tracks: 42,
    followers: "12.4K",
    description: "Slow, hazy indie for 2am thoughts.",
    trackList: [
      { title: "Motion Sickness", artist: "Phoebe Bridgers", duration: "3:29" },
      { title: "Heat Waves", artist: "Glass Animals", duration: "3:58" },
      { title: "Liability", artist: "Lorde", duration: "3:06" },
      { title: "Ivy", artist: "Frank Ocean", duration: "4:09" },
    ],
  },
  {
    id: 2,
    name: "Analog Afternoons",
    creator: "tapedeck.fm",
    tracks: 33,
    followers: "5.9K",
    description: "Sun-warped psych and indie for slow days.",
    trackList: [
      { title: "Let It Happen", artist: "Tame Impala", duration: "7:47" },
      { title: "Borderline", artist: "Tame Impala", duration: "4:29" },
      { title: "The Less I Know The Better", artist: "Tame Impala", duration: "3:36" },
    ],
  },
  {
    id: 3,
    name: "Golden Hour Frequencies",
    creator: "sundial.sounds",
    tracks: 28,
    followers: "8.1K",
    description: "Warm R&B and soul, best played at dusk.",
    trackList: [
      { title: "Pink + White", artist: "Frank Ocean", duration: "3:03" },
      { title: "Redbone", artist: "Childish Gambino", duration: "5:27" },
      { title: "Come Through and Chill", artist: "Miguel", duration: "4:22" },
    ],
  },
];

export default function SavedPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const openPlaylist = mockSaved.find((p) => p.id === openId);

  return (
    <main className={styles.main}>
      <p className="eyebrow">Not yet on Spotify</p>
      <h1 className={styles.heading}>Saved for later</h1>

      {mockSaved.length === 0 ? (
        <p className={styles.empty}>You haven&apos;t saved any playlists yet.</p>
      ) : (
        <div className={styles.stack}>
          {mockSaved.map((playlist) => (
            <div
              key={playlist.id}
              className={styles.spine}
              onClick={() => setOpenId(playlist.id)}
            >
              <div className={styles.spineName}>{playlist.name}</div>
              <div className={styles.spineMeta}>
                @{playlist.creator} · {playlist.tracks} tracks
              </div>
              <button
                className={styles.spotifyBtn}
                onClick={(e) => e.stopPropagation()}
              >
                Save to Spotify
              </button>
            </div>
          ))}
        </div>
      )}

      <a href="/results" className={styles.backLink}>← Back to Results</a>

      {openPlaylist && (
        <div className={styles.overlay} onClick={() => setOpenId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setOpenId(null)}>✕</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalCover} />
              <div>
                <p className={styles.modalEyebrow}>Playlist</p>
                <h2 className={styles.modalTitle}>{openPlaylist.name}</h2>
                <p className={styles.modalDescription}>{openPlaylist.description}</p>
                <p className={styles.modalMeta}>
                  By @{openPlaylist.creator} · {openPlaylist.followers} followers · {openPlaylist.tracks} tracks
                </p>
              </div>
            </div>

            <div className={styles.trackList}>
              {openPlaylist.trackList.map((track, i) => (
                <div key={track.title} className={styles.trackRow}>
                  <span className={styles.trackIndex}>{i + 1}</span>
                  <div className={styles.trackInfo}>
                    <p className={styles.trackTitle}>{track.title}</p>
                    <p className={styles.trackArtist}>{track.artist}</p>
                  </div>
                  <span className={styles.trackDuration}>{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}