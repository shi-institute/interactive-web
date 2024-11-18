import { COOKIE_SESSION_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleSession } from 'svelte-kit-cookie-session';
import { redirects } from './redirects';

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

// process a list of redirects
const redirectHandler: Handle = async ({ event, resolve }) => {
  const { url } = event;
  const path = url.pathname;

  // if there is a redirect for the current path, follow it
  if (redirects[path]) {
    throw redirect(302, redirects[path]);
  }

  // If no redirect, continue with normal page rendering
  return resolve(event);
};

export const handle = sequence(redirectHandler, sessionHandler);
