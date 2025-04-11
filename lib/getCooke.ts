'use server';
import { cookies } from 'next/headers';

export async function getUserCookies() {
  const payload = cookies().get('token');

  return payload?.value;
}
