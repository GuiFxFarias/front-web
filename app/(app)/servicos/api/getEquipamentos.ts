export async function getEquipamentos() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/equipamentos`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
