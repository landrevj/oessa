import {
  createUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  withTimestamps,
} from '~/utils/db/timestamps';
import type { Kysely } from 'kysely';
import { withUuidPrimaryKey } from '~/utils/db/uuid';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('commentable')
    .$call(withUuidPrimaryKey)
    .execute();

  await db.schema
    .createTable('group')
    .addColumn('id', 'uuid', (col) =>
      col
        .notNull()
        .primaryKey()
        .references('commentable.id')
        .onDelete('cascade'),
    )
    .$call(withTimestamps)
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('image', 'text')
    .execute();

  await db.schema
    .createTable('group_user')
    .addColumn('group_id', 'uuid', (col) =>
      col.notNull().references('group.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('user.id').onDelete('cascade'),
    )
    .$call(withTimestamps)
    .addPrimaryKeyConstraint('group_user_primary_key', ['group_id', 'user_id'])
    .execute();

  await createUpdatedAtTrigger(db, 'group');
  await createUpdatedAtTrigger(db, 'group_user');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'group_user');
  await dropUpdatedAtTrigger(db, 'group');
  await db.schema.dropTable('group_user').execute();
  await db.schema.dropTable('group').execute();
  await db.schema.dropTable('commentable').execute();
}
