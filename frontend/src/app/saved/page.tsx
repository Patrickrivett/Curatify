import Image from "next/image";
import styles from "./page.module.css";

// Mock data — will eventually come from GET /api/saved
const mockSaved = [
  { id: 1, name: "Playlist #1", creator: "Jane", coverUrl: "https://picsum.photos/seed/playlist1/300/300" },
  { id: 3, name: "Playlist #3", creator: "Bob", coverUrl: "https://picsum.photos/seed/playlist3/300/300" },
];

export default function SavedPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.wordmark}>Curatify.</h1>
      <h2 className={styles.heading}>Saved for Later</h2>

      {mockSaved.length === 0 ? (
        <p className={styles.empty}>You haven't saved any playlists yet.</p>
      ) : (
        <div className={styles.list}>
          {mockSaved.map((playlist) => (
            <div key={playlist.id} className={styles.row}>
              <Image
                src={playlist.coverUrl}
                alt={`${playlist.name} cover`}
                width={64}
                height={64}
                className={styles.cover}
              />
              <div className={styles.info}>
                <p className={styles.name}>{playlist.name}</p>
                <p className={styles.creator}>Made by {playlist.creator}</p>
              </div>
              <a href="#" className={styles.spotifyLink}>
                Open in Spotify
              </a>
            </div>
          ))}
        </div>
      )}

      <a href="/results" className={styles.backButton}>
        ← Back to Results
      </a>
    </main>
  );
}