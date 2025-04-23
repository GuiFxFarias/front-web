'use client';

import { AlertCircle, Loader2Icon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAllPecas } from './api/getAllPecas';
import { Item } from '@/lib/interface/Ipecas';
import { useEffect, useState } from 'react';
import { putPecaQtd } from './api/putPecaQtd';
import DialogConfirmForm from '@/components/dialogConfirForm';
import { postPecas } from './api/postAlmoxarife';

interface movEstoque {
  idProduto: string;
  quantidade: string;
  tipoPeca: string;
}

const formSchema = z.object({
  idProduto: z.string(),
  quantidade: z.string().optional(),
  tipoPeca: z.string().optional(),
});

export default function MoviEstoque() {
  const queryClient = useQueryClient();
  const [valueItem, setValueItem] = useState('');
  const [movEstoque, setMovEstoque] = useState('');
  const [alert, setAlert] = useState<boolean>(false);
  const [qtd, setQtd] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [tipoPeca, setTipoPeca] = useState<string>();

  const { data: allPecas = [], isLoading } = useQuery(
    ['allPecas'],
    getAllPecas
  );

  useEffect(() => {
    allPecas.filter((item: Item) => {
      return String(item.ID) == valueItem ? setQtd(item.Quantidade) : null;
    });
  }, [allPecas, valueItem]);

  const form = useForm<movEstoque>({
    resolver: zodResolver(formSchema),
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

  const mutatePecas = useMutation({
    mutationFn: postPecas,
    onSuccess: () => {
      queryClient.invalidateQueries(['allPecas']);
    },
  });

  function onSubmit(values: movEstoque) {
    // if (qtd < Number(values.quantidade) && movEstoque === 'sub') {
    //   setAlert(true);
    // }

    const filteredPecas = allPecas.filter((pecas: Item) => {
      return String(pecas.ID) == values.idProduto;
    });

    if (tipoPeca == '1') {
      const pecaWithoutID = { ...filteredPecas[0] };
      delete pecaWithoutID.ID;

      const newValue = {
        ...pecaWithoutID,
        nSeriePlaca: values.tipoPeca,
        Quantidade: 1,
      };

      mutatePecas.mutate(newValue, {
        onSuccess: () => {
          setOpenDialog(true);
        },
      });
    } else if (tipoPeca == '2') {
      const pecaWithoutID = { ...filteredPecas[0] };
      delete pecaWithoutID.ID;

      const newValue = {
        ...pecaWithoutID,
        nSeriePlaca: values.tipoPeca,
        Quantidade: 1,
      };

      mutatePecas.mutate(newValue, {
        onSuccess: () => {
          setOpenDialog(true);
        },
      });
    } else {
      if (movEstoque === 'add') {
        mutatePutPecaQtd.mutate({
          id: values.idProduto,
          body: {
            ID: Number(values.idProduto),
            Quantidade: qtd + Number(values.quantidade),
          },
        });
        setAlert(false);
      }
      if (qtd >= Number(values.quantidade) && movEstoque === 'sub') {
        mutatePutPecaQtd.mutate({
          id: values.idProduto,
          body: {
            ID: Number(values.idProduto),
            Quantidade: qtd - Number(values.quantidade),
          },
        });
        setAlert(false);
      }
    }
  }

  return (
    <Form {...form}>
      {isLoading ? (
        'Carregando...'
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 rounded-md w-[65vw] h-[60vh] overflow-y-auto px-2'
        >
          <Alert
            className={alert ? 'block border-red-500 bg-red-100' : 'hidden'}
          >
            <AlertCircle className='h-4 w-4 ' color='red' />
            <AlertTitle className='text-red-500 font-semibold'>
              Error
            </AlertTitle>
            <AlertDescription className='text-red-500'>
              Não é possivel retirar mais itens do que os cadastrados.
            </AlertDescription>
          </Alert>
          <div className='flex space-x-4 flex-col'>
            <p>
              Se for adicionar uma placa ou sensor selecione uma dessas opções
            </p>
            <label className='flex items-center space-x-2 mt-2'>
              <input
                type='radio'
                value='1'
                checked={tipoPeca === '1'}
                onChange={() => {
                  setTipoPeca('1');
                }}
                className='w-5 h-5'
              />
              <span>Placa eletrônica</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='radio'
                value='2'
                checked={tipoPeca === '2'}
                onChange={() => {
                  setTipoPeca('2');
                }}
                className='w-5 h-5'
              />
              <span>Sensor</span>
            </label>
          </div>
          {/* Campo: Número de Série do Equipamento */}
          <FormField
            control={form.control}
            name='idProduto'
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValueItem(value);
                  }}
                  value={valueItem || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o equipamento' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allPecas
                      .filter((item: Item) => item.Quantidade > 0)
                      .map((item: Item) => (
                        <SelectItem key={item.ID} value={String(item.ID)}>
                          {item.Descricao}{' '}
                          {item.sensorPlaca ? `${item.nSeriePlaca} ` : null}
                          {item.nSerieSensor
                            ? `${item.nSerieSensor} `
                            : null}{' '}
                          {item.protocolo && <span>{item.protocolo}</span>}{' '}
                          {item.faixaSensor && <span>{item.faixaSensor}</span>}{' '}
                          {item.dataFabricacao && (
                            <span>{item.dataFabricacao}</span>
                          )}{' '}
                          {item.modeloPlaca && <span>{item.modeloPlaca}</span>}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {tipoPeca ? null : (
            <FormField
              control={form.control}
              name='quantidade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantidade em estoque:{' '}
                    {isLoading ? <Loader2Icon className='animate-spin' /> : qtd}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {tipoPeca ? (
            <FormField
              control={form.control}
              name='tipoPeca'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Adicione o número de série{' '}
                    {tipoPeca == '1' ? ' da Placa eletrônica' : ' do Sensor'}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {/* Botão de Envio */}
          <div className='flex flex-row justify-between'>
            <Button
              type='submit'
              onClick={() => setMovEstoque('sub')}
              className='mr-2'
            >
              Retirar
            </Button>
            <Button type='submit' onClick={() => setMovEstoque('add')}>
              Adicionar
            </Button>
          </div>
        </form>
      )}
      <DialogConfirmForm
        title='Sucesso'
        text='Sua movimentação de estoque foi confirmada!'
        open={openDialog}
        setOpen={(open: boolean) => setOpenDialog(open)}
      />
    </Form>
  );
}
