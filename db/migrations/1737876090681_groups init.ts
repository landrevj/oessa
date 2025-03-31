import type { Kysely } from 'kysely';
import {
  createUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  withTimestamps,
} from '~/utils/db/schema/timestamps';
import { withUuidPrimaryKey } from '~/utils/db/schema/uuid';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('group')
    .$call(withUuidPrimaryKey)
    .$call(withTimestamps)
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('image', 'text')
    .execute();

  await db.schema
    .createTable('group_user')
    .addColumn('group_id', 'uuid', (col) =>
      col.notNull().references('group.id'),
    )
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('user.id'))
    .$call(withTimestamps)
    .addPrimaryKeyConstraint('primary_key', ['group_id', 'user_id'])
    .execute();

  await createUpdatedAtTrigger(db, 'group');
  await createUpdatedAtTrigger(db, 'group_user');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'group_user');
  await dropUpdatedAtTrigger(db, 'group');
  await db.schema.dropTable('group_user').execute();
  await db.schema.dropTable('group').execute();
}
