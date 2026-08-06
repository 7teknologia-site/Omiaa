/**
 * Cache Service with Stale-While-Revalidate (SWR) & Request Deduplication
 * Prevents Supabase 429 "Rate exceeded" errors by caching query results
 * in memory & localStorage while revalidating seamlessly in the background.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL in milliseconds
}

// In-memory cache
const memoryCache = new Map<string, CacheEntry<any>>();

// In-flight request map for request deduplication
const inFlightRequests = new Map<string, Promise<any>>();

const CACHE_PREFIX = 'omiaa_swr_cache_v1_';

/**
 * Retrieve cached value from memory or localStorage
 */
function getCached<T>(key: string): CacheEntry<T> | null {
  // 1. Check memory cache first
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as CacheEntry<T>;
  }

  // 2. Check localStorage
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (item) {
      const entry: CacheEntry<T> = JSON.parse(item);
      memoryCache.set(key, entry); // populate memory
      return entry;
    }
  } catch (err) {
    // LocalStorage error fallback
  }

  return null;
}

/**
 * Store value in memory & localStorage
 */
function setCached<T>(key: string, data: T, ttl: number): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl
  };

  memoryCache.set(key, entry);

  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (err) {
    // Ignore quota exceeded or storage disabled
  }
}

/**
 * Execute query with SWR strategy and request deduplication.
 * @param key Unique query key
 * @param fetcher Promise-returning fetch function
 * @param options.ttl TTL in ms (default 60_000ms = 1 min)
 * @param options.forceRefresh Skip cache and force network request
 */
export async function swrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; forceRefresh?: boolean } = {}
): Promise<T> {
  const ttl = options.ttl ?? 60_000; // Default 1 minute
  const cached = getCached<T>(key);
  const now = Date.now();

  // If forceRefresh is false and we have fresh cached data, return immediately
  if (!options.forceRefresh && cached) {
    const isFresh = now - cached.timestamp < cached.ttl;

    if (isFresh) {
      return cached.data;
    }

    // Data is stale: Return cached data instantly to UI, but revalidate in background
    revalidateInBackground(key, fetcher, ttl);
    return cached.data;
  }

  // No cache or forceRefresh requested: Fetch from network (deduplicated)
  return executeWithDeduplication(key, fetcher, ttl);
}

/**
 * Executes fetcher with request deduplication so multiple simultaneous calls share a single Promise.
 */
async function executeWithDeduplication<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const result = await fetcher();
      if (result !== null && result !== undefined) {
        setCached(key, result, ttl);
      }
      return result;
    } catch (err) {
      console.warn(`SWR fetch error for [${key}]:`, err);
      // If error occurs, try to fallback to cached value even if expired
      const expiredCache = getCached<T>(key);
      if (expiredCache) {
        return expiredCache.data;
      }
      throw err;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * Revalidate stale data quietly in background without blocking UI
 */
function revalidateInBackground<T>(key: string, fetcher: () => Promise<T>, ttl: number): void {
  // If already revalidating, do nothing
  if (inFlightRequests.has(key)) return;

  executeWithDeduplication(key, fetcher, ttl).catch((err) => {
    console.warn(`Background revalidation failed for [${key}] (Gracefully handled):`, err);
  });
}

/**
 * Invalidate specific cache key or prefix
 */
export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    memoryCache.clear();
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {}
    return;
  }

  // Clear matching keys
  memoryCache.forEach((_, k) => {
    if (k.startsWith(keyPrefix)) {
      memoryCache.delete(k);
    }
  });

  try {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(CACHE_PREFIX) && k.includes(keyPrefix)) {
        localStorage.removeItem(k);
      }
    });
  } catch (e) {}
}
