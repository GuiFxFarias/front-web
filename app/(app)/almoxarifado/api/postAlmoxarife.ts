export async function postTransmissor(data) {
  const response = await fetch("http://localhost:3001/prodTransmissor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function postPosicionador(data) {
  const response = await fetch("http://localhost:3001/prodPosicionador", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function postPecas(data) {
  const response = await fetch("http://localhost:3001/novasPecas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
