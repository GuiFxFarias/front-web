export async function putCodService(id: string, data: any) {
  const response = await fetch(`http://localhost:3001/servicos/${id}`, {
    method: "PUT", // Corrected from "GET" to "PUT"
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Now works with the PUT method
  });

  if (!response.ok) {
    throw new Error(`Failed to update service with id ${id}`);
  }

  return response.json();
}
