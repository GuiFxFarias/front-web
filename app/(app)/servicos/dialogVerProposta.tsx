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
      </DialogContent>
    </Dialog>
  );
}
