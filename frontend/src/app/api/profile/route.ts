import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

async function getLastfmTags(artistName: string): Promise<string[]> {
    const params = new URLSearchParams({
      method: 'artist.gettoptags',
      artist: artistName,
      api_key: process.env.LASTFM_API_KEY!,
      format: 'json',
    })
  
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`)
      if (!res.ok) return []
  
      const data = await res.json()
      const tags = data.toptags?.tag ?? []
  
      // Take just the top 3 tags, lowercase them for consistent matching later
      return tags.slice(0, 3).map((t: { name: string }) => t.name.toLowerCase())
    } catch {
      return []
    }
  }

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get a fresh access token using the stored refresh token
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: session.refreshToken,
    }),
  })

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: 'Failed to refresh Spotify token' }, { status: 502 })
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  // Fetch the user's top artists (medium_term = last ~6 months, per the design doc)
  const topArtistsResponse = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!topArtistsResponse.ok) {
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 502 })
  }

  const topArtistsData = await topArtistsResponse.json()
  const artists = topArtistsData.items

  // Fetch Last.fm tags for each artist in parallel, since Spotify's own
  // genre field is frequently empty for individual artists
  const lastfmTagsByArtist = await Promise.all(
    artists.map((artist: { name: string }) => getLastfmTags(artist.name))
  )

  // Derive a genre list, combining Spotify's genres (when present) with Last.fm tags
  const genreCounts: Record<string, number> = {}
  artists.forEach((artist: { genres?: string[] }, i: number) => {
    const combinedGenres = [...(artist.genres ?? []), ...lastfmTagsByArtist[i]]
    for (const genre of combinedGenres) {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    }
  })
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre)

  return NextResponse.json({
    topArtists: artists.map((a: { id: string; name: string; genres: string[]; images: { url: string }[] }) => ({
      id: a.id,
      name: a.name,
      genres: a.genres,
      image: a.images[0]?.url ?? null,
    })),
    topGenres,
  })
}