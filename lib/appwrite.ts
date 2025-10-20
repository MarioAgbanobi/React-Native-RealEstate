import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';

export const config = {
    Platform: 'com.aime.realesteem',
    ProjectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    Endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
};

export const client = new Client();

client
    .setEndpoint(config.Endpoint!)
    .setProject(config.ProjectId!)
    .setPlatform(config.Platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

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
        user.name || "User"
      )}&project=${config.ProjectId}`;

            // console.log(userAvatar)

            return {
                $id: user.$id,
                name: user.name,
                email: user.email,
                avatar: userAvatar.toString(),
            };
        }

        return null;
        
    } catch (error) {
        // Check if it's the "guests" scope error - this means user is not logged in
        if (error instanceof Error && error.message.includes('guests')) {
            console.log('User not authenticated');
            return null;
        }
        
        console.error('Get current user error:', error);
        return null;
    }
}