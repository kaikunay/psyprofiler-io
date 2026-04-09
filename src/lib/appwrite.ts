import { Client, Databases, Account, ID } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

client
    .setEndpoint(endpoint)
    .setProject(projectId);

// Debug: Log to see if variables are being loaded securely (don't log full secrets, just existence)
console.log(`[Appwrite Init] Endpoint: ${endpoint}, ProjectID length: ${projectId.length}`);

export const databases = new Databases(client);
export const account = new Account(client);
export { ID };
