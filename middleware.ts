import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const publicRoutes = ['/', '/login', '/usuarios/login'];
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    console.log('Sem token, redirecionando...');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/servicos:path*',
    '/produtos:path*',
    '/painel:path*',
    '/almoxarifado:path*',
  ],
};
