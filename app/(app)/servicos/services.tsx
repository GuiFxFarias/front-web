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
    <div className='flex-1 p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Lista de Propostas</h1>
        <div className='flex space-x-4'>
          <NewServiceDialog />
          <NewSalePecasDialog />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 '>
        {/* Card de Serviço 1 */}
        {isLoading ? (
          'Carregando...'
        ) : (
          <>
            <Tabs defaultValue='pecas' className='w-full'>
              <TabsList>
                <TabsTrigger value='pecas'>Venda de peças</TabsTrigger>
                <TabsTrigger value='serv'>Serviços</TabsTrigger>
              </TabsList>
              <TabsContent value='serv' className=''>
                <div className='flex items-center mb-6'>
                  <Input
                    type='text'
                    placeholder='Pesquisar cliente...'
                    className='w-full max-w-md'
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className='overflow-y-auto max-h-[60vh] space-y-2'>
                  {filteredServices.map(([codService, services]) => (
                    <Card key={codService}>
                      <CardHeader className='flex justify-between flex-row items-center'>
                        <CardTitle>Serviço {codService}</CardTitle>
                        <div className='flex items-center space-x-2'>
                          {/* Exibe o Dialog do primeiro item do grupo */}
                          <DialogVerProposta
                            // equipamentos={equipamentosRelacionados}
                            status={services[0].status}
                            codService={services[0].codService}
                            descCliente={services[0].descCliente}
                          />
                        </div>
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
