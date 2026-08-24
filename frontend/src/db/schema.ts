import { pgTable, uuid, text, real, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  spotifyId: text('spotify_id').notNull().unique(),
  displayName: text('display_name'),
  email: text('email'),
  refreshToken: text('refresh_token').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const savedPlaylists = pgTable('saved_playlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  playlistId: text('playlist_id').notNull(),
  playlistName: text('playlist_name').notNull(),
  playlistCreator: text('playlist_creator'),
  compatibilityScore: real('compatibility_score'),
  savedAt: timestamp('saved_at').defaultNow(),
})
