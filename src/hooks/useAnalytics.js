import { useCallback } from 'react';


export const useAnalytics = () => {
  const logEvent = useCallback((action, payload = null) => {
   
    console.log(`[Analytics] ${action}`, payload || '');
  }, []);

  return { logEvent };
};
