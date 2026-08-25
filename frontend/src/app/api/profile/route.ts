import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

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

  // Derive a genre list from the artists' genre tags
  const genreCounts: Record<string, number> = {}
  for (const artist of artists) {
    for (const genre of artist.genres ?? []) {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    }
  }
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