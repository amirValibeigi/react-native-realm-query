export function schemaToId(schema: string) {
  return schema.replace(/(ies)\b/g, 'y_id').replace(/(s)\b/g, '_id');
}
export function schemaToTitle(schema: string) {
  return schema.replace(/(ies)\b/g, 'y').replace(/(s)\b/g, '');
}
