'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from 'react-query';

import { RegisterProduct } from './newRegisterDialog';
import { getAllPecas } from './api/getAllPecas';
import { Item } from '@/lib/interface/Ipecas';

export default function AlmoxarifadoItens() {
  const [search, setSearch] = useState<string>('');

  const { data: allPecas = [], isLoading: loading } = useQuery(
    ['allPecas'],
    getAllPecas
  );

  const filteredPecas = allPecas.filter((item: Item) =>
    item.Descricao?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='flex-1 p-8'>
      {/* Conteúdo Principal */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Controle Almoxarifado
        </h1>
        <RegisterProduct />
      </div>

      {/* Barra de Pesquisa */}
      <div className='flex items-center mb-6'>
        <Input
          type='text'
          placeholder='Pesquisar cliente...'
          className='w-full max-w-md'
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de Serviços */}
      <div className='grid grid-cols-1 gap-1 overflow-y-auto max-h-[50vh]'>
        {/* Card de Serviço 1 */}
        {loading ? (
          'Carregando...'
        ) : (
          <>
            {filteredPecas.map((data: Item) => {
              return (
                <Card key={data.ID} className='h-[5vh]'>
                  <CardContent className='p-2'>
                    <div className='flex justify-between'>
                      <p className='w-[40%] truncate'>{data.Descricao}</p>
                      <p className='text-gray-600 w-[45%]'>
                        Valor da peça (única):
                        {data.valorPeca}
                        {data.nSeriePlaca ? data.nSeriePlaca : null}
                        {data.nSerieSensor ? data.nSerieSensor : null}
                      </p>
                      <p className='text-gray-800 w-[15%] font-semibold'>
                        Quantidade: {data.Quantidade}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
