/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import * as z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getClientes } from '../servicos/api/clientes';
import { ICliente } from '@/lib/interface/Icliente';
import DialogConfirmForm from '@/components/dialogConfirForm';
import { getAllPecas } from '../almoxarifado/api/getAllPecas';
import { postVendas } from '../produtos/api/postVendas';
import { Item } from '@/lib/interface/Ipecas';
import { getVendasHoje } from './api/getVendasHoje';
import { IVenda } from '@/lib/interface/Isale';

// New Schema for Peças
const formSchema = z.object({
  idCliente: z.string().min(1, 'Selecione o cliente'),
  status: z.string().min(1, 'Informe o status'),
  itens: z.array(
    z.object({
      idPeca: z.string().min(1, 'Selecione a peça'),
      quantidade: z.string().min(1, 'Informe a quantidade'),
    })
  ),
});

export function NewSalePecasDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: dataCliente = [] } = useQuery(['clientes'], getClientes);
  const { data: allPecas = [] } = useQuery(['allPecas'], getAllPecas);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idCliente: '',
      status: '',
      itens: [{ idPeca: '', quantidade: '' }],
    },
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itens',
  });

  const mutateVenda = useMutation({
    mutationFn: (body: any) => postVendas(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendas']);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    const sharedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const vendas = values.itens.map((item) => ({
      idCliente: Number(values.idCliente),
      idVenda: sharedId,
      idProduto: item.idPeca,
      itemVenda: `${item.idPeca}`,
      tipoProduto: 'Peça Avulsa',
      quantidade: Number(item.quantidade),
      dataProposta: sharedDate,
      dataVenda: null,
      status: values.status,
    }));

    mutateVenda.mutate(vendas, {
      onSuccess: () => {
        setOpenDialog(true);
        queryClient.invalidateQueries(['vendas']);
      },
    });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600'>
          + Nova venda de peças
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[50vw] overflow-y-auto max-h-[80vh]'>
        <DialogHeader>
          <DialogTitle>Nova venda de peças</DialogTitle>
        </DialogHeader>
        <DialogDescription className='text-xs text-zinc-400'>
          Preencha os dados para realizar a nova venda de peças.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Cliente */}
            <FormField
              control={form.control}
              name='idCliente'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o cliente' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataCliente.map((item: ICliente) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div
                key={field.id}
                className='border p-3 rounded-md space-y-2 relative'
              >
                {/* Peça */}
                <FormField
                  control={form.control}
                  name={`itens.${index}.idPeca`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peça</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione a peça' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allPecas
                            .filter((peca: Item) => peca.Quantidade > 0)
                            .map((peca: Item) => (
                              <SelectItem key={peca.ID} value={String(peca.ID)}>
                                {peca.Descricao} {peca.nSeriePlaca}{' '}
                                {peca.nSerieSensor}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Quantidade */}
                <FormField
                  control={form.control}
                  name={`itens.${index}.quantidade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Quantidade'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* botão de remover */}
                <Button
                  type='button'
                  variant='destructive'
                  className='absolute h-6 top-0 right-3'
                  onClick={() => remove(index)}
                >
                  Remover
                </Button>
              </div>
            ))}

            {/* Status */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='0'>Proposta</SelectItem>
                      <SelectItem value='1'>Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => append({ idPeca: '', quantidade: '' })}
              >
                + Adicionar Peça
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type='submit'>Cadastrar</Button>
            </div>
          </form>
          <DialogConfirmForm
            title='Venda cadastrada'
            text='Sua venda foi cadastrada com sucesso!'
            open={openDialog}
            setOpen={setOpenDialog}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}
