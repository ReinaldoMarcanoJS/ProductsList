import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primero intentar obtener el user_id de las cookies
        const cookieUserId = Cookies.get('user_id');
        
        if (cookieUserId) {
          setUserId(cookieUserId);
          setLoading(false);
          return;
        }

        // Si no hay cookie, verificar la sesión de Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userId = session.user.id;
          Cookies.set('user_id', userId, { expires: 7 });
          setUserId(userId);
        } else {
          // Si no hay sesión, limpiar la cookie
          Cookies.remove('user_id');
          setUserId(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userId = session.user.id;
          Cookies.set('user_id', userId, { expires: 7 });
          setUserId(userId);
        } else if (event === 'SIGNED_OUT') {
          Cookies.remove('user_id');
          setUserId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    Cookies.remove('user_id');
    setUserId(null);
  };

  return {
    userId,
    loading,
    signOut,
    isAuthenticated: !!userId
  };
}; 