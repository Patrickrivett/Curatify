export async function getListenedArtistIds(accessToken: string): Promise<Set<string>> {
    const listenedIds = new Set<string>()
  
    // Saved (liked) tracks — first page, 50 max
    const savedRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (savedRes.ok) {
      const savedData = await savedRes.json()
      for (const item of savedData.items ?? []) {
        for (const artist of item.track?.artists ?? []) {
          listenedIds.add(artist.id)
        }
      }
    }
  
    // Recently played tracks — Spotify caps this at 50, no pagination possible
    const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (recentRes.ok) {
      const recentData = await recentRes.json()
      for (const item of recentData.items ?? []) {
        for (const artist of item.track?.artists ?? []) {
          listenedIds.add(artist.id)
        }
      }
    }
  
    // TODO: paginate saved tracks for users with large libraries (v1 approximation)
    return listenedIds
  }

  export type SpotifyPlaylistSummary = {
    id: string
    name: string
    creator: string
    trackCount: number
    imageUrl: string | null
  }
  
  export async function searchPlaylistsByGenre(
    accessToken: string,
    genre: string,
    limit: number = 10
  ): Promise<SpotifyPlaylistSummary[]> {
    const params = new URLSearchParams({
      q: genre,
      type: 'playlist',
      limit: String(limit),
    })
  
    const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  
    if (!res.ok) {
      return []
    }
  
    const data = await res.json()
    const items = data.playlists?.items ?? []
  
    return items
      .filter((p: unknown): p is NonNullable<typeof p> => p != null)
      .map((p: { id: string; name: string; owner?: { display_name?: string }; items?: { total?: number }; images?: { url: string }[] }) => ({
        id: p.id,
        name: p.name,
        creator: p.owner?.display_name ?? 'Unknown',
        trackCount: p.items?.total ?? 0,
        imageUrl: p.images?.[0]?.url ?? null,
      }))
  }

  export async function getCandidatePlaylists(
    accessToken: string,
    genres: string[],
    genresToSearch: number = 5,
    resultsPerGenre: number = 10
  ): Promise<SpotifyPlaylistSummary[]> {
    const genresToUse = genres.slice(0, genresToSearch)
  
    const resultsPerGenreArrays = await Promise.all(
      genresToUse.map((genre) => searchPlaylistsByGenre(accessToken, genre, resultsPerGenre))
    )
  
    const seen = new Set<string>()
    const deduped: SpotifyPlaylistSummary[] = []
  
    for (const playlists of resultsPerGenreArrays) {
      for (const playlist of playlists) {
        if (!seen.has(playlist.id)) {
          seen.add(playlist.id)
          deduped.push(playlist)
        }
      }
    }
  
    return deduped
  }