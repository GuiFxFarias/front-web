import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPecasItem } from "@/lib/interface/Ipecas";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getEquipamentoId,
  IServPeca,
  postPecaServico,
  postService,
} from "./api/postService";
import { ICliente } from "@/lib/interface/Icliente";

export function DialogConfirm({
  services,
  category,
  equipament,
  model,
  codService,
  cliente,
}: {
  services: IPecasItem[];
  category: string;
  equipament: string;
  model: string;
  codService: string;
  cliente: ICliente;
}) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: equipId } = useQuery({
    queryKey: ["equipamentoId", equipament],
    queryFn: () => getEquipamentoId(equipament),
  });

  const mutateService = useMutation({
    mutationFn: postService,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });

  const mutatePecaServ = useMutation({
    mutationFn: postPecaServico,
    onSuccess: () => {
      queryClient.invalidateQueries(["pecaServ"]);
    },
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //
  // }

  function handleSaveService() {
    if (!codService) {
      console.log("CodeService Undefined");
      return;
    }

    const valueService = {
      modelo: model,
      categoria: category,
      equipamentoID: equipament,
      equipamentoDescricao: equipId.Descricao,
      codService: codService,
      idCliente: String(cliente.id),
      descCliente: cliente.nome,
    };

    mutateService.mutate(valueService);

    services.map((value: IPecasItem) => {
      const pecaServ: IServPeca = {
        codService: codService,
        peca_id: value.ID,
        quantidade_peca: value.Quantidade,
        idCliente: String(cliente.id),
      };

      mutatePecaServ.mutate(pecaServ);
    });

    router.push(
      `/servicos/novoServico/relatorioDoServico?codService=${codService}&equipament=${equipament}&idCliente=${cliente.id}`
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 text-white">
          Salvar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Peças | Cliente: {cliente.nome}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="border-b border-gray-700 pb-1 mb-5">
          Peças que serão utilizadas nesse serviço
        </DialogDescription>
        {services.map((service) => (
          <div key={service.ID}>
            <p className="border-b border-gray-300 pb-2">{service.Descricao}</p>
          </div>
        ))}
        <DialogFooter>
          <Button onClick={() => handleSaveService()} type="button">
            Enviar Serviço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
