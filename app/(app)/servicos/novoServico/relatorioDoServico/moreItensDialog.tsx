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
import { getEquipamentos } from '../../api/getEquipamentos';
import { ICliente } from '@/lib/interface/Icliente';

const formSchema = z.object({
  modelo: z.string().min(1, 'Categoria é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  equipment: z.string().min(1, 'Equipamento é obrigatório'),
});

export function MoreItensDialog({
  title,
  cliente,
}: {
  title?: string;
  cliente: ICliente;
}) {
  // const queryClient = useQueryClient();
  const router = useRouter();
  const [categoryEquip, setCategoryEquip] = useState('');
  const [valueItem, setValueItem] = useState('');
  const [category, setCategory] = useState('');

  const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  const categories = [
    { value: 'Transmissor', label: 'Transmissor' },
    { value: 'Posicionador', label: 'Posicionador' },
  ];

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      modelo: '',
      equipment: '',
    },
  });

  function backRouter(values: z.infer<typeof formSchema>) {
    const equipItemId = equipamentos?.filter((item: IEquipamento) => {
      return item.Categoria === values.category;
    });

    // console.log(equipItemId[0].ItemID);
    router.push(
      `/servicos/novoServico?category=${values.category}&equipment=${values.equipment}&itemId=${equipItemId[0].ItemID}&model=${values.modelo}&cliente=${cliente.id}`
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600'>
          {title ? title : '+ Novo Serviço'}
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[95vw] sm:w-[50vw] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(backRouter)} className='space-y-4'>
            {/* Select de Equipamento */}

            {/* Select de Categoria */}
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
                      {categories.map((category) => {
                        return (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // console.log("Valor selecionado:", value);
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
                        <>
                          <SelectItem value='Posicionador'>
                            Posicionador
                          </SelectItem>
                        </>
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

            {/* Select de Equipamento */}
            <FormField
              control={form.control}
              name='equipment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // console.log("Valor selecionado:", value);
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
                          <SelectItem key={item.ID} value={String(item.ID)}>
                            {item.Descricao}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Botões de Ação */}
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type='submit'>Adicionar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
