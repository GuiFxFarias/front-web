export async function getServices() {
  const response = await fetch("http://localhost:3001/todosServicos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
