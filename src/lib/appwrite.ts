import { Client, Databases, Account, Storage, ID } from 'appwrite';

const client = new Client();

// Hardcoded — these are constants, NOT environment-dependent.
// Using env vars for these caused Vercel builds to silently use wrong defaults.
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'psy-profiler-backend';

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { client, ID };
