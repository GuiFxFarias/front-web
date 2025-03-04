"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useQuery } from "react-query";
import { IEquipamento } from "@/lib/interface/Iequipamento";
import { getEquipamentos } from "../servicos/api/getEquipamentos";
import { getClientes } from "../servicos/api/clientes";
import { ICliente } from "@/lib/interface/Icliente";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  descProduto: z.string().min(1, "Selecione o produto"),
  nSerieEquip: z.string().min(1, "Selecione o numero de série"),
  protocolo: z.string().min(1, "Selecione o protocolo"),
  preco: z.string().min(1, "Insira o preco do produto"),
});

export function NewSaleDialog() {
  // const queryClient = useQueryClient();
  const router = useRouter();
  const [categoryEquip, setCategoryEquip] = useState("");
  const [valueItem, setValueItem] = useState("");
  const [valueCliente, setValueCliente] = useState("");
  const [category, setCategory] = useState("");

  const { data: equipamentos } = useQuery(["equipamentos"], getEquipamentos);

  const { data: dataCliente = [] as ICliente[] } = useQuery(
    ["clientes"],
    getClientes
  );

  const categories = [
    { value: "Transmissor", label: "Transmissor" },
    { value: "Posicionador", label: "Posicionador" },
  ];

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descProduto: "",
      nSerieEquip: "",
      protocolo: "",
      preco: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // const equipItemId = equipamentos?.filter((item: IEquipamento) => {
    //   return item.Categoria === values.category;
    // });
    // // console.log(equipItemId[0].ItemID);
    // router.push(
    //   `/servicos/novoServico?category=${values.category}&equipment=${values.equipment}&itemId=${equipItemId[0].ItemID}&model=${values.modelo}&cliente=${values.cliente}`
    // );
    // localStorage.setItem("serviceCode", "");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">+ Nova venda</Button>
      </DialogTrigger>
      <DialogContent className="w-[50vw]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Select de Equipamento */}
            <FormField
              control={form.control}
              name="descProduto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do produto</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValueCliente(value);
                    }}
                    value={valueCliente}
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
              name="nSerieEquip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de serie do equipamento</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setCategory(value);
                      setValueItem(" ");
                      field.onChange(value);
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
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="protocolo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocolo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // console.log("Valor selecionado:", value);
                      setCategoryEquip(value);
                      setValueItem(" ");
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category == "Transmissor" ? (
                        <>
                          <SelectItem value="Absoluto">Absoluto</SelectItem>
                          <SelectItem value="Diferencial">
                            Diferencial
                          </SelectItem>
                          <SelectItem value="Manometrico">
                            Manométrico
                          </SelectItem>
                        </>
                      ) : category == "Posicionador" ? (
                        <>
                          <SelectItem value="Posicionador">
                            Posicionador
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Absoluto">Absoluto</SelectItem>
                          <SelectItem value="Diferencial">
                            Diferencial
                          </SelectItem>
                          <SelectItem value="Manometrico">
                            Manométrico
                          </SelectItem>
                          <SelectItem value="Posicionador">
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
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <p>
                      Preço | <i>Preço cadastrado no almoxarifado:</i>
                    </p>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // console.log("Valor selecionado:", value);
                      field.onChange(value);
                      setValueItem(value);
                    }}
                    value={valueItem}
                  >
                    <FormControl>
                      <Input placeholder="Insira o preço da venda" {...field} />
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
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Cadastrar Serviço</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
