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
import { postTransmissor } from './api/postAlmoxarife';
import { useMutation, useQueryClient } from 'react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import DialogConfirmForm from '@/components/dialogConfirForm';

interface IProdutoTransmissorFormData {
  descricaoProduto: string;
  nSerieEquipamento: string;
  protocolo: string;
  sensor: boolean;
  nSerieSensor?: string; // Optional if sensor is false
  faixa: string;
  dataFabric: string; // Keeping it as a string to match form input, but can be Date
  preco: string;
  modelo: string;
  quantidade: number;
}

interface IModel {
  id: number;
  value: string;
}

const formSchema = z.object({
  descricaoProduto: z.string().min(1, 'Descrição do produto é obrigatória.'),
  nSerieEquipamento: z
    .string()
    .min(1, 'Número de série do equipamento é obrigatório.'),
  protocolo: z.string().min(1, 'Protocolo é obrigatório.'),
  sensor: z.boolean(),
  nSerieSensor: z.string().optional(), // Opcional caso não tenha sensor
  faixa: z.string().optional(),
  dataFabric: z.string().optional(),
  preco: z.string().min(1, 'Preço é obrigatório.'),
  modelo: z.string().min(1, 'O modelo é obrigatório.'),
  quantidade: z.number(),
});

export default function TransmissorForm() {
  const form = useForm<IProdutoTransmissorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricaoProduto: '',
      nSerieEquipamento: '',
      protocolo: '',
      sensor: false, // Default value for boolean
      nSerieSensor: '',
      faixa: '',
      dataFabric: '',
      preco: '',
      quantidade: 1,
    },
  });
  const [modelo, setModelo] = useState<string>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutateTransmissor = useMutation({
    mutationFn: postTransmissor,
    onSuccess: () => {
      queryClient.invalidateQueries(['produtos_transmissor']);
    },
  });

  const modelos = [
    { id: 1, value: 'SMAR' },
    { id: 2, value: 'YOKOGAWA' },
    { id: 3, value: 'ROSEMOUNT' },
    { id: 4, value: 'ENDRES+HAUSER' },
    { id: 5, value: 'ABB' },
    { id: 6, value: 'SIEMENS' },
    { id: 7, value: 'FOXBORO' },
  ];

  const protocolo = [
    { id: 1, value: 'HART' },
    { id: 2, value: 'PROFIBUS' },
  ];

  function onSubmit(values: IProdutoTransmissorFormData) {
    mutateTransmissor.mutate(values, {
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
        className='space-y-4 h-[34vh] rounded-md w-[65vw]  pt-4 overflow-y-auto px-2'
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
          name='modelo'
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

        {/* Campo: Sensor (Checkbox) */}
        <FormField
          control={form.control}
          name='sensor'
          render={({ field }) => (
            <FormItem className='flex items-center space-x-2'>
              <FormControl>
                <input
                  type='checkbox'
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className='w-5 h-5'
                />
              </FormControl>
              <FormLabel>Possui Sensor?</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série do Sensor (Somente se o sensor for true) */}
        {form.watch('sensor') && (
          <>
            <FormField
              control={form.control}
              name='nSerieSensor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série do Sensor</FormLabel>
                  <FormControl>
                    <Input placeholder='Digite o número de série' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Faixa do Sensor */}
            <FormField
              control={form.control}
              name='faixa'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faixa do Sensor</FormLabel>
                  <FormControl>
                    <Input placeholder='Digite a faixa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Data de Fabricação */}
            <FormField
              control={form.control}
              name='dataFabric'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Fabricação</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {/* Campo: Preço */}
        <FormField
          control={form.control}
          name='preco'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='Digite o preço'
                  {...field}
                />
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
