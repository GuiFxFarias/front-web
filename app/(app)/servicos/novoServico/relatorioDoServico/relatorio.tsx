'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Img from '@/assets/img/CocertLogo.png';
import { useQuery } from 'react-query';
import { getServicesId } from '../api/postService';
import { useSearchParams } from 'next/navigation';
import { getClientesId } from '../../api/clientes';
import { IServiceID } from '@/lib/interface/IServiceID';
import { MoreItensDialog } from './moreItensDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServicoCodService } from './api/servicoCodService';
import { IService } from '@/lib/interface/IService';

interface IServiceItemDisplay {
  descricao: string;
  valor: number;
  quantidade: number;
  isExtra: boolean;
  itemService: number | string;
}

export default function Relatorio() {
  // const reportRef = useRef(null);
  const searchParams = useSearchParams();
  const codService = searchParams.get('codService');
  const idCliente = searchParams.get('idCliente');

  // Obtém a data atual
  const dataAtual = new Date();

  // Array com os nomes dos meses em português
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];

  // Formata a data no formato "dia de mês de ano"
  const dataFormatada = `${dataAtual.getDate()} de ${
    meses[dataAtual.getMonth()]
  } de ${dataAtual.getFullYear()}`;

  const { data: serviceId = [] } = useQuery(['services'], () =>
    getServicesId(codService || '')
  );

  console.log(serviceId);

  const { data: clienteID, isLoading } = useQuery(['clientes'], () =>
    getClientesId(idCliente || '')
  );

  const { data: servicoCodService } = useQuery(['servicesCodService'], () =>
    getServicoCodService(codService || '')
  );

  const gerarPDF = () => {
    const doc = new jsPDF();

    // Adiciona cabeçalho
    const addHeader = () => {
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('CONCERT - INSTRUMENTAÇÃO INDUSTRIAL', 14, 15);
      doc.addImage(Img.src, 'PNG', 170, 5, 25, 25);
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
      doc.text('CONCERT - INSTRUMENTAÇÃO INDUSTRIAL', 100, 250, {
        align: 'left',
      });
      doc.text('RUA ÁLVARO ANTONIO MOSSIN, 253', 100, 256, {
        align: 'left',
      });

      doc.text('SERTÃOZINHO-SP - CEP: 14177-134', 100, 262, {
        align: 'left',
      });

      doc.text('CNPJ: 48.644.361/0001-05', 100, 268, {
        align: 'left',
      });

      doc.text('Fone: (16) 99149-8643', 100, 274, {
        align: 'left',
      });
      doc.addImage(Img.src, 'PNG', 14, 245, 35, 35);
    };

    // Conteúdo da proposta
    const addContentPage1 = () => {
      doc.setFontSize(12);
      doc.text(`AT.: ${clienteID?.nome}`, 14, 40);
      doc.text(
        `Fone: ${clienteID.telefone?.slice(0, 4)} ${clienteID.telefone?.slice(
          4
        )}`,
        14,
        46
      );
      doc.text(`Email: ${clienteID?.email}`, 14, 52);

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
      if (!serviceId || serviceId.length === 0) {
        doc.text('Nenhuma peça encontrada.', 14, 30);
        return;
      }

      const groupedByItemService = serviceId.reduce((acc: any, data: any) => {
        if (!acc[data.itemService]) {
          acc[data.itemService] = [];
        }
        acc[data.itemService].push(data);
        return acc;
      }, {} as Record<string, IServiceID[]>);

      (
        Object.entries(groupedByItemService) as [string, IServiceID[]][]
      ).forEach(([itemServiceKey, dataList], index) => {
        if (index !== 0) {
          doc.addPage();
        }
        addHeader();
        addFooter();
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`1.1. Preços - Item do Serviço ${itemServiceKey}`, 14, 40);

        const tempBody: any[] = [];
        const tempInspecao: any[] = [];
        const tempInspecaoTomada: any[] = [];

        dataList.forEach((data: any) => {
          const serv = servicoCodService?.find(
            (s: any) =>
              s.itemService === data.itemService &&
              s.codService === data.codService
          );

          if (serv) {
            tempInspecao.push(`${data.insVisual}`);
            tempInspecaoTomada.push(`${data.manuPrevTomada}`);
            tempBody.push([
              `${data.quantidade_peca}`,
              `${data.itemService}`,
              `${serv.equipamentoDescricao} - ${data.peca_Descricao}`,
              `${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(Number(data.valorPeca))}`,
            ]);
          }
        });

        autoTable(doc, {
          startY: 45,
          head: [['Qtd', 'Item do serviço', 'Descrição', 'Valor (R$)']],
          body: tempBody,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 10 },
        });

        const itemServicesAdded = new Set();

        const totalValor = dataList.reduce((sum: number, data: any) => {
          let valor = Number(data.valorPeca);

          if (!itemServicesAdded.has(data.itemService)) {
            if (data.manuPreventiva) {
              valor += 450;
            }
            if (data.manuPrevTomada) {
              valor += 1500;
            }
            itemServicesAdded.add(data.itemService);
          }

          return sum + valor;
        }, 0);

        if (serviceId)
          autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            body: [
              [
                '',
                'TOTAL',
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalValor),
              ],
            ],
            theme: 'grid',
            styles: { fontSize: 12, fontStyle: 'bold' },
            columnStyles: { 2: { textColor: [0, 0, 0] } },
          });

        const uniqueInspecao = Array.from(
          new Set(tempInspecao.map((a) => String(a).trim()))
        );

        const uniqueTomada = Array.from(
          new Set(tempInspecaoTomada.map((a) => String(a).trim()))
        );

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Inspeção visual do equipamento', 14, 164);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text(
          uniqueInspecao.map((a) =>
            a ? a.trim() : 'Não foi inserido inspeção visual'
          ),
          14,
          170
        );

        doc.text(
          uniqueTomada.map((a) =>
            a == '1'
              ? 'Manutenção preventiva tomada de nível (desmontagem, jateamento, pintura, assepsia, reusinagem da tomada de nível, solda de lamida de aço inox 316L fornecimento com certificado de calibração com reastrabilidade RBC)'
              : 'Não existe tomada de nível'
          ),
          14,
          196,
          { align: 'justify', maxWidth: 185 }
        );
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
    doc.save(`proposta_${clienteID.nome}_${codService}.pdf`);
  };

  return (
    <div className='p-4 sm:p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-2xl sm:text-3xl font-normal mb-4'>
        Proposta Técnica: {codService} | Cliente:{' '}
        {!isLoading ? clienteID?.nome : 'Carregando...'}
      </h1>

      <h2 className='text-xl sm:text-2xl font-light mb-4 mt-10 text-start'>
        Tabela de Peças
      </h2>

      <div className='max-h-[60vh] overflow-y-auto space-y-4'>
        {servicoCodService?.map((serv: IService, index: number) => (
          <Card key={index} className='mt-2'>
            <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
              <CardTitle className='text-base sm:text-lg'>
                Item do serviço: {serv.itemService}
              </CardTitle>
            </CardHeader>

            <CardContent className='px-4 sm:px-8 text-sm space-y-2'>
              <p>
                <strong>Equipamento:</strong> {serv.equipamentoDescricao}
              </p>
              {serviceId
                .filter(
                  (value: IServiceID) =>
                    value.codService === serv.codService &&
                    value.itemService === serv.itemService
                )
                .map((peca: IServiceID, i: number) => (
                  <div key={i} className='border p-2 rounded-md bg-white'>
                    <p>
                      <strong>Visor ou carcaça:</strong>{' '}
                      {peca.Visor === '1' && peca.Carcaca === '1'
                        ? 'Visor e Carcaça'
                        : peca.Visor === '1'
                        ? 'Visor'
                        : peca.Carcaca === '1'
                        ? 'Carcaça'
                        : 'Nenhum'}
                    </p>
                    <p>
                      <strong>Inspeção visual:</strong>{' '}
                      {peca.insVisual || 'Não foi adicionado a inspeção visual'}
                    </p>
                    <p>
                      <strong>Tomada de nível:</strong>{' '}
                      {peca.manuPrevTomada ? 'Sim - R$1.500,00' : 'Não'}
                    </p>
                    <p>
                      <strong>Manutenção preventiva:</strong>{' '}
                      {peca.manuPreventiva ? 'Sim - R$450,00' : 'Não'}
                    </p>
                  </div>
                ))}

              <p className='font-semibold mt-4'>Peças de serviço:</p>

              <div className='ring-1 rounded-md ring-zinc-500 overflow-x-auto'>
                <div className='min-w-[500px] grid grid-cols-3 bg-blue-400 px-4 py-2 rounded-t-md text-white font-semibold text-sm'>
                  <div>Descrição</div>
                  <div>Valor</div>
                  <div>Quantidade</div>
                </div>
                {serviceId
                  .filter(
                    (value: IServiceID) =>
                      value.codService === serv.codService &&
                      value.itemService === serv.itemService
                  )
                  .reduce((acc: any[], peca: IServiceID) => {
                    const alreadyExists = acc.find(
                      (item) =>
                        item.itemService === peca.itemService && item.isExtra
                    );

                    acc.push({
                      descricao: peca.peca_Descricao,
                      valor: Number(peca.valorPeca),
                      quantidade: peca.quantidade_peca,
                      isExtra: false,
                      itemService: peca.itemService,
                    });

                    if (!alreadyExists) {
                      let extraValue = 0;
                      if (peca.manuPreventiva) extraValue += 450;
                      if (peca.manuPrevTomada) extraValue += 1500;

                      if (extraValue > 0) {
                        acc.push({
                          descricao: 'Manutenção preventiva',
                          valor: extraValue,
                          quantidade: 1,
                          isExtra: true,
                          itemService: peca.itemService,
                        });
                      }
                    }

                    return acc;
                  }, [])
                  .map((item: IServiceItemDisplay, idx: number) => (
                    <div
                      key={idx}
                      className='min-w-[500px] grid grid-cols-3 px-4 py-2 bg-zinc-100 text-sm border-t border-zinc-300'
                    >
                      <div className='truncate' title={item.descricao}>
                        {item.descricao}
                      </div>
                      <div>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.valor)}
                      </div>
                      <div>{item.quantidade}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='mt-6 flex flex-col sm:flex-row justify-end gap-4'>
        <MoreItensDialog title='Adicionar mais itens' cliente={clienteID} />
        <Button onClick={gerarPDF} className='bg-blue-500 text-white'>
          Gerar PDF
        </Button>
      </div>
    </div>
  );
}

//<div className="w-1/6 px-2 py-1 flex items-center justify-center ring-1 ring-zinc-200">
//
//</div>
