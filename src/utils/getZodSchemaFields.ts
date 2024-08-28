import type { ZodSchema } from 'zod';

/**
 * Returns the fields of a Zod schema. Only works on flat schemas.
 * Does not work for arrays of objects.
 *
 * Adapted from https://stackoverflow.com/a/77832557
 */
export function getZodSchemaFieldsShallow(schema: ZodSchema) {
  const fields: Record<string, true> = {};
  const proxy = new Proxy(fields, {
    get(_, key) {
      if (key === 'then' || typeof key !== 'string') {
        return;
      }
      fields[key] = true;
    },
  });
  schema.safeParse(proxy);
  return Object.keys(fields);
}

type ZodSchemaFields = { [K: string]: ZodSchemaFields | true };
type DirtyZodSchemaFields = { [K: string]: DirtyZodSchemaFields };

const _proxyHandler = {
  get(fields: DirtyZodSchemaFields, key: string | symbol) {
    if (key === 'then' || typeof key !== 'string') {
      return;
    }
    if (!fields[key]) {
      fields[key] = new Proxy({}, _proxyHandler);
    }
    return fields[key];
  },
};

function _clean(fields: DirtyZodSchemaFields) {
  const cleaned: ZodSchemaFields = {};
  Object.keys(fields).forEach((k) => {
    const val = fields[k];
    cleaned[k] = Object.keys(val).length ? _clean(val) : true;
  });
  return cleaned;
}

/**
 * Returns the fields of a Zod schema.
 * Does not work for arrays of objects.
 *
 * For a flat schema, use getZodSchemaFieldsShallow instead.
 *
 * Adapted from https://stackoverflow.com/a/77832557
 */
export function getZodSchemaFields(schema: ZodSchema): ZodSchemaFields {
  const fields = {};
  schema.safeParse(new Proxy(fields, _proxyHandler));
  return _clean(fields);
}
