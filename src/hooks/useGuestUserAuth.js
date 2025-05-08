import { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import authApi from '@/lib/auth-api';

export const useGuestUserAuth = () => {
  const [isEnsuring, setIsEnsuring] = useState(false);

  const ensureAuthenticated = async () => {
    setIsEnsuring(true);

    try {
      const session = await getSession();
      if (session?.user?.accessToken) return true;

      const guestToken = localStorage.getItem('guestToken');
      if (guestToken) return true;

      const guestRes = await authApi.fetchGuestToken();
      const guestTokenNew = guestRes?.access_token;
      const guestUsername = guestRes?.username ?? 'guest';

      if (!guestTokenNew) throw new Error('Guest login failed');

      localStorage.setItem('guestToken', guestTokenNew);

      const signInRes = await signIn('credentials', {
        isGuest: 'true',
        guestToken: guestTokenNew,
        username: guestUsername,
        redirect: false,
      });

      return !!signInRes?.ok;
    } catch (err) {
      console.error('Auth ensure failed:', err);
      return false;
    } finally {
      setIsEnsuring(false);
    }
  };

  return { ensureAuthenticated, isEnsuring };
};
