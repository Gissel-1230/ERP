import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value; //obtenemos la cookie

    //obtener URL a la que el usuario intenta acceder
    const { pathname } = req.nextUrl;

    //redireccionamiento
    if(!token && pathname.startsWith('/login')){

    }


}