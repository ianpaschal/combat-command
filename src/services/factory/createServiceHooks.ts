import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import * as changeCase from 'change-case';
import qs from 'qs';

import { toast } from '~/components/ToastProvider';
import { getAuthHeaders } from '~/services/factory/getAuthHeaders';
import { handleResponse } from '~/services/factory/handleResponse';
import { handleError as onError } from '~/services/handleError';

/**
 * 
 * @param resourceName - The resource name in kebab case (used to create the request URL)
 * @returns 
 */
export const createServiceHooks = <Resource extends { id: string }, FetchParams extends object, CreateInput extends object>(resourceName: string) => {
  type UpdateInput = Omit<Resource, 'created_at' | 'updated_at'>;
   
  type CreateServiceHooksResult = {
    useFetch: (id: string) => UseQueryResult<Resource, Error>;
    useFetchList: (params?: FetchParams) => UseQueryResult<Resource[], Error>;
    useCreate: () => UseMutationResult<Resource | Resource[], Error, CreateInput | CreateInput[], unknown>;
    useUpdate: () => UseMutationResult<Resource, Error, UpdateInput, unknown>;
    useDelete: () => UseMutationResult<null, Error, string, unknown>;
  };
  
  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${resourceName}`;
  return {
    useFetch: (id: string) => useQuery({
      queryKey: [resourceName, 'single', id],
      queryFn: async () => {
        const response = await fetch(`${baseUrl}/${id}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        return handleResponse<Resource>(response);
      },
      enabled: !!id,
    }),

    useFetchList: (params?: FetchParams) => useQuery({
      queryKey: [resourceName, 'list', params],
      queryFn: async () => {
        const response = await fetch(`${baseUrl}?${qs.stringify(params)}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        return handleResponse<Resource[]>(response);
      },
    }),

    useCreate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (data: CreateInput | CreateInput[]) => {
          const response = await fetch(baseUrl, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
          });
          return handleResponse<Resource | Resource[]>(response);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resourceName, 'list'] });
          toast.success(`${changeCase.sentenceCase(resourceName)} created!`);
        },
        onError,
      });
    },
  
    useUpdate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, ...data }: UpdateInput) => {
          const response = await fetch(`${baseUrl}/${id}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
          });
          return handleResponse<Resource>(response);
        },
        onSuccess: (id) => {
          queryClient.invalidateQueries({ queryKey: [resourceName, 'list'] });
          queryClient.invalidateQueries({ queryKey: [resourceName, 'single', id] });
          toast.success(`${changeCase.sentenceCase(resourceName)} updated!`);
        },
        onError,
      });
    },

    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (id: string) => {
          const response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          return handleResponse<null>(response);
        },
        onSuccess: (id) => {
          queryClient.invalidateQueries({ queryKey: [resourceName, 'list'] });
          queryClient.invalidateQueries({ queryKey: [resourceName, 'single', id] });
          toast.success(`${changeCase.sentenceCase(resourceName)} deleted!`);
        },
        onError,
      });
    },
  } as CreateServiceHooksResult;
};
