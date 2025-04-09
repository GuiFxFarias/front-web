export async function getServicoCodService(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/servicosCodService/${id}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
