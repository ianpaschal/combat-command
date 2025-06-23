'use node';

import { Infer, v } from 'convex/values';

import { api, internal } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';

export const setUserDefaultAvatarArgs = v.object({
  userId: v.id('users'),
});

export const setUserDefaultAvatar = async (
  ctx: ActionCtx,
  args: Infer<typeof setUserDefaultAvatarArgs>,
): Promise<void> => {
  const user = await ctx.runQuery(api.users.getUser, {
    id: args.userId,
  });
  if (!user || !!user.avatarStorageId) {
    return;
  }

  // Fetch avatar
  const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${args.userId}&scale=75`;
  const avatarResponse = await fetch(avatarUrl);
  if (!avatarResponse.ok) {
    throw new Error('Failed to fetch avatar');
  }
  const svg = await avatarResponse.arrayBuffer();

  // Upload avatar
  const uploadUrl = await ctx.storage.generateUploadUrl();
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'image/svg+xml' },
    body: svg,
  });
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload avatar to storage');
  }
  const { storageId: avatarStorageId } = await uploadResponse.json();
    
  // Update the user profile document with the new avatar
  await ctx.runMutation(internal.users.updateUserAvatarNoAuth, {
    userId: args.userId,
    avatarStorageId,
  });
};
