import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const ltree = await db
    .selectFrom('pg_available_extensions')
    .select('installedVersion')
    .where('name', '=', 'ltree')
    .executeTakeFirst();

  if (ltree?.installedVersion) {
    console.log('ltree already installed, skipping...');
    return;
  }

  try {
    await sql`CREATE EXTENSION ltree`.execute(db);
  } catch (error) {
    if (!ltree) {
      throw Error('Unable to find ltree in pg_available_extensions');
    }

    console.error(error);
    throw Error('Failed trying to set up ltree');
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP EXTENSION ltree`.execute(db);
}
