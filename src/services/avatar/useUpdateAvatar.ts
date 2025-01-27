import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';
import { NullConversion } from '~/utils/nullsToUndefined';

export interface UpdateAvatarInput {
  userProfile: NullConversion<UserProfileSecureRow>;
  file: File;
}

const updateAvatar = async ({ userProfile, file }: UpdateAvatarInput): Promise<void> => {

  // 1. Upload file
  const extension = file.name.split('.').pop();
  const fileName = `${userProfile.user_id}_${new Date().toISOString()}.${extension}`;

  const { error: avatarUploadError } = await supabase.storage.from('avatars').upload(fileName, file);
  if (avatarUploadError) {
    throw avatarUploadError;
  }

  // 2. Update user profile
  const { error: profileUpdateError } = await supabase
    .from('user_profiles')
    .update({ avatar_url: fileName })
    .eq('user_id', userProfile.user_id);

  if (profileUpdateError) {
    throw profileUpdateError;
  }

  // 3. Delete old file
  if (userProfile.avatar_url) {
    console.log('will clean up old avatar', userProfile.avatar_url);
    const { error: avatarCleanUpError } = await supabase.storage.from('avatars').remove([userProfile.avatar_url]);
    if (avatarCleanUpError) {
      throw avatarCleanUpError;
    }
  }
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', variables.userProfile.user_id] });
    },
    onError: (error) => {
      console.error('Error updating avatar:', error);
    },
  });
};