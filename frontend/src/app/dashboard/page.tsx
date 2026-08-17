import Image from "next/image";
import styles from "./page.module.css";

// Mock data — will be replaced by a real fetch to /api/profile once auth is built
const mockProfile = {
  topGenres: ["Dance Pop", "90s Country", "Indie Rock"],
  topArtists: ["Bruno Mars", "Luke Combs", "Marianas Trench"],
  genresTracked: 12,
  recentAlbums: [
    { id: 1, name: "1989", artist: "Taylor Swift", coverUrl: "https://picsum.photos/seed/album1/200/200" },
    { id: 2, name: "Gunslinger", artist: "Luke Combs", coverUrl: "https://picsum.photos/seed/album2/200/200" },
    { id: 3, name: "24K Magic", artist: "Bruno Mars", coverUrl: "https://picsum.photos/seed/album3/200/200" },
    { id: 4, name: "Ever After", artist: "Marianas Trench", coverUrl: "https://picsum.photos/seed/album4/200/200" },
    { id: 5, name: "Currents", artist: "Tame Impala", coverUrl: "https://picsum.photos/seed/album5/200/200" },
  ],
};

export default function DashboardPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.wordmark}>Curatify.</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Top Genres</h2>
          <ul className={styles.list}>
            {mockProfile.topGenres.map((genre) => (
              <li key={genre}>{genre}</li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Top Artists</h2>
          <ul className={styles.list}>
            {mockProfile.topArtists.map((artist) => (
              <li key={artist}>{artist}</li>
            ))}
          </ul>
        </div>

        <div className={`${styles.card} ${styles.cardAccent}`}>
          <h2 className={styles.cardTitle}>Genres in Your Profile</h2>
          <p className={styles.bigNumber}>{mockProfile.genresTracked}</p>
        </div>
      </div>

      <section className={styles.recentSection}>
        <h2 className={styles.recentHeading}>Recently you&apos;ve been listening to...</h2>
        <div className={styles.scrollRow}>
          {mockProfile.recentAlbums.map((album) => (
            <div key={album.id} className={styles.albumCard}>
              <Image
                src={album.coverUrl}
                alt={`${album.name} cover`}
                width={140}
                height={140}
                className={styles.albumCover}
              />
              <p className={styles.albumName}>{album.name}</p>
              <p className={styles.albumArtist}>{album.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <a href="/results" className={styles.ctaButton}>
        Find New, Curated Playlists →
      </a>
    </main>
  );
}