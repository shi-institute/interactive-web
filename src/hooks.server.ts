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

const forwardedHeaderHandler = (async ({ event, resolve }) => {
  const xForwardedFor = event.request.headers.get('X-Forwarded-For');
  const xForwardedHost = event.request.headers.get('X-Forwarded-Host');
  const xForwardedProto = event.request.headers.get('X-Forwarded-Proto');
  const xShiForwardedHost = event.request.headers.get('X-Shi-Forwarded-Host'); // vercel overrides X-Forwarded-Host and Forwarded headers, so we use a custom header to capture Shi's reverse proxy host when deployed on Vercel
  const xShiForwardedProto = event.request.headers.get('X-Shi-Forwarded-Proto');
  const forwarded = event.request.headers.get('Forwarded');
  const forwardedFor = forwarded?.match(/for=([^;]+)/)?.[1] ?? xForwardedFor;
  const forwardedHost =
    xShiForwardedHost ?? forwarded?.match(/host=([^;]+)/)?.[1] ?? xForwardedHost;
  const forwardedProto =
    (xShiForwardedHost ? xShiForwardedProto : undefined) ??
    forwarded?.match(/proto=([^;]+)/)?.[1] ??
    xForwardedProto;

  if (forwardedFor) {
    event.locals.forwardedFor = forwardedFor;
  }
  if (forwardedHost) {
    event.locals.forwardedHost = forwardedHost;
  }
  if (forwardedProto) {
    event.locals.forwardedProto = forwardedProto;
  }

  if (
    trustedOrigins.includes(`https://${forwardedHost}`) ||
    trustedOrigins.includes(`http://${forwardedHost}`)
  ) {
    event.url = new URL(
      event.url.href.replace(event.url.origin, `${forwardedProto || 'https'}://${forwardedHost}`)
    );
  }

  return resolve(event);
}) satisfies Handle;

export const handle = sequence(csrfHandler, forwardedHeaderHandler, sessionHandler);
