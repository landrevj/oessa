import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE OR REPLACE FUNCTION touch_updated_at_timestamp()
    RETURNS TRIGGER AS $$
      BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
      END;
    $$ language 'plpgsql';
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP FUNCTION touch_updated_at_timestamp`.execute(db);
}
