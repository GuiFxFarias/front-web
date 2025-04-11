'use server';
import { cookies } from 'next/headers';

export async function getUserCookies() {
  const payload = (await cookies()).get('token');

  return payload?.value;
}
