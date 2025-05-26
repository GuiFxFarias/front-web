'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getClientes } from '@/app/(app)/servicos/api/clientes';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const tiposServico = ['Fornecimento', 'Manutenção', 'Pintura', 'Outros'];

// 🧩 Schema
const formSchema = z.object({
  data_abertura: z.string().min(1, 'Data obrigatória'),
  tipo_servico: z.string().min(1, 'Tipo obrigatório'),
  cliente_id: z.string().min(1, 'Cliente obrigatório'),
});

// 🧾 Tipagem
type FormSchema = z.infer<typeof formSchema>;

export function DialogNovaOS() {
  const [, setOsCriada] = useState<FormSchema | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_abertura: '',
      tipo_servico: '',
      cliente_id: '',
    },
  });

  const { data: dataCliente = [] } = useQuery(['clientes'], getClientes);

  const onSubmit = (data: FormSchema) => {
    console.log('Dados enviados:', data);
    setOsCriada(data);
  };

  return (
    <div className='flex gap-8 items-start'>
      <Dialog>
        <DialogTrigger className='bg-blue-500 rounded-md p-2 text-white'>
          + Nova O.S.
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <DialogHeader>
                <DialogTitle>Criar Ordem de Serviço</DialogTitle>
              </DialogHeader>

              {/* Data de Abertura */}
              <FormField
                control={form.control}
                name='data_abertura'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Abertura</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Serviço */}
              <FormField
                control={form.control}
                name='tipo_servico'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposServico.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cliente */}
              <FormField
                control={form.control}
                name='cliente_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um cliente' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataCliente.map(
                          (cliente: { id: number; nome: string }) => (
                            <SelectItem
                              key={cliente.id}
                              value={String(cliente.id)}
                            >
                              {cliente.nome}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type='submit'>Salvar O.S.</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
