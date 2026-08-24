import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=spotify_auth_failed', request.url))
  }

  // Exchange the authorization code for access + refresh tokens
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
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  })

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url))
  }

  const tokenData = await tokenResponse.json()
  const { access_token, refresh_token } = tokenData

  // Fetch the user's Spotify profile
  const profileResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!profileResponse.ok) {
    return NextResponse.redirect(new URL('/?error=profile_fetch_failed', request.url))
  }

  const profile = await profileResponse.json()

  // Upsert the user into our database
  const existing = await db.select().from(users).where(eq(users.spotifyId, profile.id))

  let userId: string

  if (existing.length > 0) {
    await db
      .update(users)
      .set({
        refreshToken: refresh_token,
        displayName: profile.display_name,
        email: profile.email,
      })
      .where(eq(users.spotifyId, profile.id))
    userId = existing[0].id
  } else {
    const inserted = await db
      .insert(users)
      .values({
        spotifyId: profile.id,
        displayName: profile.display_name,
        email: profile.email,
        refreshToken: refresh_token,
      })
      .returning({ id: users.id })
    userId = inserted[0].id
  }

  // Set a session cookie and redirect to the dashboard
  const response = NextResponse.redirect(new URL('/dashboard', request.url))
  response.cookies.set('session_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return response
}