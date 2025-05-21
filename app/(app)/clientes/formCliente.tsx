/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getClientes, usePostCliente } from './api/postCliente';
import DialogConfirmForm from '@/components/dialogConfirForm';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { FormattedInput } from '@/components/patternFormatComp';
import { Badge } from '@/components/ui/badge';
import { ICliente } from '@/lib/interface/Icliente';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  nome_responsavel: z.string().min(1, 'Responsável é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  cep: z.string().min(1, 'CEP é obrigatório'),
});

export default function ClienteForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      cnpj: '',
      nome_responsavel: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
    },
  });

  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { data: clientes } = useQuery(['clientes'], getClientes);

  const { mutate } = usePostCliente();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onError: (error) => {
        console.error('Erro ao salvar:', error);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['clientes']);
        setOpenDialog(true);
      },
    });
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div>
        <p className='text-center mt-4'>Nenhum cliente cadastrado ainda.</p>
        <Card className='w-[40vw] mx-auto h-full overflow-y-auto'>
          <CardContent className='p-6'>
            <h2 className='text-xl font-semibold mb-6 text-center'>
              Cadastro de Cliente
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    {
                      name: 'nome',
                      label: 'Nome',
                      type: 'text',
                      format: undefined,
                    },
                    {
                      name: 'cnpj',
                      label: 'CNPJ',
                      type: 'pattern',
                      format: '##.###.###/####-##',
                    },
                    {
                      name: 'nome_responsavel',
                      label: 'Responsável',
                      type: 'text',
                      format: undefined,
                    },
                    {
                      name: 'email',
                      label: 'Email',
                      type: 'email',
                      format: undefined,
                    },
                    {
                      name: 'telefone',
                      label: 'Telefone',
                      type: 'pattern',
                      format: '(##) #####-####',
                    },
                    {
                      name: 'endereco',
                      label: 'Endereço',
                      type: 'text',
                      format: undefined,
                    },
                    {
                      name: 'cidade',
                      label: 'Cidade',
                      type: 'text',
                      format: undefined,
                    },
                    {
                      name: 'estado',
                      label: 'Estado',
                      type: 'text',
                      format: undefined,
                    },
                    {
                      name: 'cep',
                      label: 'CEP',
                      type: 'pattern',
                      format: '#####-###',
                    },
                  ].map(({ name, label, format }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof typeof formSchema._type}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <FormattedInput
                              {...field}
                              format={format}
                              onValueChange={(values: any) => {
                                field.onChange(values.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button type='submit' className='w-full mt-4'>
                  Salvar
                </Button>
              </form>
              <DialogConfirmForm
                title='Cliente cadastrado'
                text='Seu novo cliente para uso foi cadastrado com sucesso!'
                open={openDialog}
                setOpen={setOpenDialog}
              />
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex w-[70vw] h-[80vh]'>
      <div className='w-[40%] overflow-y-auto space-y-5'>
        {clientes.map((cliente: ICliente, index: number) => (
          <Card key={index} className='border shadow-md'>
            <CardContent className='p-4 space-y-2'>
              <h3 className='text-lg font-semibold'>{cliente.nome}</h3>
              <p>
                <strong>CNPJ:</strong> {cliente.cnpj}
              </p>
              <p>
                <strong>Responsável:</strong> {cliente.nome_responsavel}
              </p>
              <p>
                <strong>Email:</strong> {cliente.email}
              </p>
              <p>
                <strong>Telefone:</strong> {cliente.telefone}
              </p>
              <p>
                <strong>Endereço:</strong> {cliente.endereco}
              </p>
              <div className='flex gap-2 flex-wrap'>
                <Badge variant='outline'>{cliente.cidade}</Badge>
                <Badge variant='outline'>{cliente.estado}</Badge>
                <Badge variant='secondary'>{cliente.cep}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className='w-[40vw] mx-auto h-full overflow-y-auto flex items-center justify-center'>
        <CardContent className='p-6 w-full'>
          <h2 className='text-xl font-semibold mb-6 text-center'>
            Cadastro de Cliente
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  {
                    name: 'nome',
                    label: 'Nome',
                    type: 'text',
                    format: undefined,
                  },
                  {
                    name: 'cnpj',
                    label: 'CNPJ',
                    type: 'pattern',
                    format: '##.###.###/####-##',
                  },
                  {
                    name: 'nome_responsavel',
                    label: 'Responsável',
                    type: 'text',
                    format: undefined,
                  },
                  {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    format: undefined,
                  },
                  {
                    name: 'telefone',
                    label: 'Telefone',
                    type: 'pattern',
                    format: '(##) #####-####',
                  },
                  {
                    name: 'endereco',
                    label: 'Endereço',
                    type: 'text',
                    format: undefined,
                  },
                  {
                    name: 'cidade',
                    label: 'Cidade',
                    type: 'text',
                    format: undefined,
                  },
                  {
                    name: 'estado',
                    label: 'Estado',
                    type: 'text',
                    format: undefined,
                  },
                  {
                    name: 'cep',
                    label: 'CEP',
                    type: 'pattern',
                    format: '#####-###',
                  },
                ].map(({ name, label, format }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof typeof formSchema._type}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <FormattedInput
                            {...field}
                            format={format}
                            onValueChange={(values: any) => {
                              field.onChange(values.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button type='submit' className='w-full mt-4'>
                Salvar
              </Button>
            </form>
            <DialogConfirmForm
              title='Cliente cadastrado'
              text='Seu novo cliente para uso foi cadastrado com sucesso!'
              open={openDialog}
              setOpen={setOpenDialog}
            />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
