import type { Kysely } from 'kysely';
import { withUuidPrimaryKey } from '~/utils/db/schema/uuid';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .$call(withUuidPrimaryKey)
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('emailVerified', 'boolean', (col) => col.notNull())
    .addColumn('image', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('session')
    .$call(withUuidPrimaryKey)
    .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .addColumn('ipAddress', 'text')
    .addColumn('userAgent', 'text')
    .addColumn('userId', 'uuid', (col) => col.notNull().references('user.id'))
    .execute();

  await db.schema
    .createTable('account')
    .$call(withUuidPrimaryKey)
    .addColumn('accountId', 'text', (col) => col.notNull())
    .addColumn('providerId', 'text', (col) => col.notNull())
    .addColumn('userId', 'uuid', (col) => col.notNull().references('user.id'))
    .addColumn('accessToken', 'text')
    .addColumn('refreshToken', 'text')
    .addColumn('idToken', 'text')
    .addColumn('accessTokenExpiresAt', 'timestamp')
    .addColumn('refreshTokenExpiresAt', 'timestamp')
    .addColumn('scope', 'text')
    .addColumn('password', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('verification')
    .$call(withUuidPrimaryKey)
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp')
    .addColumn('updatedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('account').execute();
  await db.schema.dropTable('session').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('verification').execute();
}
