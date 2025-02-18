import { browser } from '$app/environment';
import { onDestroy } from 'svelte';

/**
 * Measure the width of a node.
 */
export function measureWidth(
  node: HTMLElement,
  {
    maxAttempts = 100,
    intervalTime = 100,
    callback,
  }: { maxAttempts?: number; intervalTime?: number; callback: (width: number) => void }
) {
  if (!browser) return;

  let interval: number;
  let attempts = 0;

  const checkWidth = () => {
    if (node.clientWidth > 0 || attempts >= maxAttempts) {
      clearInterval(interval);
      callback(node.clientWidth);
    }
    attempts++;
  };

  interval = setInterval(checkWidth, intervalTime);

  onDestroy(() => clearInterval(interval));
}
