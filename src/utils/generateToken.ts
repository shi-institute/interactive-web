import { hasKey } from './hasKey';

/**
 * Generates an ArcGIS REST token for access to content accessed
 * via the REST sharing endpoints.
 *
 * @param referer The base URL of the client application that will use the token.
 * @param expiration Expiration in minutes. The maximum is set my the server (the default max is 1 day or 1440 minutes)
 * @throws When the token fails to generate.
 */
export async function generateToken(
  username: string,
  password: string,
  referer: string,
  expiration = 6
) {
  const response = await fetch('https://gis.furman.edu/portal/sharing/rest/generateToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
      client: 'referer',
      referer,
      expiration: expiration.toString(),
      f: 'json', // format the response as JSON
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to make a request to generate a token.');
  }

  const data = await response.json();

  if (
    hasKey(data, 'error') &&
    typeof data.error === 'object' &&
    data.error &&
    hasKey(data.error, 'code') &&
    hasKey(data.error, 'message') &&
    hasKey(data.error, 'details')
  ) {
    throw new Error(`${data.error.message} ${data.error.details}`);
  }

  return {
    /** The generated token. */
    token: data.token as string,
    /** The expiration time of the token in milliseconds since January 1, 1970 (UTC). */
    expires: parseInt(data.expires),
    /** This property will show as `true` if the token must always pass over ssl. */
    ssl: !!data.ssl,
  };
}

/**
 * Generates an ArcGIS REST token for access to content accessed
 * via the REST sharing endpoints.
 *
 * @param referer The base URL of the client application that will use the token.
 * @param expiration Expiration in minutes. The maximum is set my the server (the default max is 1 day or 1440 minutes)
 */
export function generateTokenSafe(
  username: string,
  password: string,
  referer: string,
  expiration = 6
) {
  return generateToken(username, password, referer, expiration)
    .then((data) => {
      return { success: true as const, data };
    })
    .catch((error) => {
      return { success: false as const, error: error as Error };
    });
}
