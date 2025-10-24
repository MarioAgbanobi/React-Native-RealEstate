import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import {
  Account,
  Avatars,
  Client,
  OAuthProvider,
  Query,
  TablesDB,
} from 'react-native-appwrite';

// Configuration
export const config = {
  Platform: 'com.aime.realesteem',
  ProjectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  Endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentsId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_TABLE_ID,
  galleriesId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_TABLE_ID,
  propertiesId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID,
  reviewsId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID,
};

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(config.Endpoint!)
  .setProject(config.ProjectId!)
  .setPlatform(config.Platform!);

// Initialize services
export const avatar = new Avatars(client);
export const account = new Account(client);
export const tablesDB = new TablesDB(client);

//
// ──────────────────────────────────────────────
//   Authentication
// ──────────────────────────────────────────────
//
export async function login() {
  try {
    const redirectUri = Linking.createURL('/');
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri,
      redirectUri
    );

    if (!response) throw new Error('Failed to login with Google');

    const browserResult = await WebBrowser.openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== 'success') throw new Error('Login cancelled');

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get('secret');
    const userId = url.searchParams.get('userId');

    if (!secret || !userId) throw new Error('Failed to retrieve user credentials');

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error('Failed to create session');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();

    if (user && user.$id) {
      const userAvatar = `${config.Endpoint}/avatars/initials?name=${encodeURIComponent(
        user.name || 'User'
      )}&project=${config.ProjectId}`;

      return {
        ...user,
        avatar: userAvatar,
      };
    }

    return null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('guests')) {
      console.log('User not authenticated');
      return null;
    }

    console.error('Get current user error:', error);
    return null;
  }
}

//
// ──────────────────────────────────────────────
//   Tables API (Properties Table)
// ──────────────────────────────────────────────
//

// Get latest 5 properties
export async function getLatestProperties() {
  try {
    const result = await tablesDB.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesId!,
      queries: [Query.orderDesc('$createdAt'), Query.limit(5)],
    });

    return result.rows;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Filtered search
export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const queries = [Query.orderDesc('$createdAt')];

    if (filter && filter !== 'All') {
      queries.push(Query.equal('type', [filter]));
    }

    if (query) {
      queries.push(
        Query.or([
          Query.search('name', query),
          Query.search('address', query),
          Query.search('type', query),
        ])
      );
    }

    if (limit) queries.push(Query.limit(limit));

    const result = await tablesDB.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesId!,
      queries,
    });

    return result.rows;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Single property by ID
export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await tablesDB.getRow({
      databaseId: config.databaseId!,
      tableId: config.propertiesId!,
      rowId: id,
    });
    return result;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}
