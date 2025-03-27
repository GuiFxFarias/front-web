'use client'

import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getClientes } from '../servicos/api/clientes'
import { ICliente } from '@/lib/interface/Icliente'
import { Input } from '@/components/ui/input'
import { getAllPrdTransmissor } from './api/getPrdTransmissor'
import { IPrdTrm } from '@/lib/interface/IprdTrm'
import { putPrdTrm } from './api/putPrdTrm'

const formSchema = z.object({
  cliente: z.string().min(1, 'Selecione o cliente'),
  modelo: z.string().min(1, 'Selecione o modelo'),
  marca: z.string().min(1, 'Selecione a marca'),
  prdTrm: z.string().min(1, 'Selecione o produto'),
  preco: z.string().min(1, 'Insira o preco do produto'),
})

export function NewSaleDialog() {
  const queryClient = useQueryClient()
  const [valueItem, setValueItem] = useState('')
  const [marca, setMarca] = useState('')
  const [id, setId] = useState('')

  const { data: dataCliente = [] as ICliente[] } = useQuery(
    ['clientes'],
    getClientes,
  )

  const { data: prdTrm = [] as IPrdTrm[] } = useQuery(
    ['prdTrm'],
    getAllPrdTransmissor,
  )

  const categories = [
    { value: 'Transmissor', label: 'Transmissor' },
    { value: 'Posicionador', label: 'Posicionador' },
  ]

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: '',
      modelo: '',
      marca: '',
      prdTrm: '',
      preco: '',
    },
  })

  const marcas = [
    { id: 1, value: 'SMAR' },
    { id: 2, value: 'YOKOGAWA' },
    { id: 3, value: 'ROSEMOUNT' },
    { id: 4, value: 'ENDRES+HAUSER' },
    { id: 5, value: 'ABB' },
    { id: 6, value: 'SIEMENS' },
    { id: 7, value: 'FOXBORO' },
  ]

  const mutateService = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: { dataProposta: string; cliente: string }
    }) => putPrdTrm(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const body = {
      dataProposta:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      cliente: values.cliente,
    }

    mutateService.mutate({
      id: String(values.prdTrm),
      body: body,
    })
    setOpen(false)
  }

  const filteredPrdTrm = prdTrm.filter((item: IPrdTrm) => marca == item.modelo)

  const precoFilteredPrdTrm = prdTrm.filter(
    (item: IPrdTrm) => id == String(item.id),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">+ Nova venda</Button>
      </DialogTrigger>
      <DialogContent className="w-[50vw]">
        <DialogHeader>
          <DialogTitle>Nova venda</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Select de Equipamento */}
            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
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

            {/* Select de Categoria */}
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione o modelo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
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
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Select de Marca */}
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione a marca</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setMarca(value)
                      field.onChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {marcas.map((category) => {
                        return (
                          <SelectItem key={category.id} value={category.value}>
                            {category.value}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Select de Equipamento cadastrado no almoxarifado */}
            <FormField
              control={form.control}
              name="prdTrm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione os produtos</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setId(value)
                      field.onChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPrdTrm.map((prdTrm: IPrdTrm) => {
                        return (
                          <SelectItem key={prdTrm.id} value={String(prdTrm.id)}>
                            {prdTrm.descricaoProduto} {prdTrm.nSerieEquipamento}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Select de Equipamento */}
            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <p>
                      <i>
                        Preço cadastrado no almoxarifado:{' '}
                        {precoFilteredPrdTrm.map((a: IPrdTrm) =>
                          new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(Number(a.preco)),
                        )}
                      </i>
                    </p>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // console.log("Valor selecionado:", value);
                      field.onChange(value)
                      setValueItem(value)
                    }}
                    value={valueItem}
                  >
                    <FormControl>
                      <Input placeholder="Adicione um valor" {...field} />
                    </FormControl>
                  </Select>
                </FormItem>
              )}
            />

            {/* Botões de Ação */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Cadastrar Proposta</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
