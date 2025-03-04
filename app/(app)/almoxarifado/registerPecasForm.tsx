"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Definição do schema de validação
const formSchema = z.object({
  itemID: z.string(),
  carcaca: z.string(),
  visor: z.string(),
  numeroItem: z.number(), // ! Se for transmissor ou posicionador
  quantidade: z.number(),
  descricao: z.string(),
  codigo: z.string(),
  observacao: z.string(),
  dataCadastro: z.string(),
  valorPeca: z.string(),
  nSerieSensor: z.string(),
  faixaSensor: z.string(),
  dataFabricacao: z.string(),
  protocolo: z.string(),
});

export function RegisterPecasForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carcaca: "",
      visor: "",
      numeroItem: "",
      quantidade: "",
      descricao: "",
      codigo: "",
      observacao: "",
      dataCadastro: "",
      valorPeca: "",
      nSerieSensor: "",
      faixaSensor: "",
      dataFabricacao: "",
      protocolo: "",
    },
  });

  function onSubmit(values: any) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-md w-[65vw] h-[60vh] overflow-y-auto px-2"
      >
        {/* Campo: Carcaça */}
        <FormField
          control={form.control}
          name="carcaca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carcaça</FormLabel>
              <FormControl>
                <Input placeholder="Digite a Carcaça" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Visor */}
        <FormField
          control={form.control}
          name="visor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visor</FormLabel>
              <FormControl>
                <Input placeholder="Digite o Visor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número do Item */}
        <FormField
          control={form.control}
          name="numeroItem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Item</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o número do item"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Quantidade */}
        <FormField
          control={form.control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite a quantidade"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Código */}
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Digite o código" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Observação */}
        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Input placeholder="Digite a observação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Data de Cadastro */}
        <FormField
          control={form.control}
          name="dataCadastro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Cadastro</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Valor da Peça */}
        <FormField
          control={form.control}
          name="valorPeca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Peça</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Digite o valor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série do Sensor */}
        <FormField
          control={form.control}
          name="nSerieSensor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série do Sensor</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número de série" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Faixa do Sensor */}
        <FormField
          control={form.control}
          name="faixaSensor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faixa do Sensor</FormLabel>
              <FormControl>
                <Input placeholder="Digite a faixa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Data de Fabricação */}
        <FormField
          control={form.control}
          name="dataFabricacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Fabricação</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Protocolo */}
        <FormField
          control={form.control}
          name="protocolo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protocolo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o protocolo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Envio */}
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
