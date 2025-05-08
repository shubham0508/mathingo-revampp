import { useState, useEffect } from 'react';

const CACHE_DURATION = 24 * 60 * 60 * 1000;
const CACHE_KEY_PREFIX = 's3_asset_';
const assetCache = new Map();
const pendingRequests = new Map();

export const useS3Asset = (fileUrl, preserveCache = false) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearCache = () => {
    if (fileUrl) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${fileUrl}`);
      assetCache.delete(fileUrl);
      setUrl(null);
    }
  };

  useEffect(() => {
    const cleanupExpiredCache = () => {
      const now = Date.now();
      let keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (item && item.expires && item.expires < now) {
              keysToRemove.push(key);
            }
          } catch (e) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    };

    cleanupExpiredCache();
  }, []);

  useEffect(() => {
    if (!preserveCache && fileUrl) {
      const handleCleanup = () => {
        clearCache();
      };

      window.addEventListener('beforeunload', handleCleanup);

      return () => {
        window.removeEventListener('beforeunload', handleCleanup);
      };
    }
  }, [fileUrl, preserveCache]);

  useEffect(() => {
    if (!fileUrl) {
      setUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    const cacheKey = `${CACHE_KEY_PREFIX}${fileUrl}`;

    const fetchAsset = async () => {
      try {
        const storedData = localStorage.getItem(cacheKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.expires > Date.now()) {
            setUrl(parsedData.url);
            setLoading(false);
            setError(null);      
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }

      const cachedData = assetCache.get(fileUrl);
      if (cachedData && cachedData.expires > Date.now()) {
        setUrl(cachedData.url);
        setLoading(false);
        setError(null);  
        return;
      }

      if (pendingRequests.has(fileUrl)) {
        try {
          const pendingUrl = await pendingRequests.get(fileUrl);
          if (isMounted) {
            setUrl(pendingUrl);
            setLoading(false);
            setError(null);      
          }
        } catch (err) {
          if (isMounted) setError(err.message || 'Failed to fetch asset');
        }
        return;
      }

      setLoading(true);
      setError(null);

      const fetchPromise = fetch('/api/s3/getSignedUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch signed URL');
          }
          const { signedUrl } = await response.json();

          const expiresAt = Date.now() + CACHE_DURATION;

          const cacheData = { url: signedUrl, expires: expiresAt };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));

          assetCache.set(fileUrl, cacheData);

          if (isMounted) setUrl(signedUrl);
          return signedUrl;
        })
        .catch((err) => {
          if (isMounted) setError(err.message || 'Failed to fetch asset');
          throw err;
        })
        .finally(() => {
          pendingRequests.delete(fileUrl);
          if (isMounted) setLoading(false);
        });

      pendingRequests.set(fileUrl, fetchPromise);

      try {
        await fetchPromise;
      } catch {}
    };

    fetchAsset();

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  return { url, loading, error, clearCache };
};

export const clearAllS3Caches = () => {
  assetCache.clear();

  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

export const setupLandingPageCleanup = () => {
  if (typeof window !== 'undefined') {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      clearAllS3Caches();
    }
  }
};
