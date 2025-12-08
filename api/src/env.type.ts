import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

export enum NodeEnv {
  dev = 'development',
  prod = 'production',
}

export const env: Record<string, string> = process.env as Record<
  string,
  string
>;

// env.MONGO_URI = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`
env.MONGO_URI = `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`;

export interface IEnv {
  NODE_ENV: NodeEnv;
  PORT: string;

  BCRYPT_SALT_ROUNDS: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  DATABASE_URL: string;

  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
}
