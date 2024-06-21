export const MODALITIES = {
  performingBuilder: 96, // Executante Construtor
  performerSupplier: 98, // Executante fornecedor
  performanceBond: 97, // Executante prestador de serviço
  advancePayment: 73, // Adiantamento de pagamento
  correctiveMaintenance: 95, // Manutenção corretiva
};

export const CONVENTIONAL_SUBMODALITY = 1;

export const SUBMODALITY_662 = 90;

export const SUBMODALITY_662_WITH_COVERAGE_LABOR = 92;

export const MODALITIES_INFORMATION = [
  {
    modalityId: 96,
    title: 'Construção de uma obra = Executante Construtor',
    text: 'Essa é a opção correta se sua empresa precisa garantir um contrato para a construção de uma obra, seja ela a construção total da estrutura ou uma reforma que inclua ampliação ou transformação estrutural do espaço.',
  },
  {
    modalityId: 97,
    title: 'Prestação de serviços = Executante Prestador de Serviços',
    text: 'Escolha essa opção se a prestação de serviços é o único objetivo do contrato a ser garantido. Serviços gerais ou técnicos são os mais comuns, mas contratos de reformas simples que não incluam alterações estruturais também devem ser incluídos aqui.',
  },
  {
    modalityId: 98,
    title: 'Fornecimento de bens ou materiais = Executante Fornecedor',
    text: 'Se o contrato a ser garantido tem como objetivo o fornecimento de um bem, material ou equipamento, selecione essa opção.',
  },
  {
    modalityId: 73,
    title: 'Antecipação de algum valor do contrato = Adiantamento de Pagamento',
    text: 'Nos contratos de fornecimento de materiais, equipamentos ou ainda em alguns contratos de construção, é comum que as empresas negociem a liberação de um adiantamento de pagamento antes do cumprimento de um determinado evento contratual, como, por exemplo, a compra de insumos. Escolha essa opção se esse for o caso.',
  },
  {
    modalityId: 95,
    title: 'Correção de falhas na execução do contrato = Manutenção corretiva',
    text: 'Essa é a solução mais eficaz para as empresas que desejam garantir a indenização pelos prejuízos decorrentes da não execução, dentro do prazo estabelecido em contrato, das ações corretivas apontadas pelo contratante (segurado) à empresa contratada (fornecedor) e necessárias para a correção da disfunção ocorrida por responsabilidade exclusiva do fornecer, durante a execução contratual.',
  },
];
