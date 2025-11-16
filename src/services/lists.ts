import { api } from '~/api';
import {
  createActionHook,
  createMutationHook,
  createQueryHook,
} from '~/services/utils';

// Basic Queries
export const useGetList = createQueryHook(api.lists.getList);

// Basic (C_UD) Mutations
export const useCreateList = createMutationHook(api.lists.createList);

// Actions
export const useImportList = createActionHook(api.lists.importList);
export const useExtractListData = createActionHook(api.lists.extractListData);
