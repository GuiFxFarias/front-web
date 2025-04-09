/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postTransmissor(data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/prodTransmissor`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}

export async function postPosicionador(data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/prodPosicionador`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}

export async function postPecas(data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/novasPecas`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}
