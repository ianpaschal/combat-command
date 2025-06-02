export type MutationHookConfig = {
  onSuccess?: (id?: string) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
};
