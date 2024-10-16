// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { isPlainObject } from 'is-what';

/**
 * Create copies of objects, arrays, and DOM nodes.
 */
export function copy(target) {
  if (Array.isArray(target)) return target.map((i) => copy(i));
  if (target instanceof Node) return target.cloneNode(true);
  if (!isPlainObject(target)) return target;
  return Object.keys(target).reduce((carry, key) => {
    const val = target[key];
    carry[key] = copy(val);
    return carry;
  }, {});
}
