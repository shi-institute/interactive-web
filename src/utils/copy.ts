import { isPlainObject } from 'is-what';

/**
 * Creates a deep copy of the given target.
 *
 * @template T
 * @param {T} target - The target to copy. Can be an array, a DOM node, or a plain object.
 * @returns {T} - A deep copy of the target, with the same type as the input.
 */
export function copy<T>(target: T): T {
  if (Array.isArray(target)) {
    return target.map((item) => copy(item)) as T;
  }

  if (target instanceof Node) {
    return target.cloneNode(true) as T;
  }

  if (!isPlainObject(target)) {
    return target;
  }

  return Object.keys(
    target as {
      [key in string | number | symbol]: unknown;
    }
  ).reduce((carry, key) => {
    const typedKey = key as keyof typeof target;
    carry[typedKey] = copy(target[typedKey]);
    return carry;
  }, {} as typeof target);
}
