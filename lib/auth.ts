import { betterAuth } from 'better-auth';
import { db } from '../db/db';

export const auth = betterAuth({
  database: {
    db: db,
    type: 'postgres',
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    cookiePrefix: 'oessa',
  },
});
