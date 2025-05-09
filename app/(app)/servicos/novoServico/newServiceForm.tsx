'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { getPecasItemId } from '../api/getPecasItemId';
import { Item } from '@/lib/interface/Ipecas';
import { DialogConfirm } from './dialogConfirm';
import { getClientesId } from '../api/clientes';
import { ICliente } from '@/lib/interface/Icliente';
import { getVendasHoje } from '../api/getVendasHoje';
import { IVenda } from '@/lib/interface/Isale';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function NewServiceForm() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const equipment = searchParams.get('equipment');
  const itemID = searchParams.get('itemId');
  const cliente = searchParams.get('cliente');
  const model = searchParams.get('model');
  const [uniqueCode, setUniqueCode] = useState('');

  const { data: pecasItemId = [] } = useQuery(['pecasItemId'], () =>
    getPecasItemId(String(itemID))
  );

  const { data: clienteID = [] } = useQuery(['clientes'], () =>
    getClientesId(cliente || '')
  );

  // Estado para gerenciar itens selecionados
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [isZoomed, setIsZoomed] = useState(false);

  // Função para alternar o estado do zoom
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Alternar seleção de um item
  const toggleItemSelection = (id: number) => {
    setSelectedItems((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id];

      return newSelected;
    });
  };

  // Salvar serviço
  const handleSaveService = () => {
    const selectedServices = pecasItemId.filter((item: Item) =>
      selectedItems.includes(item.ID)
    );
    return selectedServices;
    // Aqui você pode adicionar lógica para enviar os dados a uma API
  };

  useEffect(() => {
    async function generateCode() {
      const storedCode = localStorage.getItem('serviceCode');
      if (storedCode) {
        setUniqueCode(storedCode);
      } else {
        const vendasHoje = await getVendasHoje();

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        const baseId = `${day}${month}${year}`;

        const sequence =
          vendasHoje.filter((sale: IVenda) => sale.idVenda.startsWith(baseId))
            .length + 1;

        const sharedId = `${baseId}_${sequence}`;

        setUniqueCode(sharedId);
        localStorage.setItem('serviceCode', sharedId);
      }
    }

    generateCode(); // Chama a função assíncrona dentro do useEffect
  }, []);

  if (!itemID) return <p>Nenhum item selecionado.</p>;

  const imagePath = `/img/${itemID}.png`; // ou .jpg

  const visorPlacas: Item[] = pecasItemId.filter(
    (item: Item) => item.Visor === '1' && item.sensorPlaca === '1'
  );
  const carcacaSensores: Item[] = pecasItemId.filter(
    (item: Item) => item.Visor === '0' && item.sensorPlaca === '2'
  );
  const visorOutros: Item[] = pecasItemId.filter(
    (item: Item) => item.Visor === '1' && item.sensorPlaca !== '1'
  );
  const carcacaOutros: Item[] = pecasItemId.filter(
    (item: Item) => item.Visor === '0' && item.sensorPlaca !== '2'
  );

  return (
    <div className='p-6 space-y-6 '>
      <div>
        <h1 className='text-2xl font-bold'>Novo Serviço | {uniqueCode}</h1>
        <p className='text-gray-500'>
          Categoria: {category} | Equipamento: {equipment} | Cliente:{' '}
          {clienteID.nome}
        </p>
      </div>

      <div className='flex flex-col items-start space-y-4'>
        <div className='flex flex-row h-[70vh] w-full'>
          <div className='grid gap-2 w-2/3 overflow-y-auto px-4 h-[70vh] mr-4'>
            {/* Visor Part */}
            <h2 className='text-xl font-bold'>Visor</h2>

            {visorPlacas.length > 0 && (
              <Accordion type='single' collapsible>
                <AccordionItem value='visor-placas'>
                  <AccordionTrigger className='justify-between flex'>
                    Placas Eletrônicas (Qtd:{' '}
                    {visorPlacas.reduce(
                      (sum, item) => sum + item.Quantidade,
                      0
                    )}
                    )
                  </AccordionTrigger>
                  <AccordionContent>
                    {visorPlacas
                      .filter((item) => item.Quantidade > 0)
                      .map((item) => (
                        <div
                          key={item.ID}
                          className={`flex items-start gap-2 p-4 border rounded-lg ${
                            selectedItems.includes(item.ID)
                              ? 'bg-blue-100 border-blue-500'
                              : ''
                          }`}
                          onClick={() => toggleItemSelection(item.ID)}
                        >
                          {selectedItems.includes(item.ID) ? (
                            <CheckCircle className='h-5 w-5 text-blue-500' />
                          ) : (
                            <Circle className='h-5 w-5 text-gray-400' />
                          )}
                          <Label className='flex justify-between w-full'>
                            <span className='truncate'>{item.Descricao}</span>
                            <span className='text-gray-500'>
                              Qtd: {item.Quantidade}
                            </span>
                            <span className='text-gray-500'>
                              Num. Image - {item.NumeroItem}
                            </span>
                          </Label>
                        </div>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Other Visor Items */}
            {visorOutros.length > 0 &&
              visorOutros.map((item) => (
                <div
                  key={item.ID}
                  className={`flex items-start gap-2 p-4 border rounded-lg ${
                    selectedItems.includes(item.ID)
                      ? 'bg-blue-100 border-blue-500'
                      : ''
                  }`}
                  onClick={() => toggleItemSelection(item.ID)}
                >
                  {selectedItems.includes(item.ID) ? (
                    <CheckCircle className='h-5 w-5 text-blue-500' />
                  ) : (
                    <Circle className='h-5 w-5 text-gray-400' />
                  )}
                  <Label className='flex justify-between w-full'>
                    <span className='truncate'>{item.Descricao}</span>
                    <span className='text-gray-500'>
                      Qtd: {item.Quantidade}
                    </span>
                    <span className='text-gray-500'>
                      Num. Image - {item.NumeroItem}
                    </span>
                  </Label>
                </div>
              ))}

            {/* Carcaça Part */}
            <h2 className='text-xl font-bold'>Carcaça</h2>

            {carcacaSensores.length > 0 && (
              <Accordion type='single' collapsible>
                <AccordionItem value='carcaca-sensores'>
                  <AccordionTrigger className='justify-between flex'>
                    Sensores (Qtd:{' '}
                    {carcacaSensores.reduce(
                      (sum, item) => sum + item.Quantidade,
                      0
                    )}
                    )
                  </AccordionTrigger>
                  <AccordionContent>
                    {carcacaSensores
                      .filter((item) => item.Quantidade > 0)
                      .map((item) => (
                        <div
                          key={item.ID}
                          className={`flex items-start gap-2 p-4 border rounded-lg ${
                            selectedItems.includes(item.ID)
                              ? 'bg-blue-100 border-blue-500'
                              : ''
                          }`}
                          onClick={() => toggleItemSelection(item.ID)}
                        >
                          {selectedItems.includes(item.ID) ? (
                            <CheckCircle className='h-5 w-5 text-blue-500' />
                          ) : (
                            <Circle className='h-5 w-5 text-gray-400' />
                          )}
                          <Label className='flex justify-between w-full'>
                            <span className='truncate'>{item.Descricao}</span>
                            <span className='text-gray-500'>
                              Qtd: {item.Quantidade}
                            </span>
                            <span className='text-gray-500'>
                              Num. Image - {item.NumeroItem}
                            </span>
                          </Label>
                        </div>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Other Carcaça Items */}
            {carcacaOutros.length > 0 &&
              carcacaOutros.map((item) => (
                <div
                  key={item.ID}
                  className={`flex items-start gap-2 p-4 border rounded-lg ${
                    selectedItems.includes(item.ID)
                      ? 'bg-blue-100 border-blue-500'
                      : ''
                  }`}
                  onClick={() => toggleItemSelection(item.ID)}
                >
                  {selectedItems.includes(item.ID) ? (
                    <CheckCircle className='h-5 w-5 text-blue-500' />
                  ) : (
                    <Circle className='h-5 w-5 text-gray-400' />
                  )}
                  <Label className='flex justify-between w-full'>
                    <span className='truncate'>{item.Descricao}</span>
                    <span className='text-gray-500'>
                      Qtd: {item.Quantidade}
                    </span>
                    <span className='text-gray-500'>
                      Num. Image - {item.NumeroItem}
                    </span>
                  </Label>
                </div>
              ))}
          </div>

          {/* Right Side: Image Viewer (unchanged) */}
          <div className='max-md:hidden'>
            <div className='relative cursor-pointer' onClick={toggleZoom}>
              <Image
                src={imagePath}
                alt={`Imagem do item ${itemID}`}
                width={400}
                height={300}
                className='w-[400px] h-auto rounded-lg shadow'
              />
            </div>

            {isZoomed && (
              <div
                className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50'
                onClick={toggleZoom}
              >
                <div className='relative h-[70vh] w-[60vw] overflow-y-auto'>
                  <Image
                    src={imagePath}
                    alt='Imagem ampliada'
                    width={1800}
                    height={700}
                    className='rounded-lg shadow-lg scale-100'
                  />
                  <button
                    onClick={toggleZoom}
                    className='absolute top-4 right-4 bg-white text-black rounded-full px-4 py-2 shadow-lg hover:bg-gray-200'
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end gap-2 ml-4'>
          {selectedItems.length > 0 && (
            <DialogConfirm
              services={handleSaveService()}
              equipament={equipment || ''}
              category={category || ''}
              model={model || ''}
              codService={uniqueCode || ''}
              cliente={clienteID as ICliente}
            />
          )}
        </div>
      </div>
    </div>
  );
}
