'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from 'react-query';

import { RegisterProduct } from './newRegisterDialog';
import { getAllPecas } from './api/getAllPecas';
import { Item } from '@/lib/interface/Ipecas';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AlmoxarifadoItens() {
  const [search, setSearch] = useState<string>('');

  const { data: allPecas = [], isLoading: loading } = useQuery(
    ['allPecas'],
    getAllPecas
  );

  const filteredPecas = allPecas.filter((item: Item) =>
    item.Descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const placas = filteredPecas.filter((item: Item) => item.sensorPlaca == '1');
  const sensores = filteredPecas.filter(
    (item: Item) => item.sensorPlaca == '2'
  );
  const outros = filteredPecas.filter(
    (item: Item) => item.sensorPlaca != '1' && item.sensorPlaca != '2'
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
          placeholder='Pesquisar peças...'
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
            <Card>
              <CardContent className='p-2'>
                <Accordion type='single' collapsible>
                  <AccordionItem value='item-1'>
                    <AccordionTrigger className='justify-between flex'>
                      Placa eletrônica | Quantidade:{' '}
                      {placas.reduce((sum, item) => sum + item.Quantidade, 0)}
                    </AccordionTrigger>
                    <AccordionContent>
                      {placas.map((pecasTipos: Item, index) => (
                        <div key={index} className='flex justify-between'>
                          <p className='w-[40%] truncate'>
                            {pecasTipos.Descricao}
                            {pecasTipos.nSeriePlaca
                              ? ` - ${pecasTipos.nSeriePlaca}`
                              : null}
                            {pecasTipos.nSerieSensor
                              ? ` - ${pecasTipos.nSerieSensor}`
                              : null}
                          </p>
                          <p className='text-gray-600 w-[45%]'>
                            Valor da peça (única): {pecasTipos.valorPeca}
                          </p>
                          <p className='text-gray-800 w-[15%] font-semibold'>
                            Quantidade: {pecasTipos.Quantidade}
                          </p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-2'>
                <Accordion type='single' collapsible>
                  <AccordionItem value='item-2'>
                    <AccordionTrigger>
                      Sensor | Quantidade:{' '}
                      {sensores.reduce((sum, item) => sum + item.Quantidade, 0)}
                    </AccordionTrigger>
                    <AccordionContent>
                      {sensores.map((sensor: Item, index) => (
                        <div key={index} className='flex justify-between'>
                          <p className='w-[40%] truncate'>
                            {sensor.Descricao}
                            {sensor.nSeriePlaca
                              ? ` - ${sensor.nSeriePlaca}`
                              : null}
                            {sensor.nSerieSensor
                              ? ` - ${sensor.nSerieSensor}`
                              : null}
                          </p>
                          <p className='text-gray-600 w-[45%]'>
                            Valor da peça (única): {sensor.valorPeca}
                          </p>
                          <p className='text-gray-800 w-[15%] font-semibold'>
                            Quantidade: {sensor.Quantidade}
                          </p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-2'>
                <Accordion type='single' collapsible>
                  <AccordionItem value='item-3'>
                    <AccordionTrigger>
                      Outros itens | Quantidade:{' '}
                      {outros.reduce((sum, item) => sum + item.Quantidade, 0)}
                    </AccordionTrigger>
                    <AccordionContent>
                      {outros.map((outro: Item, index) => (
                        <div key={index} className='flex justify-between'>
                          <p className='w-[40%] truncate'>
                            {outro.Descricao}
                            {outro.nSeriePlaca
                              ? ` - ${outro.nSeriePlaca}`
                              : null}
                            {outro.nSerieSensor
                              ? ` - ${outro.nSerieSensor}`
                              : null}
                          </p>
                          <p className='text-gray-600 w-[45%]'>
                            Valor da peça (única): {outro.valorPeca}
                          </p>
                          <p className='text-gray-800 w-[15%] font-semibold'>
                            Quantidade: {outro.Quantidade}
                          </p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
