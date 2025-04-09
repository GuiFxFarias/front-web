/* eslint-disable @typescript-eslint/no-explicit-any */
export async function putCodService(id: string, data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/servicos/${id}`,
    {
      method: 'PUT', // Corrected from "GET" to "PUT"
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Now works with the PUT method
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update service with id ${id}`);
  }

  return response.json();
}
