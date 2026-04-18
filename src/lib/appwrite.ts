import { Client, Databases, Account, Storage, ID } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'psy-profiler-backend';

client
    .setEndpoint(endpoint)
    .setProject(projectId);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { client, ID };
