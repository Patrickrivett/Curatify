import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID! // retrieving clientId and the redirect URI from env file
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!

  const scopes = [ //this is the list of permissions we are asking the user to grant access to
    'user-top-read',
    'user-library-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-modify-public',
  ].join(' ')

  const params = new URLSearchParams({ //params is the query code that spotify expects, eg. when the user is redirected, the foundation li
    response_type: 'code',            // + this 'params' bakes the requirements into the url so that the user can grant permission
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
  })

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}
