/* eslint-disable @typescript-eslint/no-explicit-any */
export async function putPecaQtd(id: string, body: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pecas/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update service with id ${id}`);
  }

  return response.json();
}
