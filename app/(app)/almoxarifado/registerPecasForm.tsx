'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { postPecas } from './api/postAlmoxarife';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import DialogConfirmForm from '@/components/dialogConfirForm';
import { getEquipamentos } from '../servicos/api/getEquipamentos';
import { IEquipamento } from '@/lib/interface/Iequipamento';

interface ItemFormData {
  ItemID: string;
  carcaca: '1' | '0'; // Checkbox selection
  visor: '1' | '0'; // Checkbox selection
  numeroItem: number;
  descricao: string;
  codigo: string;
  observacao: string;
  valorPeca: string;
  nSerieSensor: string;
  nSeriePlaca: string;
  faixaSensor: string;
  dataFabricacao: string;
  protocolo: string;
  modeloPlaca: string;
  sensorPlaca: string;
}

interface IModel {
  id: number;
  value: string;
}

export const formSchema = z.object({
  ItemID: z.string(),
  carcaca: z.string().min(1, 'Carcaça é obrigatória.'),
  visor: z.string().min(1, 'Visor é obrigatório.'),
  numeroItem: z.number(),
  // quantidade: vou enviar 1 por padrao
  descricao: z.string().min(1, 'Descrição é obrigatória.'),
  codigo: z.string().optional(),
  observacao: z.string().optional(),
  // dataCadastro: timestamp
  valorPeca: z.string().min(1, 'Valor da peça é obrigatório.'),
  nSerieSensor: z.string().optional(),
  nSeriePlaca: z.string().optional(),
  faixaSensor: z.string().optional(),
  dataFabricacao: z.string().optional(),
  protocolo: z.string().optional(),
  modeloPlaca: z.string().optional(),
  sensorPlaca: z.string(),
});

export function RegisterPecasForm() {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ItemID: '1',
      carcaca: '1',
      visor: '0',
      numeroItem: 1,
      descricao: '',
      codigo: '',
      observacao: '',
      valorPeca: '',
      nSerieSensor: '',
      nSeriePlaca: '',
      faixaSensor: '',
      dataFabricacao: '',
      protocolo: '',
      modeloPlaca: '',
      sensorPlaca: '1',
    },
  });

  const [equipamento, setEquipamento] = useState<string>();
  const [carcaca, setCarcaca] = useState<string>();
  const [modelo, setModelo] = useState<string>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

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

  const queryClient = useQueryClient();

  const mutatePecas = useMutation({
    mutationFn: postPecas,
    onSuccess: () => {
      queryClient.invalidateQueries(['allPecas']);
    },
  });

  const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  function onSubmit(values: ItemFormData) {
    console.log(values);

    equipamentos
      .filter((itens: IEquipamento) => itens.ID == Number(values.ItemID))
      .map((item: IEquipamento) => {
        if (values.dataFabricacao == '') {
          const newValue = {
            ...values,
            Quantidade: 1,
            dataFabricacao: null,
            ItemID: item.ItemID,
          };
          mutatePecas.mutate(newValue, {
            onSuccess: () => {
              setOpenDialog(true);
              queryClient.invalidateQueries(['allPecas']);
            },
          });
          // console.log(newValue);
        } else {
          const newValue = {
            ...values,
            Quantidade: 1,
            ItemID: item.ItemID,
          };
          mutatePecas.mutate(newValue, {
            onSuccess: () => {
              setOpenDialog(true);
              queryClient.invalidateQueries(['allPecas']);
            },
          });
          // console.log(newValue);
        }
      });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 rounded-md w-[65vw] h-[42vh] overflow-y-auto px-2'
      >
        {/* Select de Equipamento */}
        <FormField
          control={form.control}
          name='ItemID'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipamento</FormLabel>
              <Select
                onValueChange={(value) => {
                  // console.log("Valor selecionado:", value);
                  field.onChange(value);
                  setEquipamento(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o equipamento' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipamentos?.map((item: IEquipamento) => (
                    <SelectItem key={item.ID} value={String(item.ID)}>
                      {item.Descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className='flex space-x-4'>
          {/* Campo: Carcaça (Checkboxes) */}
          <FormField
            control={form.control}
            name='carcaca'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carcaça</FormLabel>
                <FormControl>
                  <div className='flex space-x-4'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        value='1'
                        checked={field.value === '1'}
                        onChange={() => {
                          field.onChange('1');
                          setCarcaca('1');
                        }}
                        className='w-5 h-5'
                      />
                      <span>Sim</span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        value='0'
                        checked={field.value === '0'}
                        onChange={() => {
                          setCarcaca('0');
                          field.onChange('0');
                        }}
                        className='w-5 h-5'
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='visor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visor</FormLabel>
                <FormControl>
                  <div className='flex space-x-4'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        value='1'
                        checked={field.value === '1'}
                        onChange={() => field.onChange('1')}
                        className='w-5 h-5'
                      />
                      <span>Sim</span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        value='0'
                        checked={field.value === '0'}
                        onChange={() => field.onChange('0')}
                        className='w-5 h-5'
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='sensorPlaca'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de peça</FormLabel>
                <FormControl>
                  <div className='flex space-x-4'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        value='1'
                        checked={field.value === '1'}
                        onChange={() => field.onChange('1')}
                        className='w-5 h-5'
                      />
                      <span>Placa Eletrônica</span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        value='2'
                        checked={field.value === '2'}
                        onChange={() => field.onChange('2')}
                        className='w-5 h-5'
                      />
                      <span>Sensor</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Campo: Número do Item */}
        <FormField
          control={form.control}
          name='numeroItem'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Item</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Digite o número do item'
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} // Convert to number
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Descrição */}
        <FormField
          control={form.control}
          name='descricao'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder='Digite a descrição' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Código */}
        <FormField
          control={form.control}
          name='codigo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder='Digite o código' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Observação */}
        <FormField
          control={form.control}
          name='observacao'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Input placeholder='Digite uma observação' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Valor da Peça */}
        <FormField
          control={form.control}
          name='valorPeca'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Peça</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='Digite o valor'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Numero de serie da placa */}
        <FormField
          control={form.control}
          name='nSeriePlaca'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série da Placa</FormLabel>
              <FormControl>
                <Input
                  placeholder='Digite o número de série da placa'
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
              <FormLabel>Modelo da placa</FormLabel>
              <Select
                onValueChange={(value) => {
                  // console.log("Valor selecionado:", value);
                  field.onChange(value);
                  setModelo(value);
                }}
                value={modelo}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Modelo da placa' />
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

        {equipamento == '2' || carcaca == '0' ? null : (
          <>
            {/* Campo: Número de Série do Sensor */}
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
              name='faixaSensor'
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
              name='dataFabricacao'
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

        {/* Botão de Envio */}
        <Button type='submit'>Cadastrar</Button>
      </form>
      <DialogConfirmForm
        title='Peça cadastrada'
        text='Sua peça foi cadastrada com sucesso!'
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </Form>
  );
}
