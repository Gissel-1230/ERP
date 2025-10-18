import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value; //obtenemos la cookie

    //
    const { pathname } = req.nextUrl;


}