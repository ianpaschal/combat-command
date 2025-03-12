import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api, UpdateUserInput } from '~/api';
import { toast } from '~/components/ToastProvider';

export const useUpdateUser = () => {
  const handler = useMutation(api.users.updateUser.updateUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return {
    updateUser: async (input: UpdateUserInput) => {
      setIsLoading(true);
      try {
        await handler(input);
      } catch (error) {
        console.error(error);
        toast.error(error as string);
        setIsLoading(true);
      }
      toast.success('User profile successfully updated!');
      setIsLoading(true);
    },
    isLoading,
  };
};
