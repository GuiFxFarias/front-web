"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getEquipamentos } from "../servicos/api/getEquipamentos";
import { IEquipamento } from "@/lib/interface/Iequipamento";
import { IService } from "@/lib/interface/IService";
import { DialogVerProposta } from "@/app/(app)/servicos/dialogVerProposta";
import { getServices } from "../servicos/novoServico/api/getService";
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
import { putCodService } from "../servicos/novoServico/api/putService";
import { RegisterProduct } from "./newRegisterDialog";
import { getAllPecas } from "./api/getAllPecas";
import { Item } from "@/lib/interface/Ipecas";

const formSchema = z.object({
  status: z.string(),
});

export default function AlmoxarifadoItens() {
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

  const { data: allPecas = [], isLoading: loading } = useQuery(
    ["allPecas"],
    getAllPecas
  );

  const filteredPecas = allPecas.filter((item: Item) =>
    item.Descricao?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      {/* Conteúdo Principal */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Controle Almoxarifado
        </h1>
        <RegisterProduct />
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
      <div className="grid grid-cols-1 gap-1 overflow-y-auto max-h-[50vh]">
        {/* Card de Serviço 1 */}
        {isLoading ? (
          "Carregando..."
        ) : (
          <>
            {filteredPecas.map((data: Item) => {
              return (
                <Card key={data.ID} className="h-[5vh]">
                  <CardContent className="p-2">
                    <div className="flex justify-between">
                      <p className="w-[40%] truncate">{data.Descricao}</p>
                      <p className="text-gray-600 w-[45%]">
                        Valor da peça (única):
                        {data.valorPeca}
                      </p>
                      <p className="text-gray-800 w-[15%] font-semibold">
                        Quantidade: {data.Quantidade}
                      </p>
                    </div>
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
