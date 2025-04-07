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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePostCliente } from './api/postCliente';

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

  const { mutate, isPending, isSuccess, isError } = usePostCliente();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data) => {
        console.log('Sucesso:', data);
        // aqui você pode resetar o form, mostrar toast, redirecionar, etc.
      },
      onError: (error) => {
        console.error('Erro ao salvar:', error);
      },
    });
  }

  return (
    <Card className='max-w-3xl mx-auto mt-10 h-[70vh] overflow-y-auto'>
      <CardContent className='p-6'>
        <h2 className='text-xl font-semibold mb-6 text-center'>
          Cadastro de Cliente
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                { name: 'nome', label: 'Nome' },
                { name: 'cnpj', label: 'CNPJ' },
                { name: 'nome_responsavel', label: 'Responsável' },
                { name: 'email', label: 'Email' },
                { name: 'telefone', label: 'Telefone' },
                { name: 'endereco', label: 'Endereço' },
                { name: 'cidade', label: 'Cidade' },
                { name: 'estado', label: 'Estado' },
                { name: 'cep', label: 'CEP' },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof typeof formSchema._type}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
        </Form>
      </CardContent>
    </Card>
  );
}
