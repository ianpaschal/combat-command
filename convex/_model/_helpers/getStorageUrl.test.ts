import {
  describe,
  expect,
  it,
  Mock,
  vi,
} from 'vitest';

import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getStorageUrl } from './getStorageUrl';

describe.skip('getStorageUrl', () => {
  const mockCtx = {
    storage: {
      getUrl: vi.fn(),
    },
  } as unknown as QueryCtx;

  const mockId: Id<'_storage'> = 'mock-id' as Id<'_storage'>;

  it('should return undefined if id is null', async () => {
    const result = await getStorageUrl(mockCtx, null);
    expect(result).toBeUndefined();
    expect(mockCtx.storage.getUrl).not.toHaveBeenCalled();
  });

  it('should return undefined if id is undefined', async () => {
    const result = await getStorageUrl(mockCtx, undefined);
    expect(result).toBeUndefined();
    expect(mockCtx.storage.getUrl).not.toHaveBeenCalled();
  });

  it('should return the URL if storage.getUrl resolves with a URL', async () => {
    const mockUrl = 'https://example.com/mock-url';
    (mockCtx.storage.getUrl as Mock).mockResolvedValueOnce(mockUrl);

    const result = await getStorageUrl(mockCtx, mockId);
    expect(result).toBe(mockUrl);
    expect(mockCtx.storage.getUrl).toHaveBeenCalledWith(mockId);
  });

  it('should return undefined if storage.getUrl resolves with null', async () => {
    (mockCtx.storage.getUrl as Mock).mockResolvedValueOnce(null);

    const result = await getStorageUrl(mockCtx, mockId);
    expect(result).toBeUndefined();
    expect(mockCtx.storage.getUrl).toHaveBeenCalledWith(mockId);
  });
});
