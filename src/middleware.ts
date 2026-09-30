import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from '@/lib/supabase/config';

/**
 * Admin gate: refreshes the Supabase session cookie and sends signed-out
 * visitors to the login page. Admin membership itself is checked again on the
 * server (layout + every action) and enforced by RLS in the database.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';

  const preview = process.env.NODE_ENV === 'development' && process.env.ADMIN_PREVIEW === '1';
  if (preview) return NextResponse.next();

  if (!supabaseConfigured) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }
  if (user && isLogin && !request.nextUrl.searchParams.has('error')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
