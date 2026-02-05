import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    try {
                        // 1. Login to get token
                        const loginRes = await fetch('http://localhost:8001/api/v1/users/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password }),
                        });

                        if (!loginRes.ok) {
                            console.log('Login failed:', loginRes.status, await loginRes.text());
                            return null;
                        }

                        const tokenData = await loginRes.json();
                        const token = tokenData.access_token;

                        // 2. Get User Details
                        const userRes = await fetch('http://localhost:8001/api/v1/users/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (!userRes.ok) {
                            console.log('User fetch failed:', userRes.status);
                            return null;
                        }

                        const userData = await userRes.json();

                        // Return user object
                        return {
                            id: userData.id.toString(),
                            name: userData.full_name,
                            email: userData.email,
                            accessToken: token, // Pass token to jwt callback
                        };

                    } catch (error) {
                        console.error('Auth error:', error);
                        return null;
                    }
                }

                console.log('Invalid credentials format');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    session: {
        maxAge: 3600, // 1 hour to match backend token expiration
    },

});
