"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewServiceDialog } from "./newServiceDialog";
import { useQuery } from "react-query";
import { getEquipamentos } from "./api/getEquipamentos";
import { IEquipamento } from "@/lib/interface/Iequipamento";
import { IService } from "@/lib/interface/IService";
import { DialogVerProposta } from "@/app/(app)/servicos/dialogVerProposta";
import { getServices } from "./novoServico/api/getService";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ServicesItens() {
  const [search, setSearch] = useState<string>("");
  const [sStatus, setSstatus] = useState("");

  const { data: services = [], isLoading } = useQuery(
    ["services"],
    getServices
  );

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
