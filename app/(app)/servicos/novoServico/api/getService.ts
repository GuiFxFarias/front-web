export async function getServices() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/todosServicos`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.json();
}
