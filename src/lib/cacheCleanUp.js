import { clearAllS3Caches } from '@/hooks/useS3Asset';
import { useEffect } from 'react';

export const CacheCleanup = ({ paths = ['/'] }) => {
  useEffect(() => {
    const shouldCleanup = paths.some(path => 
      window.location.pathname === path || 
      (path === '/' && window.location.pathname === '')
    );
    
    if (shouldCleanup) {
      clearAllS3Caches();
      
      localStorage.removeItem('isGuestUser');
    }
  }, [paths]);
  
  return null;
};

export default CacheCleanup;