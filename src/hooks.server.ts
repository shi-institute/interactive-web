import { COOKIE_SESSION_SECRET } from '$env/static/private';
import { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleSession } from 'svelte-kit-cookie-session';

const sessionHandler = handleSession(
  {
    secret: [{ id: 1, secret: COOKIE_SESSION_SECRET }],
    expires: 60,
    expires_in: 'minutes',
  },
  ({ event, resolve }) => {
    return resolve(event);
  }
);

// manual implementation of CSRF protection for form submissions that
// permits cross-origin requests from trusted origins but forbids
// cross-origin form submissions from untrusted origins
const trustedOrigins = [
  'https://shi.institute',
  'https://interactive-web.shi.institute',
  'http://localhost:5173',
  'http://localhost:8787',
];
const csrfHandler = (async ({ event, resolve }) => {
  const origin = event.request.headers.get('origin');
  const contentType = event.request.headers.get('content-type');

  if (
    event.request.method !== 'GET' &&
    ['application/x-www-form-urlencoded', 'multipart-form-data', 'text/plain'].some((type) =>
      contentType?.includes(type)
    )
  ) {
    if (!origin) {
      return new Response('Missing Origin header.', { status: 400 });
    }

    if (!trustedOrigins.includes(origin)) {
      return new Response(`Cross-site ${event.request.method} form submissions are forbidden.`, {
        status: 403,
      });
    }
  }

  return resolve(event);
}) satisfies Handle;

export const handle = sequence(sessionHandler, csrfHandler);
