"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { IServiceID } from "@/lib/interface/IServiceID";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "react-query";
import { putCodService } from "./novoServico/api/putService";
import { putPecaQtd } from "../almoxarifado/api/putPecaQtd";

const formSchema = z.object({
  status: z.string(),
});

interface movEstoque {
  descProduto: string;
  quantidade: string;
}

export function DialogVerProposta({
  codService,
  descCliente,
  descEquipamento,
}: {
  codService: string;
  descCliente: string;
  descEquipamento: string;
}) {
  const [pecaService, setPecaService] = useState([]);
  const [movEstoque, setMovEstoque] = useState("");
  const [alert, setAlert] = useState<boolean>(false);
  const [qtd, setQtd] = useState<number>(0);

  const queryClient = useQueryClient();

  const statusService = ["Não iniciado", "Em progresso", "Concluído"];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mutatePutService = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status: string } }) =>
      putCodService(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });

  const mutatePutPecaQtd = useMutation({
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

  function confirmEstoque(ID, qtd) {
    if (qtd < Number(qtd) && movEstoque === "sub") {
      console.log("teste");
      setAlert(true);
    }
    mutatePutPecaQtd.mutate({
      id: ID,
      body: {
        ID: Number(ID),
        Quantidade: qtd - Number(qtd),
      },
    });
  }

  useEffect(() => {
    async function getEquipId(codService: string) {
      try {
        const response = await fetch(
          `http://localhost:3001/servicos/${codService}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const dataPecaServ = await response.json();
        setPecaService(dataPecaServ);
      } catch (error) {
        console.error("Erro ao buscar equipamento:", error);
      }
    }

    getEquipId(codService);
  }, [codService]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 text-white">
          Ver proposta
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw]">
        <DialogHeader>
          <DialogTitle>
            Proposta Técnica: {codService} | {descCliente}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="border-b border-gray-700 pb-1 mb-5">
          Peças que serão utilizadas nesse serviço
        </DialogDescription>
        <div className="h-[40vh]">
          <h1 className="text-2xl font-light mb-4 text-start">
            Tabela de Peças | {descEquipamento}
          </h1>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {pecaService.map((serviceId: IServiceID, index) => {
              return (
                <div className="px-4 py-2 border-b border-gray-200" key={index}>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-gray-800">
                      {serviceId.Descricao}
                    </p>
                    <p className="text-gray-600">
                      Quantidade: {serviceId.Quantidade}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Form {...form}>
          <form className="flex space-x-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => {
                      const status = { status: value };
                      mutatePutService.mutate({
                        body: status,
                        id: codService as string,
                      });
                    }}
                    defaultValue={status}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status do projeto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {statusService.map((status, index) => (
                          <SelectItem value={status} key={index}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button type="submit">Confirmar</Button>
      </DialogContent>
    </Dialog>
  );
}
