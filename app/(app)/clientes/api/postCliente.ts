/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';

export async function postCliente(body: any) {
  const response = await fetch('http://localhost:3001/novoCliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Erro ao cadastrar o cliente');
  }

  return response.json();
}

export function usePostCliente() {
  return useMutation({
    mutationFn: postCliente,
  });
}
