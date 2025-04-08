'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Img from '@/assets/img/CocertLogo.png';
import { NewSaleDialog } from './newProdutoDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IVendaComProdutoCliente } from '@/lib/interface/todasVendas';
import { getTodasVendas } from './api/getTodasVendas';
import { putAttVendas } from './api/putVendas';

export default function ProdutoItens() {
  const queryClient = useQueryClient();
  const [, setSearch] = useState<string>('');

  const gerarPDF = (venda: IVendaComProdutoCliente[]) => {
    const doc = new jsPDF();
    const cliente = venda[0]; // usando o primeiro item para pegar os dados do cliente

    const dataFormatada = new Date().toLocaleDateString('pt-BR');

    // Adiciona cabeçalho
    const addHeader = () => {
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'normal');
      doc.text('CONCERT - INSTRUMENTAÇÃO INDUSTRIAL', 14, 15);
      doc.addImage(Img.src, 'PNG', 170, 5, 25, 25);
      doc.setFontSize(12);
      doc.text(
        `Proposta Nº ${cliente.idVenda.slice(0, 8).toUpperCase()} - Revisão 0`,
        14,
        22
      );

      doc.setFontSize(10);
      doc.text(`Data: ${dataFormatada}`, 14, 28);
      doc.line(10, 32, 200, 32);
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
      doc.setFont('helvetica', 'normal');
      doc.text('CONCERT - INSTRUMENTAÇÃO INDUSTRIAL', 100, 250);
      doc.text('RUA ÁLVARO ANTONIO MOSSIN, 253', 100, 256);
      doc.text('SERTÃOZINHO-SP - CEP: 14177-134', 100, 262);
      doc.text('CNPJ: 48.644.361/0001-05', 100, 268);
      doc.text('Fone: (16) 99149-8643', 100, 274);
      doc.addImage(Img.src, 'PNG', 14, 245, 35, 35);
    };

    // Conteúdo da proposta
    const addContentPage1 = () => {
      doc.setFontSize(12);
      doc.text(`AT.: ${cliente.nomeCliente}`, 14, 40);
      doc.text(
        `Fone: (${cliente.telefone?.slice(0, 2)}) ${cliente.telefone?.slice(
          2
        )}`,
        14,
        46
      );
      doc.text(`Email: ${cliente.email}`, 14, 52);

      doc.setFontSize(12);
      doc.text('Prezados(as) Senhores(as),', 14, 68);
      doc.setFontSize(10);
      doc.text(
        'Atendendo a vossa consulta, temos a satisfação de apresentar nossa proposta técnica para o fornecimento das peças solicitadas.',
        14,
        74,
        { maxWidth: 180 }
      );
      doc.text(
        'Estamos à disposição para quaisquer esclarecimentos que se façam necessários.',
        14,
        90,
        { maxWidth: 180 }
      );

      doc.setFontSize(12);
      doc.text('Atenciosamente,', 105, 200, { align: 'center' });
      doc.text('Willian Barbosa Garoni', 105, 206, { align: 'center' });
      doc.setFontSize(10);
      doc.text('Diretor Comercial', 105, 212, { align: 'center' });
      doc.text('Fone: (16) 99149-8643', 105, 218, { align: 'center' });
      doc.text('willian.garoni@concertind.com.br', 105, 224, {
        align: 'center',
      });
    };
    // Adiciona cabeçalho e conteúdo
    addHeader();
    addContentPage1();
    addFooter();

    const addContentPage2 = () => {
      const grouped = venda.reduce((acc, item) => {
        if (!acc[item.itemVenda]) acc[item.itemVenda] = [];
        acc[item.itemVenda].push(item);
        return acc;
      }, {} as Record<string, IVendaComProdutoCliente[]>);

      Object.entries(grouped).forEach(([itemVenda, produtos], index) => {
        if (index !== 0) doc.addPage();
        addHeader();
        addFooter();

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`1.1. Preços - Item de Venda ${itemVenda}`, 14, 40);

        const body = produtos.map((prod) => [
          itemVenda,
          `${prod.descricaoProduto ?? 'Sem descrição'}`,
          prod.preco
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(Number(prod.preco))
            : 'R$ 0,00',
        ]);

        autoTable(doc, {
          startY: 45,
          head: [['Item', 'Descrição', 'Valor (R$)']],
          body,
          theme: 'grid',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
        });

        const total = produtos.reduce(
          (sum, p) => sum + (p.preco ? Number(p.preco) : 0),
          0
        );

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 5,
          body: [['', 'TOTAL', '', `R$ ${total.toFixed(2)}`]],
          theme: 'grid',
          styles: { fontSize: 12, fontStyle: 'bold' },
          columnStyles: { 3: { textColor: [0, 0, 0] } },
        });
      });
    };

    const addContentPage3 = () => {
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Os preços dessa proposta estão expressos em Reais. Os mesmos são válidos \npara as quantidades, características e condições de pagamento especificadas nas propostas \ntécnica e comercial da CONCERT;',
        14,
        40,
        { align: 'justify', maxWidth: 185 }
      );
      doc.text(
        'Os preços não consideram o fornecimento de seguro garantia, carta fiança, seguro performance e \ndemais custos financeiros não indicados nas propostas;',
        14,
        53,
        { align: 'justify', maxWidth: 185 }
      );
      doc.text(
        'Estamos considerando que os equipamentos ofertados serão faturados para o Estado de \nSão Paulo (SP);',
        14,
        62,
        { align: 'justify', maxWidth: 185 }
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.2. Prazo de entrega', 14, 74);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'O prazo de entrega para o escopo de fornecimento descrito nesse documento é de 30 dias. O prazo \ndeverá ser confirmado na data de colocação do pedido de compras e deverá satisfazer as seguintes \ncondições:',
        14,
        82,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );
      doc.text(
        '- Início a partir do recebimento do pedido de compras e confirmação do pagamento do sinal \ncom o pedido;',
        16,
        108,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.text(
        '- Recebimento de todas as informações do cliente e necessárias ao processo de fabricação;',
        16,
        118,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );
      doc.text(
        '- Cadastro comercial atualizado para pagamentos a crédito;',
        16,
        123,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.text(
        '- Cumprimento das condições de pagamento acordadas, na data do vencimento de cada parcela.',
        16,
        128,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.3. Validade da proposta ', 14, 135);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Essa proposta tem validade de 10 dias corridos a partir da data da emissão. Os preços, prazos de \nentrega e demais condições são válidos para pedidos dentro do prazo de validade da proposta. \nOs pedidos de compra devem mencionar o número de nossa proposta.',
        14,
        142,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.4. Primeira compra  ', 14, 160);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Quando se tratar da primeira compra do cliente é necessário o envio em anexo ao pedido dos dados \ncadastrais completos para aprovação e liberação de crédito, sendo que o pedido será aceito \nsomente após este procedimento.',
        14,
        166,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );
    };

    const addContentPage4 = () => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.5. Aceite do pedido de compra ', 14, 40);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'O aceite se dará em um prazo máximo de 02 (dois) dias úteis após o recebimento do pedido de \ncompra do cliente.',
        14,
        46,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.6. Condição de pagamento  ', 14, 56);
      doc.setFont('helvetica', 'normal');

      doc.text(' 100% com 28 dias após o aceite da proposta.', 14, 62);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.7. Garantia ', 14, 68);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Garantia de 6 meses, a partir da emissão da NFe. A CONCERT garante que os produtos por ela revisados/revendidos estarão livres de defeitos em sua operação, desde que respeitadas às especificações e as instruções de montagem e utilização, devendo o equipamento ser entregue na CONCERT. Em caso de cancelamento de pedido após início dos serviços, será cobrada uma indenização de no mínimo 40% (quarenta por cento) do valor do pedido. ',
        14,
        74,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Estão exclusos da garantia:', 14, 100, {
        align: 'justify',
        maxWidth: 185,
      });

      doc.text(
        ' - Componentes normalmente sujeitos ao desgaste natural durante a operação; \n - Elementos de vida útil menor que o período de garantia; \n - Defeitos causados pelo transporte, manuseio e/ou armazenamento inadequado, quando estes serviços não são de responsabilidade do fornecedor; \n - Defeitos causados pela instalação inadequada quando a instalação não é de responsabilidade do fornecedor e não foi realizado por uma supervisão do fornecedor; \n - Defeitos causados por condições ambientais inadequadas (por exemplo, na presença de componentes agressivos); \n - Defeitos causados por operação fora dos limites da capacidade do equipamento; \n - Defeitos causados por manutenção inadequada e/ou reparos por parte de pessoas ou empresa não autorizadas por escrito pelo fornecedor. ',
        16,
        105,
        {
          align: 'left',
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.8. Frete', 14, 160);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Frete FOB - Incoterms 2020', 14, 165, {
        align: 'justify',
        maxWidth: 185,
      });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.9. Impostos', 14, 175);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Todos os impostos estão inclusos nos valores apresentados nesta proposta',
        14,
        180,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('1.10. Embalagem', 14, 190);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Adequada para o transporte rodoviário. Outros tipos de embalagem sob consulta.   ',
        14,
        195,
        {
          align: 'justify',
          maxWidth: 185,
        }
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold'); // Define o texto como negrito
      doc.text('Observações', 14, 205);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'A CONCERT não se responsabiliza pelo pagamento de fretes relativos ao envio de materiais em garantia ou conserto. Nossa proposta não inclui o fornecimento de treinamento ou assistência técnica em campo. Caso seja necessário entre em contato para que possamos prever este item em nossa proposta. Alguns equipamentos podem descalibrar/danificar caso exista choque mecânico no momento do transporte.',
        14,
        210,

        {
          align: 'justify',
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
    doc.save(`proposta_${cliente.nomeCliente}.pdf`);
  };

  const { data: allVendas = [], isLoading } = useQuery(
    ['vendas'],
    getTodasVendas
  );

  const sameVendas = allVendas.reduce((acc, venda) => {
    acc[venda.idVenda] = acc[venda.idVenda] || [];
    acc[venda.idVenda].push(venda);
    return acc;
  }, {} as Record<string, any[]>);

  for (const idVenda in sameVendas) {
    sameVendas[idVenda].forEach(() => {});
  }

  const mutateStatus = useMutation({
    mutationFn: ({ id, campo }: { id: string; campo: { status: string } }) =>
      putAttVendas(id, campo),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });

  function confirmarProposta(id: any, campoStatus: { status: string }) {
    mutateStatus.mutate({
      id,
      campo: {
        status: campoStatus.status,
      },
    });
  }

  return (
    <div className='flex-1 p-8'>
      {/* Conteúdo Principal */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Lista de Vendas</h1>
        <NewSaleDialog />
      </div>

      {/* Barra de Pesquisa */}
      <div className='flex items-center mb-6'>
        <Input
          type='text'
          placeholder='Pesquisar cliente...'
          className='w-full max-w-md'
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de Serviços */}
      <div className='grid grid-cols-1 gap-4 overflow-y-auto max-h-[50vh]'>
        {/* Card de Serviço 1 */}
        {isLoading ? (
          'Carregando...'
        ) : (
          <>
            {Object.entries(sameVendas).map(([idVenda, itens]) => {
              const itensTyped = itens as IVendaComProdutoCliente[];
              const item: IVendaComProdutoCliente = itensTyped[0];
              return (
                <Card key={idVenda}>
                  <CardHeader className='flex justify-between flex-row items-center'>
                    <CardTitle>Cliente: {item.nomeCliente}</CardTitle>

                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant='outline'
                          className='bg-blue-500 text-white'
                        >
                          Ver proposta
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='w-[50vw] justify-start flex flex-col'>
                        <DialogHeader>
                          <DialogTitle>
                            Proposta de venda para a(o) {item.nomeCliente}
                          </DialogTitle>
                          <DialogDescription>
                            Proposta {item.idVenda.slice(0, 8).toUpperCase()}{' '}
                            gerada no dia {item.dataProposta}
                          </DialogDescription>
                          <DialogDescription>
                            <p className='text-zinc-700'>
                              Para confirmar a venda basta finalizar a proposta
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                        <div className='flex w-full justify-between items-center mt-4'>
                          {' '}
                          <Button
                            className='bg-zinc-500 text-white hover:bg-blue-600'
                            onClick={() =>
                              confirmarProposta(item.idVenda, { status: '2' })
                            }
                          >
                            Cancelar proposta
                          </Button>
                          <div className='flex'>
                            <Button
                              className='bg-blue-500 mr-2 text-white hover:bg-blue-600'
                              onClick={() =>
                                confirmarProposta(item.idVenda, { status: '1' })
                              }
                            >
                              Confirmar proposta
                            </Button>
                            <Button onClick={() => gerarPDF(itensTyped)}>
                              Gerar PDF
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>

                  <CardContent className=' space-y-4'>
                    {itensTyped.map(
                      (
                        item: {
                          descricaoProduto: any;
                          nSerieEquipamento: any;
                          nSerieSensor: any;
                          dataProposta: any;
                          preco: any;
                        },
                        index: Key | null | undefined
                      ) => (
                        <div key={index} className='mb-4 border-b pb-2'>
                          <p className='text-gray-800 font-semibold'>
                            Descrição do produto:{' '}
                            {item.descricaoProduto || 'Não possui'}
                          </p>
                          <p className='text-gray-800'>
                            Número de série:{' '}
                            {item.nSerieEquipamento || 'Não possui'}
                          </p>
                          <p className='text-gray-800'>
                            Número de série do sensor:{' '}
                            {item.nSerieSensor || 'Não possui'}
                          </p>
                          <p className='text-gray-600'>
                            Data criação proposta:{' '}
                            {item.dataProposta || 'Não possui'}
                          </p>
                          <p className='text-gray-600'>
                            Valor da proposta:{' '}
                            {item.preco
                              ? new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(Number(item.preco))
                              : 'Não possui'}
                          </p>
                        </div>
                      )
                    )}
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
