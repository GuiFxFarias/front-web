/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postNovaOS(body: {
  data_abertura: string;
  tipo_servico: string;
  cliente_id: string;
  anexo_doc?: FileList | File[];
}) {
  try {
    const formData = new FormData();

    formData.append('data_abertura', body.data_abertura);
    formData.append('tipo_servico', body.tipo_servico);
    formData.append('cliente_id', body.cliente_id);

    if (body.anexo_doc) {
      const arquivos = Array.from(body.anexo_doc);
      arquivos.forEach((file) => {
        formData.append('anexo_doc', file);
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/servicoManutencao`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erro ao criar O.S.:', error);
    return { sucesso: false, erro: error.message };
  }
}
