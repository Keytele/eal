import 'server-only';

import {
  CACHE_POLICIES,
  createCacheKey,
  type CacheKeyDimensions,
  type CacheResource,
} from '@eal/domain';

export function getCacheControl(resource: CacheResource): string {
  const policy = CACHE_POLICIES[resource];
  if (policy.mode === 'no-store') {
    return 'no-store';
  }
  const visibility = policy.mode === 'private' ? 'private' : 'public';
  return `${visibility}, max-age=${policy.maxAgeSeconds}, stale-while-revalidate=${policy.staleWhileRevalidateSeconds}`;
}

export function getScopedCacheKey(resource: CacheResource, dimensions: CacheKeyDimensions): string {
  return createCacheKey(resource, dimensions);
}
