import { error, fail, redirect } from '@sveltejs/kit';
import { scopePasswords } from '../../../passwords';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ url }) => {
  const scopes = url.searchParams.getAll('scope');
  const appName = url.searchParams.get('appName');
  const from = url.searchParams.get('from');

  if (scopes.length === 0) {
    throw error(500, 'There should be at least one scope.');
  }
  if (!from) {
    throw error(500, 'Expected to find `from`.');
  }

  const requestEmailDomain = 'furman.edu';
  const requestEmailAddress = 'shi.institute';
  const requestEmailTag = scopes[0] || 'unknown1';
  const requestEmailTagModifier = ((): string => {
    if (scopes[0] === 'application__rural_change_diagnostic_screen') return '_1';
    return '_0';
  })();

  return {
    scopes,
    appName,
    requestEmail: `${requestEmailAddress}+${requestEmailTag}${requestEmailTagModifier}@${requestEmailDomain}`,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, url, locals }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString() || '';
    const password = data.get('password')?.toString() || '';

    function ensureUsernameIsInScope(username: string) {
      if (!Object.keys(scopePasswords).includes(username)) {
        throw error(400, 'Username/scope is not valid');
      }
      return username as keyof typeof scopePasswords;
    }
    const scope = ensureUsernameIsInScope(username);

    await setScopePasswordGuess(locals, scope, password);
    const valid = verifyScope(locals, scope);

    if (valid) {
      throw redirect(303, url.searchParams.get('from') || '');
    }
    return fail(400, { incorrectPassword: true });
  },
} satisfies Actions;

async function setScopePasswordGuess(
  locals: App.Locals,
  scope: keyof typeof scopePasswords,
  guess: string
) {
  await locals.session.set({
    ...locals.session.data,
    scopeGuesses: {
      ...(locals.session.data.scopeGuesses || {}),
      [scope]: guess,
    },
  });
}

function verifyScope(locals: App.Locals, scope: keyof typeof scopePasswords) {
  const guess = locals.session.data.scopeGuesses[scope];

  return guess === scopePasswords[scope];
}

export function _calculateAuthScopes(locals: App.Locals) {
  const authScopes = Object.fromEntries(
    Object.keys(locals.session.data.scopeGuesses || {}).map((_scope) => {
      const scope = _scope as keyof typeof scopePasswords;
      const valid = verifyScope(locals, scope);
      return [scope, valid] as const;
    })
  );
  return authScopes as Record<keyof typeof scopePasswords, boolean>;
}

function gotoAuthPage(url: URL, scope: keyof typeof scopePasswords, appName?: string) {
  throw redirect(
    302,
    `/research/authenticate?scope=${scope}${
      appName ? `&appName=${appName}` : ''
    }&from=${encodeURIComponent(url.href)}`
  );
}

interface EnsureAuthenticationProps {
  session: App.Locals['session']['data'];
  url: URL;
  scope: keyof typeof scopePasswords;
  appName?: string;
}

export function _ensureAuthentication({ session, url, scope, appName }: EnsureAuthenticationProps) {
  if (session.authScopes[scope] !== true) {
    gotoAuthPage(url, scope, appName);
  }
}
