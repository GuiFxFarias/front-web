'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Item } from '@/lib/interface/Ipecas';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getEquipamentoId,
  getServicesId,
  IServPeca,
  postPecaServico,
  postService,
} from './api/postService';
import { ICliente } from '@/lib/interface/Icliente';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { IServiceID } from '@/lib/interface/IServiceID';

export function DialogConfirm({
  services,
  category,
  equipament,
  model,
  codService,
  cliente,
}: {
  services: Item[];
  category: string;
  equipament: string;
  model: string;
  codService: string;
  cliente: ICliente;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inspVisu, setInspVisu] = useState<string>();
  const [manuPrev, setManuPrev] = useState<boolean>(false);
  const [manuPrevTomada, setManuPrevTomada] = useState<boolean>(false);
  const [itemService, setItemService] = useState<number>(0);
  const itemIdEquip = searchParams.get('itemId');

  const queryClient = useQueryClient();

  const { data: equipId } = useQuery({
    queryKey: ['equipamentoId', equipament],
    queryFn: () => getEquipamentoId(equipament),
  });

  const { data: serviceId = [] } = useQuery(['services'], () =>
    getServicesId(codService || '')
  );

  const mutateService = useMutation({
    mutationFn: postService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });

  const mutatePecaServ = useMutation({
    mutationFn: postPecaServico,
    onSuccess: () => {
      queryClient.invalidateQueries(['pecaServ']);
    },
  });

  useEffect(() => {
    if (serviceId.length > 0) {
      const lastItems = serviceId
        .map((service: IServPeca) => service.itemService.at(-1))
        .filter(Boolean)
        .at(-1);

      if (lastItems !== undefined) {
        serviceId.map((service: IServiceID) => {
          if (codService == service.codService) {
            setItemService(Number(lastItems) + 1);
          } else {
            setItemService(itemService + 1);
          }
        });
      }

      // if (
      //   lastItems !== undefined &&
      //   serviceId.filter((item: IServiceID) => item.codService == codService)
      // ) {
      //   setItemService(Number(lastItems) + 1)
      // } else if (lastItems !== undefined) {
      //   setItemService(0)
      //   setItemService(Number(lastItems) + 1)
      // }
    }
  }, [codService, itemService, serviceId]);

  async function handleSaveService() {
    if (!codService) {
      console.log('CodeService Undefined');
      return;
    }

    // Inseri na tabela servicos
    const valueService = {
      modelo: model,
      categoria: category,
      itemIdEquip: itemIdEquip,
      equipamentoDescricao: equipId.Descricao,
      codService: codService,
      idCliente: String(cliente.id),
      descCliente: cliente.nome,
      itemService: String(itemService),
      equipamentoId: String(equipId.ID),
    };

    mutateService.mutate(valueService);
    // console.log(valueService);

    // Inseri na tabela servicos_pecas
    services.map((value: Item) => {
      const pecaServ: IServPeca = {
        codService: codService,
        peca_id: value.ID,
        quantidade_peca: 1,
        idCliente: String(cliente.id),
        insVisual: inspVisu || '',
        manuPreventiva: manuPrev,
        manuPrevTomada: manuPrevTomada,
        itemService: String(itemService),
        equipamentoId: String(equipId.ID),
      };

      mutatePecaServ.mutate(pecaServ);
      // console.log(services);
    });

    router.push(
      `/servicos/novoServico/relatorioDoServico?codService=${codService}&equipament=${equipament}&idCliente=${cliente.id}`
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='bg-blue-500 text-white'>
          Salvar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[725px] h-[70vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Peças | Cliente: {cliente.nome}</DialogTitle>
        </DialogHeader>
        <DialogDescription className='border-b border-gray-700 pb-1 mb-5'>
          Peças que serão utilizadas nesse serviço
        </DialogDescription>
        {services.map((service) => (
          <div key={service.ID}>
            <p className='border-b border-gray-300 pb-2'>{service.Descricao}</p>
          </div>
        ))}
        <Textarea
          placeholder='Adicione a inspeção visual.'
          className='resize-none h-[20vh]'
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInspVisu(e.target.value)
          }
        />
        <div className='flex items-center'>
          <Checkbox
            id='manuPrev'
            className='mr-4'
            onCheckedChange={(check: boolean) => setManuPrev(check)}
          />
          <label
            htmlFor='manuPrev'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Manutenção preventiva (desmontagem, jateamento, pintura, troca de
            orings e parafuso, nova calibração)
          </label>
        </div>
        <div className='flex items-center'>
          <Checkbox
            id='manuPrevTomada'
            className='mr-4'
            onCheckedChange={(check: boolean) => setManuPrevTomada(check)}
          />
          <label
            htmlFor='manuPrevTomada'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Manutenção preventiva tomada de nível (desmontagem, jateamento,
            pintura, assepsia, reusinagem da tomada de nível, solda de lamida de
            aço inox 316L, fornecimento com certificado de calibração com
            reastrabilidade RBC)
          </label>
        </div>
        <DialogFooter>
          <Button onClick={() => handleSaveService()} type='button'>
            Enviar Serviço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
