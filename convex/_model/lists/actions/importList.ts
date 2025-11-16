/* eslint-disable @typescript-eslint/no-unused-vars */
import { Infer, v } from 'convex/values';

import { ActionCtx } from '../../../_generated/server';

export const importListArgs = v.object({
  url: v.string(),
  gameSystem: v.string(),
});

export const importList = async (
  ctx: ActionCtx,
  args: Infer<typeof importListArgs>,
): Promise<void> => {

  const url = new URL(args.url);

  // Extract basic components
  const domain = url.hostname; // "example.com"
  const protocol = url.protocol; // "https:"
  const pathname = url.pathname; // "/users/550e8400-e29b-41d4-a801-146655440000"
  const searchParams = url.searchParams; // URLSearchParams object

  // Extract path segments
  const pathSegments = url.pathname.split('/').filter(Boolean);
  // ["users", "550e8400-e29b-41d4-a801-146655440000"]

  // Extract UUID from path (if you know its position)
  const uuid = pathSegments[1];

  // Or use regex to find UUID anywhere in the path
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = url.pathname.match(uuidRegex);
  const extractedUuid = match ? match[0] : null;
  
};
