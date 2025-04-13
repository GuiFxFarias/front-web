'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getClientes } from '../servicos/api/clientes';
import { ICliente } from '@/lib/interface/Icliente';
import { getAllPrdTransmissor } from './api/getPrdTransmissor';
import { postVendas } from './api/postVendas';
import { useFieldArray } from 'react-hook-form';
import { getAllPrdPos } from './api/getPrdPosicionador';
import DialogConfirmForm from '@/components/dialogConfirForm';

const formSchema = z.object({
  idCliente: z.string().min(1, 'Selecione o cliente'),
  status: z.string().min(1, 'Informe o status'),
  itens: z.array(
    z.object({
      itemVenda: z.string().min(1, 'Informe o item'),
      tipoProduto: z.string().min(1, 'Informe o tipo de produto'),
      marca: z.string().min(1, 'Selecione a marca'),
      idProduto: z.string().min(1, 'Selecione o produto'),
    })
  ),
});

export function NewSaleDialog() {
  const queryClient = useQueryClient();
  const [, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { data: dataCliente = [] } = useQuery(['clientes'], getClientes);
  const { data: prdTrm = [] } = useQuery(['prdTrm'], getAllPrdTransmissor);
  const { data: prdPos = [] } = useQuery(['prdPos'], getAllPrdPos);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idCliente: '',
      status: '',
      itens: [{ itemVenda: '', tipoProduto: '', marca: '', idProduto: '' }],
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const sharedId = crypto.randomUUID();
    const sharedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const vendas = values.itens.map((item) => ({
      idCliente: Number(values.idCliente),
      idVenda: sharedId,
      tipoProduto: item.tipoProduto,
      marca: item.marca,
      itemVenda: item.itemVenda,
      idProduto: item.idProduto,
      dataProposta: sharedDate,
      dataVenda: null,
      status: values.status,
    }));

    mutateVenda.mutate(vendas, {
      onSuccess: () => {
        setOpenDialog(true);
      },
    });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600'>+ Nova venda</Button>
      </DialogTrigger>
      <DialogContent className='w-[50vw] overflow-y-auto max-h-[80vh]'>
        <DialogHeader>
          <DialogTitle>Nova venda</DialogTitle>
        </DialogHeader>
        <DialogDescription className='text-xs text-zinc-400'>
          Preencha os dados para realizar a nova venda.
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

            {fields.map((field, index) => {
              const tipoSelecionado = form.watch(`itens.${index}.tipoProduto`);
              const marcaSelecionada = form.watch(`itens.${index}.marca`);

              const produtosFiltrados =
                tipoSelecionado === 'Transmissor'
                  ? prdTrm.filter((item) => item.modelo == marcaSelecionada)
                  : prdPos.filter(
                      (item) => item.modeloPlaca == marcaSelecionada
                    );

              return (
                <div
                  key={field.id}
                  className='border p-3 rounded-md space-y-2 relative'
                >
                  <FormField
                    control={form.control}
                    name={`itens.${index}.marca`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione a marca' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              'SMAR',
                              'YOKOGAWA',
                              'ROSEMOUNT',
                              'ENDRES+HAUSER',
                              'ABB',
                              'SIEMENS',
                              'SANSOM',
                              'FOXBORO',
                            ].map((marca) => (
                              <SelectItem key={marca} value={marca}>
                                {marca}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* tipoProduto */}
                  <FormField
                    control={form.control}
                    name={`itens.${index}.tipoProduto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Produto</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o tipo' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='Transmissor'>
                              Transmissor
                            </SelectItem>
                            <SelectItem value='Posicionador'>
                              Posicionador
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* itemVenda */}
                  <FormField
                    control={form.control}
                    name={`itens.${index}.itemVenda`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item de Venda</FormLabel>
                        <FormControl>
                          <Input placeholder='Ex: 1' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* idProduto */}
                  <FormField
                    control={form.control}
                    name={`itens.${index}.idProduto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produto</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            setId(value);
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o produto' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {produtosFiltrados.map((prdTrm) => (
                              <SelectItem
                                key={prdTrm.id}
                                value={String(prdTrm.id)}
                              >
                                {prdTrm.descricaoProduto} -{' '}
                                {prdTrm.nSerieEquipamento}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
              );
            })}

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
                onClick={() =>
                  append({
                    itemVenda: '',
                    tipoProduto: '',
                    marca: '',
                    idProduto: '',
                  })
                }
              >
                + Adicionar Item
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
