"use client";

import { AlertCircle, Loader2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllPecas } from "./api/getAllPecas";
import { IPecas } from "@/lib/interface/Ipecas";
import { useEffect, useState } from "react";
import { putPecaQtd } from "./api/putPecaQtd";

interface movEstoque {
  descProduto: string;
  quantidade: string;
}

const formSchema = z.object({
  descProduto: z.string(),
  quantidade: z.string(),
});

export default function MoviEstoque() {
  const queryClient = useQueryClient();
  const [valueItem, setValueItem] = useState("");
  const [movEstoque, setMovEstoque] = useState("");
  const [alert, setAlert] = useState<boolean>(false);
  const [qtd, setQtd] = useState<number>(0);

  const { data: allPecas = [], isLoading } = useQuery(
    ["allPecas"],
    getAllPecas
  );

  useEffect(() => {
    allPecas.filter((item: IPecas) => {
      return String(item.ID) == valueItem ? setQtd(item.Quantidade) : null;
    });
  }, [allPecas, valueItem]);

  const form = useForm<movEstoque>({
    resolver: zodResolver(formSchema),
  });

  const mutatePutService = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { ID: number; Quantidade: number };
    }) => putPecaQtd(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(["allPecas"]);
    },
  });

  function onSubmit(values: movEstoque) {
    if (qtd < Number(values.quantidade) && movEstoque === "sub") {
      console.log("teste");
      setAlert(true);
    }

    if (movEstoque === "add") {
      mutatePutService.mutate({
        id: values.descProduto,
        body: {
          ID: Number(values.descProduto),
          Quantidade: qtd + Number(values.quantidade),
        },
      });
      setAlert(false);
    } else if (qtd > Number(values.quantidade) && movEstoque === "sub") {
      mutatePutService.mutate({
        id: values.descProduto,
        body: {
          ID: Number(values.descProduto),
          Quantidade: qtd - Number(values.quantidade),
        },
      });
      setAlert(false);
    }
  }

  return (
    <Form {...form}>
      {isLoading ? (
        "Carregando..."
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-md w-[65vw] h-[60vh] overflow-y-auto px-2"
        >
          <Alert
            className={alert ? "block border-red-500 bg-red-100" : "hidden"}
          >
            <AlertCircle className="h-4 w-4 " color="red" />
            <AlertTitle className="text-red-500 font-semibold">
              Error
            </AlertTitle>
            <AlertDescription className="text-red-500">
              Não é possivel retirar mais itens do que os cadastrados.
            </AlertDescription>
          </Alert>
          {/* Campo: Número de Série do Equipamento */}
          <FormField
            control={form.control}
            name="descProduto"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValueItem(value);
                  }}
                  value={valueItem || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o equipamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allPecas.map((item: IPecas) => (
                      <SelectItem key={item.ID} value={String(item.ID)}>
                        {item.Descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Campo: Descrição do Produto */}
          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantidade em estoque:{" "}
                  {isLoading ? <Loader2Icon className="animate-spin" /> : qtd}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão de Envio */}
          <div className="flex flex-row justify-between">
            <Button
              type="submit"
              onClick={() => setMovEstoque("sub")}
              className="mr-2"
            >
              Retirar
            </Button>
            <Button type="submit" onClick={() => setMovEstoque("add")}>
              Adicionar
            </Button>
          </div>
        </form>
      )}
    </Form>
  );
}
