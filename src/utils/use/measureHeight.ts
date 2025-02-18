import { browser } from '$app/environment';
import { onDestroy } from 'svelte';

/**
 * Measure the height of a node.
 */
export function measureHeight(
  node: HTMLElement,
  {
    maxAttempts = 100,
    intervalTime = 100,
    callback,
  }: { maxAttempts?: number; intervalTime?: number; callback: (height: number) => void }
) {
  if (!browser) return;

  let interval: number;
  let attempts = 0;

  const checkHeight = () => {
    if (node.clientHeight > 0 || attempts >= maxAttempts) {
      clearInterval(interval);
      callback(node.clientHeight);
    }
    attempts++;
  };

  interval = setInterval(checkHeight, intervalTime);

  onDestroy(() => clearInterval(interval));
}
