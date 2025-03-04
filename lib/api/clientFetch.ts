/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default async function clientFetch(
  url: string,
  method?: string,
  body?: any
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function clientFetchMultipart(
  url: string,
  method?: string,
  body?: any
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: method ?? "GET",
    body: body,
  });

  return res.json();
}
