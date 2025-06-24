import { NextResponse, type NextRequest } from 'next/server';
// TODO: Make sure updateSession is exported from the correct file.
// If updateSession is the default export, use:
// import updateSession from '@/utils/supabase/middleware';
// Otherwise, ensure it is exported as a named export in '@/utils/supabase/middleware.ts'
import { updateSession } from '@/utils/supabase/middleware'; // Asegúrate que esta ruta sea correcta

export async function middleware(request: NextRequest) {
  // updateSession actualiza la sesión del usuario en las cookies
  // y retorna una respuesta para continuar el request.
  const { response, user } = await updateSession(request);

  // Define las rutas que quieres proteger
  const protectedRoutes = ['/profile', '/dashboard'];

  // Si el usuario no está autenticado y intenta acceder a una ruta protegida, redirige al login
  if (!user && protectedRoutes.includes(request.nextUrl.pathname)) {
    const redirectUrl = new URL('/login', request.url);
    // Puedes añadir un parámetro de "next" para redirigir al usuario
    // a la página que intentaba acceder después de loggearse
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si el usuario está autenticado y intenta acceder a las páginas de login/registro, redirige a la página principal
  const publicAuthRoutes = ['/login', '/register', '/auth/confirm']; // Añade '/register' si lo creas
  if (user && publicAuthRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - . (any file with a `.` in it, e.g. .css, .js)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};