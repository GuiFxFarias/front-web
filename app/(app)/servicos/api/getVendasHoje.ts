export async function getVendasHoje() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/todasVendasHoje`
  );
  const data = await response.json();
  return data;
}
