export type MutationHookConfig = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};
