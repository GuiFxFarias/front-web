'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { IServiceID } from '@/lib/interface/IServiceID';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { putCodService } from './novoServico/api/putService';
import { putPecaQtd } from '../almoxarifado/api/putPecaQtd';
import { getAllPecas } from '../almoxarifado/api/getAllPecas';
import DialogConfirmForm from '@/components/dialogConfirForm';

interface IDesc {
  id: string;
  descricao: string;
  atual: number;
  requisitada: number;
}

const formSchema = z.object({
  status: z.string(),
});

export function DialogVerProposta({
  codService,
  descCliente,
  status,
}: {
  codService: string;
  status: string;
  descCliente: string;
}) {
  const [pecaService, setPecaService] = useState<IServiceID[]>([]);
  const [alert, setAlert] = useState<boolean>();
  const [desc, setDesc] = useState<IDesc[]>();
  const [alertItem, setAlertItem] = useState<boolean>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialog2, setOpenDialog2] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const statusService = ['Não iniciado', 'Em progresso', 'Concluído'];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mutatePutService = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status: string } }) =>
      putCodService(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });

  const mutatePutPecaQtd = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { ID: number; Quantidade: number };
    }) => putPecaQtd(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['allPecas']);
    },
  });

  useEffect(() => {
    async function getEquipId(codService: string) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servicos/${codService}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const dataPecaServ = await response.json();
        setPecaService(dataPecaServ);
      } catch (error) {
        console.error('Erro ao buscar equipamento:', error);
      }
    }

    getEquipId(codService);
  }, [codService]);

  const { data: allPecas = [] } = useQuery(['allPecas'], getAllPecas);

  function confirmarProposta() {
    const quantidadesTotais: { [key: string]: number } = {};
    pecaService.forEach((service) => {
      const pecaId = service.peca_id;

      if (!quantidadesTotais[pecaId]) {
        quantidadesTotais[pecaId] = 0;
      }

      quantidadesTotais[pecaId] += service.quantidade_peca;
    });

    const itemsGoingNegative: IDesc[] = [];

    Object.keys(quantidadesTotais).forEach((pecaId) => {
      const peca = allPecas.find((p) => p.ID.toString() === pecaId);

      const resultingQuantity = peca.Quantidade - quantidadesTotais[pecaId];

      if (resultingQuantity < 0) {
        itemsGoingNegative.push({
          id: pecaId,
          descricao: peca.Descricao,
          atual: peca.Quantidade,
          requisitada: quantidadesTotais[pecaId],
        });
        setDesc((prevItems) => [
          ...(prevItems || []),
          {
            id: pecaId,
            descricao: peca.Descricao,
            atual: peca.Quantidade,
            requisitada: quantidadesTotais[pecaId],
          },
        ]);
      }
    });

    if (itemsGoingNegative.length === 0) {
      // Execute your original code for the stock movement
      Object.keys(quantidadesTotais).forEach((pecaId) => {
        const peca = allPecas.find((p) => p.ID.toString() === pecaId);

        const newPeca = {
          ID: pecaId,
          Quantidade: peca.Quantidade,
        };

        if (newPeca) {
          setOpenDialog(true);
          mutatePutPecaQtd.mutate({
            id: pecaId,
            body: {
              ID: peca.ID,
              Quantidade: peca.Quantidade - quantidadesTotais[pecaId],
            },
          });
        }
      });
    } else {
      // console.log(
      //   'Movimentação bloqueada - itens ficariam com estoque negativo:',
      //   itemsGoingNegative,
      // )
      setAlertItem(true);
    }
  }

  const grouped = pecaService.reduce((acc, item) => {
    if (!acc[item.codService]) {
      acc[item.codService] = {};
    }
    if (!acc[item.codService][item.itemService]) {
      acc[item.codService][item.itemService] = [];
    }
    acc[item.codService][item.itemService].push(item);
    return acc;
  }, {} as Record<string, Record<string, IServiceID[]>>);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='bg-blue-500 text-white w-full sm:w-auto'
        >
          Ver proposta
        </Button>
      </DialogTrigger>

      <DialogContent className='w-[95vw] sm:w-[80vw] max-h-[90vh] overflow-y-auto p-4'>
        <DialogHeader>
          <DialogTitle className='text-base sm:text-xl'>
            Proposta Técnica: {codService} | {descCliente}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className='border-b border-gray-300 pb-1 mb-5 text-sm'>
          Peças que serão utilizadas nesse serviço
        </DialogDescription>

        <div className='space-y-6'>
          <h2 className='text-base sm:text-xl font-light mb-2 text-start'>
            Tabela de Peças
          </h2>

          <div className='bg-white shadow-md rounded-lg max-h-[50vh] overflow-y-auto p-4'>
            {Object.entries(grouped).map(([codService, itemGroups]) => (
              <div key={codService} className='mb-6'>
                {Object.entries(itemGroups).map(([itemService, pecas]) => (
                  <div key={itemService} className='mb-4 pl-4'>
                    <div className='px-4 py-2 border-b border-gray-200 space-y-2'>
                      {pecas.map((peca, index) => (
                        <div key={index} className='text-sm'>
                          <h3 className='text-base font-semibold text-gray-800'>
                            Equipamento: {peca.equipamento_Descricao}
                          </h3>
                          <p>
                            <strong>Descrição:</strong> {peca.peca_Descricao} |
                            Valor da peça{' '}
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(Number(peca.valorPeca))}
                          </p>
                          <p className='text-gray-600'>
                            <strong>Quantidade:</strong> {peca.quantidade_peca}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form className='flex flex-col sm:flex-row gap-2'>
              <FormField
                control={form.control}
                name='status'
                render={({}) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        const status = { status: value };
                        mutatePutService.mutate(
                          { body: status, id: codService as string },
                          { onSuccess: () => setOpenDialog2(true) }
                        );
                      }}
                      defaultValue={status}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full sm:w-[180px]'>
                          <SelectValue placeholder='Status do projeto' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            {status || 'Status do projeto'}
                          </SelectLabel>
                          {statusService.map((status, index) => (
                            <SelectItem value={status} key={index}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <DialogConfirmForm
              title='Status mudado'
              text='Você mudou o status do seu serviço!'
              open={openDialog2}
              setOpen={setOpenDialog2}
            />
          </Form>

          <Button
            type='button'
            onClick={() => setAlert(true)}
            className='w-full sm:w-auto'
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>

      {/* Dialog de Confirmação */}
      <Dialog open={alert}>
        <DialogContent className='w-[95vw] sm:w-[30vw] p-4'>
          <DialogHeader>
            <DialogTitle>Confirme</DialogTitle>
            <DialogDescription className='text-sm'>
              No momento que confirmar, estará retirando os itens do
              almoxarifado
            </DialogDescription>
            <div className='flex flex-col sm:flex-row justify-between gap-2 mt-4'>
              <Button
                className='bg-zinc-200 text-black hover:bg-zinc-100 w-full sm:w-auto'
                onClick={() => setAlert(false)}
              >
                Cancelar
              </Button>
              <Button
                className='w-full sm:w-auto'
                onClick={() => {
                  confirmarProposta();
                  setAlert(false);
                }}
              >
                Confirmar
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
        <DialogConfirmForm
          title='Item retirado'
          text='Você confirmou o seu serviço, retirando o produto do almoxarifado!'
          open={openDialog}
          setOpen={setOpenDialog}
        />
      </Dialog>

      {/* Dialog de Alerta de Estoque */}
      <Dialog open={alertItem}>
        <DialogContent className='w-[95vw] sm:w-[50vw] p-4'>
          <DialogHeader>
            <DialogTitle>Zero estoque</DialogTitle>
            <DialogDescription className='text-sm mb-2'>
              Movimentação bloqueada - itens que ficariam com estoque negativo:
            </DialogDescription>
            <div className='space-y-2'>
              {desc?.map((d, i) => (
                <div key={i} className='text-sm border rounded-md p-2'>
                  <p>
                    <strong>Peça:</strong> {d?.descricao}
                  </p>
                  <p>
                    <strong>Quantidade requisitada:</strong> {d?.requisitada}
                  </p>
                  <p>
                    <strong>Quantidade atual:</strong> {d?.atual}
                  </p>
                </div>
              ))}
            </div>
            <div className='flex justify-end mt-4'>
              <Button
                className='bg-zinc-200 text-black hover:bg-zinc-100'
                onClick={() => {
                  setAlertItem(false);
                  setDesc([]);
                }}
              >
                Ok
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
