import styles from "./page.module.css";

const mockSaved = [
  { id: 1, name: "Late Night Melancholy", creator: "oceanwaves_", tracks: 42 },
  { id: 2, name: "Analog Afternoons", creator: "tapedeck.fm", tracks: 33 },
  { id: 3, name: "Golden Hour Frequencies", creator: "sundial.sounds", tracks: 28 },
];

export default function SavedPage() {
  console.log("openId is:", openId);
  return (
    <main className={styles.main}>
      <p className="eyebrow">Not yet on Spotify</p>
      <h1 className={styles.heading}>Saved for later</h1>

      {mockSaved.length === 0 ? (
        <p className={styles.empty}>You haven&apos;t saved any playlists yet.</p>
      ) : (
        <div className={styles.stack}>
          {mockSaved.map((playlist) => (
            <div key={playlist.id} className={styles.spine}>
              <div className={styles.spineName}>{playlist.name}</div>
              <div className={styles.spineMeta}>
                @{playlist.creator} · {playlist.tracks} tracks
              </div>
              <button className={styles.spotifyBtn}>Save to Spotify</button>
            </div>
          ))}
        </div>
      )}

      <a href="/results" className={styles.backLink}>← Back to Results</a>
    </main>
  );
}