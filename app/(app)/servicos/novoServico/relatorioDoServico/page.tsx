"use client";
// import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Img from "@/assets/img/CocertLogo.png";
import { useQuery } from "react-query";
import { getServicesId } from "../api/postService";
import { useRouter, useSearchParams } from "next/navigation";
import { getClientesId } from "../../api/clientes";
import { IServiceID } from "@/lib/interface/IServiceID";

export default function Relatorio() {
  // const reportRef = useRef(null);
  const searchParams = useSearchParams();
  const codService = searchParams.get("codService");
  const idCliente = searchParams.get("idCliente");
  const router = useRouter();

  // Obtém a data atual
  const dataAtual = new Date();

  // Array com os nomes dos meses em português
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  // Formata a data no formato "dia de mês de ano"
  const dataFormatada = `${dataAtual.getDate()} de ${
    meses[dataAtual.getMonth()]
  } de ${dataAtual.getFullYear()}`;

  const { data: serviceId = [] } = useQuery(["services"], () =>
    getServicesId(codService || "")
  );

  const { data: clienteID, isLoading } = useQuery(["clientes"], () =>
    getClientesId(idCliente || "")
  );

  const gerarPDF = () => {
    const doc = new jsPDF();

    // Adiciona cabeçalho
    const addHeader = () => {
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text("CONCERT - INSTRUMENTAÇÃO INDUSTRIAL", 14, 15);
      doc.addImage(Img.src, "PNG", 170, 5, 25, 25);
      doc.setFontSize(12);
      doc.text(`Proposta Nº ${codService}  - Revisão 0`, 14, 22);
      doc.setFontSize(10);
      doc.text(`Data: ${dataFormatada}`, 14, 28);
      doc.line(10, 32, 200, 32); // Linha separadora
    };

    // Adiciona rodapé
    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${pageCount}`, 180, 290);
      }
      doc.setFontSize(12);
      doc.text("CONCERT - INSTRUMENTAÇÃO INDUSTRIAL", 100, 250, {
        align: "left",
      });
      doc.text("RUA ÁLVARO ANTONIO MOSSIN, 253", 100, 256, {
        align: "left",
      });

      doc.text("SERTÃOZINHO-SP - CEP: 14177-134", 100, 262, {
        align: "left",
      });

      doc.text("CNPJ: 48.644.361/0001-05", 100, 268, {
        align: "left",
      });

      doc.text("Fone: (16) 99149-8643", 100, 274, {
        align: "left",
      });
      doc.addImage(Img.src, "PNG", 14, 245, 35, 35);
    };

    // Conteúdo da proposta
    const addContentPage1 = () => {
      doc.setFontSize(12);
      doc.text(`AT.: ${clienteID?.nome}`, 14, 40);
      doc.text(
        `Fone: (${clienteID?.telefone?.slice(
          0,
          2
        )}) ${clienteID?.telefone?.slice(2)}`,
        14,
        46
      );
      doc.text(`Email: ${clienteID?.email}`, 14, 52);

      doc.setFontSize(12);
      doc.text("Prezados(as) Senhores(as),", 14, 68);
      doc.setFontSize(10);
      doc.text(
        "Atendendo a vossa consulta, temos a satisfação de apresentar nossa proposta técnica para o fornecimento das peças solicitadas.",
        14,
        74,
        { maxWidth: 180 }
      );
      doc.text(
        "Estamos à disposição para quaisquer esclarecimentos que se façam necessários.",
        14,
        90,
        { maxWidth: 180 }
      );

      doc.setFontSize(12);
      doc.text("Atenciosamente,", 105, 200, { align: "center" });
      doc.text("Willian Barbosa Garoni", 105, 206, { align: "center" });
      doc.setFontSize(10);
      doc.text("Diretor Comercial", 105, 212, { align: "center" });
      doc.text("Fone: (16) 99149-8643", 105, 218, { align: "center" });
      doc.text("willian.garoni@concertind.com.br", 105, 224, {
        align: "center",
      });
    };
    // Adiciona cabeçalho e conteúdo
    addHeader();
    addContentPage1();
    addFooter();

    const addContentPage2 = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.1. Preços", 14, 40);
      // Criar tabela

      if (!serviceId || serviceId.length === 0) {
        doc.text("Nenhuma peça encontrada.", 14, 30);
      } else {
        const bodyData = serviceId.map((data: IServiceID) => [
          `${data.quantidade_peca}`,
          `${data.modelo} ${data.categoria} - ${data.Descricao}`,
          `${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(data.valorPeca))}`,
        ]);

        autoTable(doc, {
          startY: 45,
          head: [["Quantidade", "Descrição", "Valor (R$)"]],
          body: bodyData,
          theme: "grid",
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 10 },
        });

        // Calcular o total
        const totalValor = serviceId.reduce(
          (sum: number, data: IServiceID) => sum + Number(data.valorPeca),
          0
        );

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          body: [
            [
              "",
              "TOTAL",
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalValor),
            ],
          ],
          theme: "grid",
          styles: { fontSize: 12, fontStyle: "bold" },
          columnStyles: { 2: { textColor: [0, 0, 0] } },
        });
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Os preços dessa proposta estão expressos em Reais. Os mesmos são válidos \npara as quantidades, características e condições de pagamento especificadas nas propostas \ntécnica e comercial da CONCERT; ",
        14,
        207,
        {
          align: "justify",
          maxWidth: 185,
        }
      );
      doc.text(
        "Os preços não consideram o fornecimento de seguro garantia, carta fiança, seguro performance e \ndemais custos financeiros não indicados nas propostas;",
        14,
        223,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.text(
        "Estamos considerando que os equipamentos ofertados serão faturados para o Estado de \nSão Paulo (SP);",
        14,
        234,
        {
          align: "justify",
          maxWidth: 185,
        }
      );
    };

    const addContentPage3 = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.2. Prazo de entrega", 14, 40);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "O prazo de entrega para o escopo de fornecimento descrito nesse documento é de 30 dias. O prazo \ndeverá ser confirmado na data de colocação do pedido de compras e deverá satisfazer as seguintes \ncondições:",
        14,
        48,
        {
          align: "justify",
          maxWidth: 185,
        }
      );
      doc.text(
        "- Início a partir do recebimento do pedido de compras e confirmação do pagamento do sinal \ncom o pedido;",
        16,
        74,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.text(
        "- Recebimento de todas as informações do cliente e necessárias ao processo de fabricação;",
        16,
        84,
        {
          align: "justify",
          maxWidth: 185,
        }
      );
      doc.text(
        "- Cadastro comercial atualizado para pagamentos a crédito;",
        16,
        90,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.text(
        "- Cumprimento das condições de pagamento acordadas, na data do vencimento de cada parcela.",
        16,
        96,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.3. Validade da proposta ", 14, 104);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Essa proposta tem validade de 10 dias corridos a partir da data da emissão. Os preços, prazos de \nentrega e demais condições são válidos para pedidos dentro do prazo de validade da proposta. \nOs pedidos de compra devem mencionar o número de nossa proposta.",
        14,
        110,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.4. Primeira compra  ", 14, 130);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Quando se tratar da primeira compra do cliente é necessário o envio em anexo ao pedido dos dados \ncadastrais completos para aprovação e liberação de crédito, sendo que o pedido será aceito \nsomente após este procedimento.",
        14,
        136,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.5. Aceite do pedido de compra ", 14, 160);
      doc.setFont("helvetica", "normal");
      doc.text(
        "O aceite se dará em um prazo máximo de 02 (dois) dias úteis após o recebimento do pedido de \ncompra do cliente.",
        14,
        166,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.6. Condição de pagamento  ", 14, 180);
      doc.setFont("helvetica", "normal");

      doc.text(" 100% com 28 dias após o aceite da proposta.", 14, 186);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.7. Garantia ", 14, 198);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Garantia de 6 meses, a partir da emissão da NFe. A CONCERT garante que os produtos por ela revisados/revendidos estarão livres de defeitos em sua operação, desde que respeitadas às especificações e as instruções de montagem e utilização, devendo o equipamento ser entregue na CONCERT. Em caso de cancelamento de pedido após início dos serviços, será cobrada uma indenização de no mínimo 40% (quarenta por cento) do valor do pedido. ",
        14,
        204,
        {
          align: "justify",
          maxWidth: 185,
        }
      );
    };

    const addContentPage4 = () => {
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Estão exclusos da garantia:", 14, 44, {
        align: "justify",
        maxWidth: 185,
      });

      doc.text(
        " - Componentes normalmente sujeitos ao desgaste natural durante a operação; \n - Elementos de vida útil menor que o período de garantia; \n - Defeitos causados pelo transporte, manuseio e/ou armazenamento inadequado, quando estes serviços não são de responsabilidade do fornecedor; \n - Defeitos causados pela instalação inadequada quando a instalação não é de responsabilidade do fornecedor e não foi realizado por uma supervisão do fornecedor; \n - Defeitos causados por condições ambientais inadequadas (por exemplo, na presença de componentes agressivos); \n - Defeitos causados por operação fora dos limites da capacidade do equipamento; \n - Defeitos causados por manutenção inadequada e/ou reparos por parte de pessoas ou empresa não autorizadas por escrito pelo fornecedor. ",
        16,
        50,
        {
          align: "left",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.8. Frete", 14, 95);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Frete FOB - Incoterms 2020", 14, 100, {
        align: "justify",
        maxWidth: 185,
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.9. Impostos", 14, 110);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Todos os impostos estão inclusos nos valores apresentados nesta proposta",
        14,
        115,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("1.10. Embalagem", 14, 125);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Adequada para o transporte rodoviário. Outros tipos de embalagem sob consulta.   ",
        14,
        130,
        {
          align: "justify",
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold"); // Define o texto como negrito
      doc.text("Observações", 14, 140);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "A CONCERT não se responsabiliza pelo pagamento de fretes relativos ao envio de materiais em garantia ou conserto. Nossa proposta não inclui o fornecimento de treinamento ou assistência técnica em campo. Caso seja necessário entre em contato para que possamos prever este item em nossa proposta. Alguns equipamentos podem descalibrar/danificar caso exista choque mecânico no momento do transporte.",
        14,
        145,

        {
          align: "justify",
          maxWidth: 185,
        }
      );
    };

    doc.addPage();
    addHeader();
    addContentPage2();
    addFooter();

    doc.addPage();
    addHeader();
    addContentPage3();
    addFooter();

    doc.addPage();
    addHeader();
    addContentPage4();
    addFooter();

    // Salva o documento
    doc.save("proposta_tecnica.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-normal mb-4">
        Proposta Técnica: {codService} | Cliente:{" "}
        {!isLoading ? clienteID?.nome : "Carregando..."}
      </h1>
      <h1 className="text-2xl font-light mb-4 mt-10 text-start">
        Tabela de Peças
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Descrição</th>
              <th className="px-4 py-2 border">Categoria</th>
              <th className="px-4 py-2 border">Modelo</th>
              <th className="px-4 py-2 border">Cod. Serviço</th>
              <th className="px-4 py-2 border">Qtd Peça</th>
              <th className="px-4 py-2 border">Valor Peça</th>
              <th className="px-4 py-2 border">Visor</th>
              <th className="px-4 py-2 border">Carcaça</th>
            </tr>
          </thead>
          <tbody>
            {serviceId.map((peca: IServiceID) => (
              <tr key={peca.peca_id} className="hover:bg-gray-100 text-center">
                <td className="border px-4 py-2">{peca.peca_id}</td>
                <td className="border px-4 py-2">{peca.Descricao}</td>
                <td className="border px-4 py-2">{peca.categoria}</td>
                <td className="border px-4 py-2">{peca.modelo}</td>
                <td className="border px-4 py-2">{peca.codService}</td>
                <td className="border px-4 py-2">{peca.quantidade_peca}</td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(peca.valorPeca))}
                </td>
                <td className="border px-4 py-2">
                  {peca.Visor === "1" ? "Sim" : "Não"}
                </td>
                <td className="border px-4 py-2">
                  {peca.Carcaca === "1" ? "Sim" : "Não"}
                </td>
                {/* <td className="border px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    className="text-blue-500 border-blue-500"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-white bg-red-500"
                  >
                    Excluir
                  </Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão para adicionar mais um item a proposta */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => router.back()}
          className="bg-blue-500 text-white"
        >
          Adicionar mais um item
        </Button>
      </div>

      {/* Botão para gerar PDF */}
      <div className="mt-6 flex justify-end">
        <Button onClick={gerarPDF} className="bg-blue-500 text-white">
          Gerar PDF
        </Button>
      </div>
    </div>
  );
}
