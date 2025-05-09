'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewServiceDialog } from './newServiceDialog';
import { useQuery } from 'react-query';
import { getEquipamentos } from './api/getEquipamentos';
import { IEquipamento } from '@/lib/interface/Iequipamento';
import { IService } from '@/lib/interface/IService';
import { DialogVerProposta } from '@/app/(app)/servicos/dialogVerProposta';
import { getServices } from './novoServico/api/getService';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewSalePecasDialog } from './newSaleDialog';
import PecasVenda from './salvePecaAvulsa';

export default function ServicesItens() {
  const [search, setSearch] = useState<string>('');

  const { data: services = [], isLoading } = useQuery(
    ['services'],
    getServices
  );

  const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  const groupedServices = useMemo(() => {
    if (!Array.isArray(services) || isLoading) return {};

    return services.reduce((acc, service: IService) => {
      if (!acc[service.codService]) {
        acc[service.codService] = [];
      }
      acc[service.codService].push(service);
      return acc;
    }, {} as Record<string, IService[]>);
  }, [services, isLoading]);

  const filterCodService: [string, IService[]][] =
    Object.entries(groupedServices);

  const filteredServices: [string, IService[]][] = useMemo(() => {
    return filterCodService.filter(([, items]) =>
      items[0]?.descCliente?.toLowerCase().includes(search.toLowerCase())
    );
  }, [filterCodService, search]);

  return (
    <div className='flex-1 p-4 sm:p-8'>
      {/* Header com Título e Botões */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Lista de Propostas
        </h1>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
          <NewServiceDialog />
          <NewSalePecasDialog />
        </div>
      </div>

      {/* Tabs com Cards */}
      <div className='grid grid-cols-1 gap-4'>
        {isLoading ? (
          'Carregando...'
        ) : (
          <>
            <Tabs defaultValue='pecas' className='w-full'>
              <TabsList className='flex flex-wrap justify-start gap-2 mb-4'>
                <TabsTrigger value='pecas'>Venda de peças</TabsTrigger>
                <TabsTrigger value='serv'>Serviços</TabsTrigger>
              </TabsList>

              {/* Tab de Serviços */}
              <TabsContent value='serv'>
                <div className='flex flex-col sm:flex-row items-center gap-4 mb-6'>
                  <Input
                    type='text'
                    placeholder='Pesquisar cliente...'
                    className='w-full sm:max-w-md'
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className='overflow-y-auto max-h-[60vh] space-y-2'>
                  {filteredServices.map(([codService, services]) => (
                    <Card key={codService}>
                      <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                        <CardTitle>Serviço {codService}</CardTitle>
                        <DialogVerProposta
                          status={services[0].status}
                          codService={services[0].codService}
                          descCliente={services[0].descCliente}
                        />
                      </CardHeader>

                      <CardContent>
                        <p className='text-gray-800 font-semibold'>
                          Cliente: {services[0].descCliente}
                        </p>

                        {services.map((data: IService) => (
                          <div
                            key={data.id}
                            className='mt-2 p-2 border rounded-md bg-gray-50 space-y-1'
                          >
                            <p className='text-gray-600'>
                              Realizado em:{' '}
                              {new Date(data.DataCadastro)
                                .toLocaleString('pt-BR')
                                .slice(0, -3)}
                            </p>

                            {equipamentos?.map(
                              (equip: IEquipamento) =>
                                data.equipamentoId == String(equip.ID) && (
                                  <p key={equip.ID} className='text-gray-600'>
                                    Equipamento: {equip.Descricao}
                                  </p>
                                )
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Tab de Peças */}
              <TabsContent value='pecas'>
                <PecasVenda />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
