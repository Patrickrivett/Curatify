import { pgTable, uuid, text, real, timestamp } from 'drizzle-orm/pg-core' //imports functions from drizzles toolkit

export const users = pgTable('users', { //exports table named 'users'
  id: uuid('id').defaultRandom().primaryKey(), // name is id, defines columns name as 'id' and turns into random identifier, generates rando, makes first column
  spotifyId: text('spotify_id').notNull().unique(), //spotify id, string, not allowed to be null, must be unique
  displayName: text('display_name'), // display name not mandatory, only filled if provided
  email: text('email'),                // same as above ^^
  refreshToken: text('refresh_token').notNull(), //refresh token mandatory, required so that auth not required on every referesh
  createdAt: timestamp('created_at').defaultNow(), //timestamp, if nothing provided defaults to the current time
})

export const savedPlaylists = pgTable('saved_playlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id), // makes this a relational database, each playlist must belong to one user, must exist in other database
  playlistId: text('playlist_id').notNull(),
  playlistName: text('playlist_name').notNull(),
  playlistCreator: text('playlist_creator'),
  compatibilityScore: real('compatibility_score'), //real number
  savedAt: timestamp('saved_at').defaultNow(),
})