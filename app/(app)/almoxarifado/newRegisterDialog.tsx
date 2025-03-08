"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterProductForm from "./registerForm";
import { RegisterPecasForm } from "./registerPecasForm";
import MoviEstoque from "./movEstoqueForm";

// Definição do schema de validação

export function RegisterProduct() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">+ Novos itens</Button>
      </DialogTrigger>
      <DialogContent className="w-[70vw] h-[60vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cadastre um produto pronto ou peças</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="produtos" className="w-full">
          <TabsList>
            <TabsTrigger value="produtos">Produto</TabsTrigger>
            <TabsTrigger value="movEstoque">
              Movimentação de estoque
            </TabsTrigger>
            <TabsTrigger value="pecas">Peças</TabsTrigger>
          </TabsList>
          <TabsContent value="produtos" className="pt-5 ">
            <RegisterProductForm />
          </TabsContent>
          <TabsContent value="movEstoque" className="pt-5">
            <MoviEstoque />
          </TabsContent>
          <TabsContent value="pecas" className="pt-5">
            <RegisterPecasForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
