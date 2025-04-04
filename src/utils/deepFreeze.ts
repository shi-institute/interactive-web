import { isPlainObject } from 'is-what';

export function deepFreeze<T extends object>(obj: T) {
  const propNames = Object.getOwnPropertyNames(obj);

  for (const name of propNames) {
    // @ts-expect-error
    const value = obj[name];

    if (isPlainObject(value) && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}
