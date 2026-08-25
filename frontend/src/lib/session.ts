import { cookies } from 'next/headers'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_user_id')?.value

  if (!userId) {
    return null
  }

  const result = await db.select().from(users).where(eq(users.id, userId))

  if (result.length === 0) {
    return null
  }

  return result[0]
}