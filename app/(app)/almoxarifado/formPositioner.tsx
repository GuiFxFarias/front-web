'use client';

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
import { postPosicionador } from './api/postAlmoxarife';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import DialogConfirmForm from '@/components/dialogConfirForm';

export interface IProdutoPosicionadorFormData {
  descricaoProduto: string;
  nSerieEquipamento: string;
  nSerieBase: string;
  nSeriePlaca1: string;
  nSeriePlaca2: string;
  modeloPlaca: string;
  protocolo: string;
  preco: string;
  quantidade: number;
}
interface IModel {
  id: number;
  value: string;
}

export const formSchema = z.object({
  descricaoProduto: z.string().min(1, 'Descrição do produto é obrigatória.'),
  nSerieEquipamento: z
    .string()
    .min(1, 'Número de série do equipamento é obrigatório.'),
  nSerieBase: z.string().min(1, 'Número de série da base é obrigatório.'),
  nSeriePlaca1: z.string().min(1, 'Número de série da Placa 1 é obrigatório.'),
  nSeriePlaca2: z.string().min(1, 'Número de série da Placa 2 é obrigatório.'),
  modeloPlaca: z.string().min(1, 'Modelo da Placa é obrigatório.'),
  protocolo: z.string().min(1, 'Protocolo é obrigatório.'),
  preco: z.string().min(1, 'O preço é obrigatório.'),
  quantidade: z.number(),
});

export default function PosicionadorForm() {
  const form = useForm<IProdutoPosicionadorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricaoProduto: '',
      nSerieEquipamento: '',
      nSerieBase: '',
      nSeriePlaca1: '',
      nSeriePlaca2: '',
      modeloPlaca: '',
      protocolo: '',
      preco: '',
      quantidade: 1,
    },
  });

  const modelos = [
    { id: 1, value: 'SMAR' },
    { id: 2, value: 'FOXBORO' },
    { id: 3, value: 'SIEMENS/BRAY' },
    { id: 4, value: 'UNIÃO BRASIL' },
    { id: 5, value: 'SPIRAX SARCO' },
    { id: 6, value: 'SANSOM' },
    { id: 7, value: 'METSO' },
  ];

  const protocolo = [
    { id: 1, value: 'HART' },
    { id: 2, value: 'PROFIBUS' },
  ];
  const [modelo, setModelo] = useState<string>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const mutatePosicionador = useMutation({
    mutationFn: postPosicionador,
    onSuccess: () => {
      queryClient.invalidateQueries(['produtos_posicionador']);
    },
  });

  function onSubmit(values: IProdutoPosicionadorFormData) {
    mutatePosicionador.mutate(values, {
      onSuccess: () => {
        setOpenDialog(true);
      },
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 rounded-md w-[65vw] h-[34vh] overflow-y-auto pt-4 px-2'
      >
        {/* Campo: Descrição do Produto */}
        <FormField
          control={form.control}
          name='descricaoProduto'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Produto</FormLabel>
              <FormControl>
                <Input placeholder='Digite a descrição' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série do Equipamento */}
        <FormField
          control={form.control}
          name='nSerieEquipamento'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série do Equipamento</FormLabel>
              <FormControl>
                <Input placeholder='Digite o número de série' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série da Base */}
        <FormField
          control={form.control}
          name='nSerieBase'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série da Base</FormLabel>
              <FormControl>
                <Input
                  placeholder='Digite o número de série da base'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série da Placa 1 */}
        <FormField
          control={form.control}
          name='nSeriePlaca1'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série da Placa 1</FormLabel>
              <FormControl>
                <Input
                  placeholder='Digite o número de série da Placa 1'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série da Placa 2 */}
        <FormField
          control={form.control}
          name='nSeriePlaca2'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série da Placa 2</FormLabel>
              <FormControl>
                <Input
                  placeholder='Digite o número de série da Placa 2'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Protocolo */}
        <FormField
          control={form.control}
          name='protocolo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protocolo</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Escolha o protocolo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {protocolo.map((item: IModel) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Campo: Modelo da Placa */}
        <FormField
          control={form.control}
          name='modeloPlaca'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setModelo(value);
                }}
                value={modelo}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Modelo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {modelos.map((item: IModel) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Campo: Preco */}
        <FormField
          control={form.control}
          name='preco'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input placeholder='Digite o valor do produto' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Envio */}
        <Button type='submit'>Cadastrar</Button>
      </form>
      <DialogConfirmForm
        title='Equipamento cadastrado'
        text='Seu equipamento foi cadastrado com sucesso!'
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </Form>
  );
}
