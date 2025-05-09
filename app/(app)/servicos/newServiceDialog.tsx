'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useQuery } from 'react-query';
import { IEquipamento } from '@/lib/interface/Iequipamento';
import { getEquipamentos } from './api/getEquipamentos';
import { getClientes } from './api/clientes';
import { ICliente } from '@/lib/interface/Icliente';

const formSchema = z.object({
  cliente: z.string().min(1, 'Selecione o cliente'),
  modelo: z.string().min(1, 'Categoria é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  equipment: z.string().min(1, 'Equipamento é obrigatório'),
});

export function NewServiceDialog({ title }: { title?: string }) {
  // const queryClient = useQueryClient();
  const router = useRouter();
  const [categoryEquip, setCategoryEquip] = useState('');
  const [valueItem, setValueItem] = useState('');
  const [valueCliente, setValueCliente] = useState('');
  const [category, setCategory] = useState('');

  const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  const { data: dataCliente = [] as ICliente[] } = useQuery(
    ['clientes'],
    getClientes
  );

  const categories = [
    { value: 'Transmissor', label: 'Transmissor' },
    { value: 'Posicionador', label: 'Posicionador' },
  ];

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: '',
      category: '',
      modelo: '',
      equipment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const equipItemId = equipamentos?.filter((item: IEquipamento) => {
      return item.ID === Number(values.equipment);
    });

    console.log(equipItemId[0].ItemID);
    router.push(
      `/servicos/novoServico?category=${values.category}&equipment=${values.equipment}&itemId=${equipItemId[0].ItemID}&model=${values.modelo}&cliente=${values.cliente}`
    );
    localStorage.setItem('serviceCode', '');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600 w-full sm:w-auto'>
          {title ? title : '+ Novo Serviço'}
        </Button>
      </DialogTrigger>

      <DialogContent className='w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Cliente */}
            <FormField
              control={form.control}
              name='cliente'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValueCliente(value);
                    }}
                    value={valueCliente}
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

            {/* Modelo */}
            <FormField
              control={form.control}
              name='modelo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setCategory(value);
                      setValueItem(' ');
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o modelo' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Categoria */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setCategoryEquip(value);
                      setValueItem(' ');
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a categoria' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category == 'Transmissor' ? (
                        <>
                          <SelectItem value='Absoluto'>Absoluto</SelectItem>
                          <SelectItem value='Diferencial'>
                            Diferencial
                          </SelectItem>
                          <SelectItem value='Manometrico'>
                            Manométrico
                          </SelectItem>
                        </>
                      ) : category == 'Posicionador' ? (
                        <SelectItem value='Posicionador'>
                          Posicionador
                        </SelectItem>
                      ) : (
                        <>
                          <SelectItem value='Absoluto'>Absoluto</SelectItem>
                          <SelectItem value='Diferencial'>
                            Diferencial
                          </SelectItem>
                          <SelectItem value='Manometrico'>
                            Manométrico
                          </SelectItem>
                          <SelectItem value='Posicionador'>
                            Posicionador
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Equipamento */}
            <FormField
              control={form.control}
              name='equipment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValueItem(value);
                    }}
                    value={valueItem}
                  >
                    <FormControl>
                      <SelectTrigger className='max-[400px]:w-[81vw] max-[500px]:w-[84vw] max-[600px]:w-[88vw] max-md:w-full w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                        <SelectValue placeholder='Selecione o equipamento' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equipamentos
                        ?.filter(
                          (item: IEquipamento) =>
                            categoryEquip === item.Categoria
                        )
                        .map((item: IEquipamento) => (
                          <SelectItem
                            key={item.ID}
                            value={String(item.ID)}
                            title={item.Descricao}
                          >
                            {item.Descricao}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className='flex flex-col sm:flex-row justify-end gap-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => setOpen(false)}
                className='w-full sm:w-auto'
              >
                Cancelar
              </Button>
              <Button type='submit' className='w-full sm:w-auto'>
                Cadastrar Serviço
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
