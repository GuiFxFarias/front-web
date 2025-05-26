'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from 'react-query';
import { IEquipamento } from '@/lib/interface/Iequipamento';
import { IService } from '@/lib/interface/IService';
import { DialogVerProposta } from '@/app/(app)/servicos/dialogVerProposta';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewServiceDialog } from '../servicos/newServiceDialog';
import { NewSalePecasDialog } from '../servicos/newSaleDialog';
import PecasVenda from '../servicos/salvePecaAvulsa';
import { DialogNovaOS } from '@/components/dialogOs';

export default function ManutencaoItens() {
  const [search, setSearch] = useState<string>('');

  //   const { data: services = [], isLoading } = useQuery(
  //     ['services'],
  //     getServices
  //   );

  //   const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  //   const groupedServices = useMemo(() => {
  //     if (!Array.isArray(services) || isLoading) return {};

  //     return services.reduce((acc, service: IService) => {
  //       if (!acc[service.codService]) {
  //         acc[service.codService] = [];
  //       }
  //       acc[service.codService].push(service);
  //       return acc;
  //     }, {} as Record<string, IService[]>);
  //   }, [services, isLoading]);

  //   const filterCodService: [string, IService[]][] =
  //     Object.entries(groupedServices);

  //   const filteredServices: [string, IService[]][] = useMemo(() => {
  //     return filterCodService.filter(([, items]) =>
  //       items[0]?.descCliente?.toLowerCase().includes(search.toLowerCase())
  //     );
  //   }, [filterCodService, search]);

  return (
    <div className='flex-1 p-4 sm:p-8'>
      {/* Header com Título e Botões */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Lista de Propostas
        </h1>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
          <DialogNovaOS />
        </div>
      </div>
    </div>
  );
}
