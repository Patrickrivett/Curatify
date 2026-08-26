import Image from "next/image";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

const mockRecentAlbums = [
  { id: 1, name: "1989", artist: "Taylor Swift", coverUrl: "https://picsum.photos/seed/album1/200/200" },
  { id: 2, name: "Gunslinger", artist: "Luke Combs", coverUrl: "https://picsum.photos/seed/album2/200/200" },
  { id: 3, name: "24K Magic", artist: "Bruno Mars", coverUrl: "https://picsum.photos/seed/album3/200/200" },
  { id: 4, name: "Ever After", artist: "Marianas Trench", coverUrl: "https://picsum.photos/seed/album4/200/200" },
  { id: 5, name: "Currents", artist: "Tame Impala", coverUrl: "https://picsum.photos/seed/album5/200/200" },
  { id: 6, name: "Random Access Memories", artist: "Daft Punk", coverUrl: "https://picsum.photos/seed/album6/200/200" },
  { id: 7, name: "In the Lonely Hour", artist: "Sam Smith", coverUrl: "https://picsum.photos/seed/album7/200/200" },
  { id: 8, name: "A Head Full of Dreams", artist: "Coldplay", coverUrl: "https://picsum.photos/seed/album8/200/200" },
  { id: 9, name: "Melodrama", artist: "Lorde", coverUrl: "https://picsum.photos/seed/album9/200/200" },
  { id: 10, name: "Blurryface", artist: "Twenty One Pilots", coverUrl: "https://picsum.photos/seed/album10/200/200" },
];

async function getProfile() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://127.0.0.1:3000"}/api/profile`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/");
  }

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  return res.json();
}

export default async function DashboardPage() {
  const profile = await getProfile();

  return (
    <main className={styles.main}>
      <p className="eyebrow">Recently listened</p>
      <div className={styles.scrollRow}>
        {mockRecentAlbums.map((album, i) => (
          <div
            key={album.id}
            className={styles.albumCard}
            style={{ "--tilt": `${(i % 3) - 1}deg` } as React.CSSProperties}
          >
            <Image src={album.coverUrl} alt={`${album.name} cover`} width={140} height={140} className={styles.albumCover} />
            <p className={styles.albumName}>{album.name}</p>
            <p className={styles.albumArtist}>{album.artist}</p>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <p className="eyebrow">Your top genres</p>
          <ul className={styles.list}>
            {profile.topGenres.slice(0, 10).map((g: string) => <li key={g}>{g}</li>)}
          </ul>
        </div>
        <div className={styles.card}>
          <p className="eyebrow">Your top artists</p>
          <ul className={styles.list}>
            {profile.topArtists.slice(0, 10).map((a: { id: string; name: string }) => <li key={a.id}>{a.name}</li>)}
          </ul>
        </div>
        <div className={styles.card}>
          <p className="eyebrow">Genres in your profile</p>
          <p className={styles.bigNumber}>{profile.topGenres.length}</p>
        </div>
      </div>

      <a href="/results" className={styles.ctaButton}>Find new, curated playlists →</a>
    </main>
  );
}