import { NextRequest, NextResponse } from 'next/server';
import { getUserCookies } from './lib/getCooke';

export function middleware(req: NextRequest) {
  const token = getUserCookies();

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
