import styles from "./page.module.css";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <svg viewBox="0 0 40 40" className={styles.mark} aria-hidden="true">
          <circle cx="20" cy="20" r="18" fill="none" stroke="var(--rust)" strokeWidth="2" />
          <circle cx="20" cy="20" r="11" fill="none" stroke="var(--rust)" strokeWidth="1" opacity="0.6" />
          <circle cx="20" cy="20" r="3" fill="var(--rust)" />
        </svg>

        <h1 className={styles.wordmark}>Curatify</h1>
        <p className={styles.tagline}>Your music, your way.</p>
        <p className={styles.pitch}>
          Discover playlists that actually match your taste.
        </p>

        <a href="/api/auth/login" className={styles.spotifyButton}>
          <svg viewBox="0 0 24 24" className={styles.spotifyIcon}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.14 4.32-1.32 9.719-.66 13.439 1.62.361.181.54.78.301 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span>Continue with Spotify</span>
        </a>
        
        <div className="marquee">
          <div className="marqueeTrack">
            <span>
              {"Curatify — music, hand-picked by you. ".repeat(6)}
            </span>
            <span>
              {"Curatify — music, hand-picked by you. ".repeat(6)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
