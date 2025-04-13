/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';

export async function postCliente(body: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/novoCliente`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    console.log('Erro ao cadastrar cliente');
  }

  return response.json();
}

export function usePostCliente() {
  return useMutation({
    mutationFn: postCliente,
  });
}

export async function getClientes() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
