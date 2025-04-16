'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { getPecasItemId } from '../api/getPecasItemId';
import { Item } from '@/lib/interface/Ipecas';
import { DialogConfirm } from './dialogConfirm';
import { v4 as uuidv4 } from 'uuid';
import { getClientesId } from '../api/clientes';
import { ICliente } from '@/lib/interface/Icliente';

export default function NewServiceForm() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const equipment = searchParams.get('equipment');
  const itemID = searchParams.get('itemId');
  const cliente = searchParams.get('cliente');
  const model = searchParams.get('model');
  const [uniqueCode, setUniqueCode] = useState('');

  const [visor, setVisor] = useState<string>('1');
  const [, setCarcaça] = useState<string>('0');

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
    const storedCode = localStorage.getItem('serviceCode');
    if (storedCode) {
      setUniqueCode(storedCode);
    } else {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const code = `CCR-${day}${month}${uuidv4().slice(0, 4).toUpperCase()}`;
      setUniqueCode(code);
      localStorage.setItem('serviceCode', code);
    }
  }, []);

  if (!itemID) return <p>Nenhum item selecionado.</p>;

  const imagePath = `/img/${itemID}.png`; // ou .jpg

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Novo Serviço | {uniqueCode}</h1>
        <p className='text-gray-500'>
          Categoria: {category} | Equipamento: {equipment} | Cliente:{' '}
          {clienteID.nome}
        </p>
      </div>

      <Button
        className='mr-2'
        onClick={() => {
          setVisor('1');
          setCarcaça('0');
        }}
      >
        Visor
      </Button>
      <Button
        onClick={() => {
          setCarcaça('1');
          setVisor('0');
        }}
      >
        Carcaça
      </Button>

      <div className='flex flex-row overflow-y-scroll h-[70vh]'>
        <div className='grid gap-4 w-2/3 overflow-y-auto mr-4'>
          {pecasItemId
            .filter((item: Item) => item.Visor === visor)
            .map((item: Item) => {
              return (
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
                  <div className='flex-1 h-full'>
                    <Label className='flex justify-between items-center h-full'>
                      <p
                        className='truncate w-1/2 cursor-pointer hover:text-blue-500 duration-200 transition-all ease-in-out'
                        title={
                          item.Descricao.charAt(0).toUpperCase() +
                          item.Descricao.slice(1)
                        }
                      >
                        {item.Descricao.charAt(0).toUpperCase() +
                          item.Descricao.slice(1)}{' '}
                        - {item.nSeriePlaca ? item.nSeriePlaca : null}
                        {item.nSerieSensor ? item.nSerieSensor : null}
                      </p>
                      <span className='text-gray-500'>
                        Num. Image - {item.NumeroItem}
                      </span>
                    </Label>
                  </div>
                </div>
              );
            })}
        </div>
        <div>
          {/* Imagem Principal */}
          <div
            className='relative cursor-pointer'
            onClick={toggleZoom} // Abre o zoom ao clicar
          >
            <Image
              src={imagePath}
              alt={`Imagem do item ${itemID}`}
              width={400}
              height={300}
              className='w-[400px] h-auto rounded-lg shadow'
            />
          </div>

          {/* Modal de Zoom */}
          {isZoomed && (
            <div
              className='fixed inset-0 flex items-center  justify-center bg-black bg-opacity-75 z-50'
              onClick={toggleZoom} // Fecha o zoom ao clicar fora da imagem
            >
              <div className='relative h-[70vh] w-[60vw] overflow-y-auto'>
                <Image
                  src={imagePath}
                  alt='Imagem ampliada'
                  width={1800} // Largura personalizada para o zoom
                  height={700} // Altura personalizada para o zoom
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

      <div className='flex justify-end gap-2'>
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
  );
}
