import { type Kysely, sql } from 'kysely';
import {
  createUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  withTimestamps,
} from '~/utils/db/timestamps';
import { withUuidPrimaryKey } from '~/utils/db/uuid';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('comment')
    .$call(withUuidPrimaryKey)
    .$call(withTimestamps)
    .addColumn('parent_id', 'uuid', (col) => col.references('comment.id'))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('user.id'))
    .addColumn('title', 'text')
    .addColumn('message', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('thread')
    .$call(withTimestamps)
    .addColumn('commentable_id', 'uuid', (col) =>
      col.notNull().references('commentable.id'),
    )
    .addColumn('comment_id', 'uuid', (col) =>
      col.notNull().references('comment.id'),
    )
    .addColumn('note', 'text')
    .addColumn('default_view', 'text', (col) =>
      col.notNull().defaultTo('chronological'),
    )
    .addPrimaryKeyConstraint('thread_primary_key', [
      'commentable_id',
      'comment_id',
    ])
    .addCheckConstraint(
      'default_view_check',
      sql`default_view IN ('chronological', 'tree')`,
    )
    .execute();

  await db.schema
    .createTable('reaction')
    .$call(withTimestamps)
    .addColumn('comment_id', 'uuid', (col) =>
      col.notNull().references('comment.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('user.id'))
    .addColumn('reaction', 'text', (col) => col.notNull())
    .addPrimaryKeyConstraint('reaction_primary_key', [
      'comment_id',
      'user_id',
      'reaction',
    ])
    .execute();

  await createUpdatedAtTrigger(db, 'comment');
  await createUpdatedAtTrigger(db, 'thread');
  await createUpdatedAtTrigger(db, 'reaction');
}

export async function down(db: Kysely<any>): Promise<void> {
  await dropUpdatedAtTrigger(db, 'reaction');
  await dropUpdatedAtTrigger(db, 'thread');
  await dropUpdatedAtTrigger(db, 'comment');
  await db.schema.dropTable('reaction').execute();
  await db.schema.dropTable('thread').execute();
  await db.schema.dropTable('comment').execute();
}
