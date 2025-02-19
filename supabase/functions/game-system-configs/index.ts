import { createRequestHandler } from '../_shared/createRequestHandler.ts';

const tableName = 'game_system_configs';
const url = tableName.replace('_', '-');

Deno.serve(createRequestHandler(url, {
  fetchSingle: async (client, id) => {
    const result = await client.from(tableName).select('*').eq('id', id).single();
    return result;
  },
  fetchList: async (client) => {
    const result = await client.from(tableName).select('*');
    return result;
  },
  createSingle: async (client, input) => {
    const result = await client.from(tableName).insert(input).select().single();
    return result;
  },
  createBulk: async (client, input) => {
    const result = await client.from(tableName).insert(input).select();
    return result;
  },
  update: async (client, { id, ...input }) => {
    const result = await client.from(tableName).update(input).eq('id', id).select().single();
    return result;
  },
  delete: async (client, id) => {
    const result = await client.from(tableName).delete().eq('id', id);
    return result;
  },
}));
