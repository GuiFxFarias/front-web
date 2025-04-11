/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';

export default async function serverFetch(
  url: string,
  method?: string,
  body?: any,
  params?: { [key: string]: string }
) {
  const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}${url}`);

  if (params) {
    Object.keys(params).forEach((key) => {
      if (Array.isArray(params[key])) {
        (params[key] as unknown as string[]).forEach((value) => {
          apiUrl.searchParams.append(key, value);
        });
      } else {
        apiUrl.searchParams.append(key, params[key] as string);
      }
    });
  }

  const res = await fetch(apiUrl.toString(), {
    method: method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(await cookies()).get('token')!.value}`,
    },
    body: JSON.stringify(body),
  });

  return res.json();
}
