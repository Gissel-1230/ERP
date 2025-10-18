import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value; //obtenemos la cookie

    //obtener URL a la que el usuario intenta acceder
    const { pathname } = req.nextUrl;

    //redireccionamiento
    if (!token && pathname !== '/') {
    // Redirigir a la página de login
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // si no se cumple ninguna de las peticiones anteriores
  return NextResponse.next(); 

}

export const config = {
    matcher: [
    //    '/dashboard/:path*', '/login'
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
  }
