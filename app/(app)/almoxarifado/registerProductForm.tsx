import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  descProduto: z.string(),
  nSerieEquip: z.string(),
  protocolo: z.string(),
  nSerieSensor: z.string(),
  faixaSensor: z.string(),
  dataFabricacao: z.string(),
  preco: z.string(),
});

export default function RegisterProductForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descProduto: "",
      nSerieEquip: "",
      protocolo: "",
      nSerieSensor: "",
      faixaSensor: "",
      dataFabricacao: "",
      preco: "",
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
        {/* Campo: Descrição do Produto */}
        <FormField
          control={form.control}
          name="descProduto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Número de Série do Equipamento */}
        <FormField
          control={form.control}
          name="nSerieEquip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série do Equipamento</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número de série" {...field} />
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

        {/* Campo: Preço */}
        <FormField
          control={form.control}
          name="preco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Digite o preço"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Envio */}
        <Button type="submit">Cadastrar</Button>
      </form>
    </Form>
  );
}
