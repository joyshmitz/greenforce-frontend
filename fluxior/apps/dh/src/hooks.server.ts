import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import AzureADB2C from '@auth/core/providers/azure-ad-b2c';
import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';
import { setSession } from '$houdini';
import type { Handle } from '@sveltejs/kit';

export const handle = SvelteKitAuth(async (event) => {
  const authOptions: SvelteKitAuthConfig = {
    debug: false,
    trustHost: true,
    secret: env.AUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        setSession(event, { token });
        return session;
      },
      async jwt({ token, account }) {
        if (account) {
          try {
            const actorIdsResponse = await fetch(
              'https://localhost:5001/v1/MarketParticipantUser/GetUserActors',
              {
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${account.access_token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            const { actorIds } = await actorIdsResponse.json();

            if (actorIds === undefined || actorIds.length === 0)
              throw new Error('No actorIds found');

            const actorId = actorIds[0];

            const tokenResponse = await fetch(
              `https://localhost:5001/v1/Token?actorId=${actorId}`,
              {
                method: 'POST',
                body: JSON.stringify({ token: account.access_token }),
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${account.access_token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            const { token: tokenWithExtendedPermissions } = (await tokenResponse.json()) as {
              token: string;
            };
            token.accessToken = tokenWithExtendedPermissions;
          } catch (e) {
            console.error(e);
          }
        }
        return token;
      }
    },
    providers: [
      AzureADB2C({
        issuer: env.AZURE_AD_B2C_TENANT_ISSUER,
        token: env.AZURE_AD_B2C_TOKEN_ENDPOINT,
        userinfo: env.AZURE_AD_B2C_TOKEN_ENDPOINT,
        clientId: env.AZURE_AD_B2C_CLIENT_ID,
        clientSecret: env.AZURE_AD_B2C_CLIENT_SECRET,
        authorization: {
          url: env.AZURE_AD_B2C_AUTH_ENDPOINT,
          params: {
            scope: `https://devDataHubB2C.onmicrosoft.com/backend-bff/api openid profile offline_access`
          }
        }
      }) as Provider
    ]
  };
  return authOptions;
}) satisfies Handle;
