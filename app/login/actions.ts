'use server';

import { createClient } from '@/utils/supabase/server'; // Asegúrate que esta ruta sea correcta
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient(cookies());

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error logging in:', error.message);
    // Puedes manejar el error de forma más elegante aquí, quizás mostrando un mensaje al usuario
    redirect('/login?message=Could not authenticate user');
  }

  redirect('/'); // Redirige a la página principal después de un login exitoso
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient(cookies());

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`, // Asegúrate de configurar NEXT_PUBLIC_SITE_URL en .env.local
    },
  });

  if (error) {
    console.error('Error signing up:', error.message);
    redirect('/login?message=Could not create user');
  }

  redirect('/login?message=Check email to continue sign in process'); // Informa al usuario que revise su correo
}