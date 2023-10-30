import { AnyObjectSchema } from 'yup';

export function mergeValidationSchemas(...schemas: AnyObjectSchema[]) {
  const [firstSchema, ...rest] = schemas;

  return rest.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    firstSchema,
  );
}
