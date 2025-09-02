import { api } from '~/api';
import { createQueryHook } from '~/services/utils';

export const useGetPhoto = createQueryHook(api.photos.getPhoto);
