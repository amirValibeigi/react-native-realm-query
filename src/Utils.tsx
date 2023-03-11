export function schemaToId(schema: string) {
  return schema.replace(/(ies)\b/g, 'y_id').replace(/(s)\b/g, '_id');
}
