"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewServiceDialog } from "./newServiceDialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getEquipamentos } from "./api/getEquipamentos";
import { IEquipamento } from "@/lib/interface/Iequipamento";
import { IService } from "@/lib/interface/IService";
import { DialogVerProposta } from "@/app/(app)/servicos/dialogVerProposta";
import { getServices } from "./novoServico/api/getService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { putCodService } from "./novoServico/api/putService";

const formSchema = z.object({
  status: z.string(),
});

export default function ServicesItens() {
  const [search, setSearch] = useState<string>("");

  const queryClient = useQueryClient();

  const statusService = ["Não iniciado", "Em progresso", "Concluído"];

  const { data: services = [], isLoading } = useQuery(
    ["services"],
    getServices
  );

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

  const { data: equipamentos } = useQuery(["equipamentos"], getEquipamentos);

  const filteredServivces = services.filter((service: IService) =>
    service.descCliente?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      {/* Conteúdo Principal */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Serviços</h1>
        <NewServiceDialog />
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex items-center mb-6">
        <Input
          type="text"
          placeholder="Pesquisar cliente..."
          className="w-full max-w-md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[50vh]">
        {/* Card de Serviço 1 */}
        {isLoading ? (
          "Carregando..."
        ) : (
          <>
            {filteredServivces.map((data: IService) => {
              return (
                <Card key={data.id}>
                  <CardHeader className="flex justify-between flex-row items-center">
                    <CardTitle>Serviço {data.codService}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <DialogVerProposta
                        codService={data.codService}
                        descCliente={data.descCliente}
                        descEquipamento={data.equipamentoDescricao}
                      />
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
                                      id: data.codService as string,
                                    });
                                  }}
                                  defaultValue={data.status}
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 font-semibold">
                      Cliente: {data.descCliente}
                    </p>
                    <p className="text-gray-600">
                      Realizado em:{" "}
                      {new Date(data.DataCadastro)
                        .toLocaleString("pt-BR")
                        .slice(0, -3)}
                    </p>
                    {equipamentos.map((equip: IEquipamento) => {
                      return (
                        <div key={equip.ID}>
                          <p>
                            {data.equipamentoID == String(equip.ID)
                              ? `Equipamento: ${equip.Descricao}`
                              : null}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
