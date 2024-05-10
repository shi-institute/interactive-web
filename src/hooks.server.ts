import { COOKIE_SESSION_SECRET } from '$env/static/private';
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

export const handle = sequence(sessionHandler);
