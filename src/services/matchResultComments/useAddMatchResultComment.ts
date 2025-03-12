import { useState } from 'react';
import { useMutation } from 'convex/react';

import { AddMatchResultCommentInput, api } from '~/api';
import { toast } from '~/components/ToastProvider';

export type UseAddMatchResultCommentConfig = {
  onSuccess?: () => void;
};

export const useAddMatchResultComment = (config?: UseAddMatchResultCommentConfig) => {
  const handler = useMutation(api.matchResultComments.mutations.addMatchResultComment);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return {
    addMatchResultComment: async (input: AddMatchResultCommentInput) => {
      setIsLoading(true);
      try {
        await handler(input);
      } catch (error) {
        console.error(error);
        toast.error(error as string);
        setIsLoading(true);
      }
      toast.success('Comment added!');
      setIsLoading(true);
      if (config?.onSuccess) {
        config.onSuccess();
      }
    },
    isLoading,
  };
};
