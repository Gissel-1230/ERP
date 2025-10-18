import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value; //obtenemos la cookie

    //obtener URL a la que el usuario intenta acceder
    const { pathname } = req.nextUrl;

    //redireccionamiento
    if (!token && pathname !== '/login') {
    // Redirigir a la página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // si 
  return NextResponse.next(); 


}