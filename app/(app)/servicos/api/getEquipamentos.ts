export async function getEquipamentos() {
  const response = await fetch("http://localhost:3001/equipamentos");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
