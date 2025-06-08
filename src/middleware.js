import { NextResponse } from 'next/server';
import { aliasMap } from './lib/alias-map';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (aliasMap[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = aliasMap[pathname];
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/homework-helper',
    '/homework-assistant',
    '/instant-math-solver',
    '/math-help',
    '/solve-my-math',
    '/ai-math',
    '/math-tutor-ai',
    '/math-bot',
    '/ai-maths',
    '/smart-solution',
    '/solution-checker',
    '/check-my-solution',
    '/step-check',
  ],
};
