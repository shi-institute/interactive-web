import type { Session } from 'svelte-kit-cookie-session';
import type { scopePasswords } from './passwords';

type SessionData = {
  counter: number;
  scopeGuesses: Record<keyof typeof scopePasswords, string>;
  authScopes: Record<keyof typeof scopePasswords, boolean>;
};

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: Session<SessionData>;
    }
    interface PageData {
      // can add any properties here, return it from your root layout
      session: SessionData;
    }
    // interface Platform {}
  }

  interface Window {
    // add your own properties here
    forceColorScheme?: (mode: 'light' | 'dark' | 'auto', _window?: Window) => void;
  }
}

export {};
