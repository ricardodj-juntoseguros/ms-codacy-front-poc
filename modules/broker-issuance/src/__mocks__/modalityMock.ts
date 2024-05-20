export const modalityBidderMock = {
  id: 99,
  newQuoterId: 5,
  value: '99',
  label: 'Licitante',
  description: 'Licitante',
  labelNoticeContract: 'N° Edital ',
  labelNoticeAnnex: 'Anexo do Edital (Utilizar para DER/SP e SABESP) ',
  helpNoticeContract:
    'Preencher o campo N.° Edital com o número completo do Edital e/ou da Licitação. Após o preenchimento, caso esteja no GOL Clássico, clique no link abaixo, caso esteja na Nova Plataforma, faça a impressão da Minuta, para visualizar o texto formatado no Objeto da apólice. Caso não esteja de forma harmônica, revisar preenchimento do campo do N.° Edital / Contrato ou entre em contato com a Regional que lhe atende.',
  helpNoticeAnnex:
    'Esta caixa deve ser preenchida somente para os processos dos Segurados DER/SP e SABESP. Neste campo deve ser informado o Número do Anexo / Modelo previsto nos Editais do DER/SP e da SABESP. A descrição desta caixa será impressa nas condições particulares do documento. Caso esteja no GOL Clássico, após o preenchimento, clicar no link "Clique aqui para visualizar as Condições Particulares".   \r\n\r\nCASO NÃO SE TRATE DE UM PROCESSO DOS SEGURADOS DER/SP E SABESP, DEIXAR ESTA CAIXA EM BRANCO.  \r\n',
  isJudicial: false,
  showAuctionNoticeFields: false,
  submodalityIdForCoverageLabor: 0,
  typeModalityId: 2,
  typeModalityDescription: 'Modalidades Tradicionais',
  submodalities: [
    {
      id: 1,
      newQuoterId: 1,
      description: 'Trabalhista',
      useBill: true,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
        {
          id: 2,
          description: 'Fatura',
        },
      ],
      appealJudicialPremium: [],
    },
  ],
  needAcceptAdditionalCoverageLabor: false,
  showSpecialClause: true,
  labelSpecialClause:
    'Este processo solicita a inclusão da Cláusula de Irrevogabilidade',
  isSubstitute: false,
  allowsAdditionalCoverageLabor: false,
  allowsAdditionalCoverageVigilance: false,
  retroactiveDays: 1,
};

export const modalityDefaultMock = {
  id: 98,
  newQuoterId: 4,
  value: '98',
  label: 'Executante Fornecedor',
  description: 'Executante Fornecedor',
  labelNoticeContract: 'N° Edital / Contrato',
  labelNoticeAnnex: 'Anexo do Edital',
  helpNoticeContract:
    'No preenchimento do campo N.° Edital/Contrato, observar o seguinte:\r\na) Caso o Contrato já esteja assinado, preencher o campo com o número do Contrato;\r\nb) Caso o Contrato ainda não tenha sido assinado, preencher o campo com a seguinte frase, sem aspas: "a ser assinado, referente ao Edital n.° (AQUI DEVERÁ SER PREENCHIDO COM O NÚMERO REAL DO EDITAL REFERENTE A ESTA PROPOSTA)";\r\nc) Após o preenchimento, caso esteja no GOL Clássico, clique no link abaixo, caso esteja na Nova Plataforma, faça a impressão da Minuta, para visualizar o texto formatado no Objeto da apólice. Caso não esteja de forma harmônica, revisar preenchimento do campo do N.° Edital / Contrato ou entre em contato com a Regional que lhe atende.',
  helpNoticeAnnex:
    'Esta caixa deve ser preenchida somente para os processos dos Segurados DER/SP e SABESP. Neste campo deve ser informado o Número do Anexo / Modelo previsto nos Editais do DER/SP e da SABESP. A descrição desta caixa será impressa nas condições particulares do documento. Caso esteja no GOL Clássico, após o preenchimento, clicar no link "Clique aqui para visualizar as Condições Particulares".   \r\n\r\nCASO NÃO SE TRATE DE UM PROCESSO DOS SEGURADOS DER/SP E SABESP, DEIXAR ESTA CAIXA EM BRANCO.  ',
  isJudicial: false,
  showAuctionNoticeFields: false,
  submodalityIdForCoverageLabor: 0,
  typeModalityId: 2,
  typeModalityDescription: 'Modalidades Tradicionais',
  submodalities: [
    {
      id: 90,
      newQuoterId: 50,
      description: 'Trabalhista',
      useBill: false,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
        {
          id: 2,
          description: 'Fatura',
        },
      ],
      appealJudicialPremium: [],
    },
    {
      id: 92,
      newQuoterId: 51,
      description: 'Trabalhista e Previdenciária',
      useBill: false,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
        {
          id: 2,
          description: 'Fatura',
        },
      ],
      appealJudicialPremium: [],
    },
  ],
  needAcceptAdditionalCoverageLabor: false,
  showSpecialClause: false,
  labelSpecialClause: '',
  isSubstitute: false,
  allowsAdditionalCoverageLabor: true,
  allowsAdditionalCoverageVigilance: false,
  retroactiveDays: 180,
};

export const modalityServiceProfiderPerformerMock = {
  id: 97,
  newQuoterId: 3,
  value: '97',
  label: 'Executante Prestador de Serviços',
  description: 'Executante Prestador de Serviços',
  labelNoticeContract: 'N° Edital / Contrato',
  labelNoticeAnnex: 'Anexo do Edital',
  helpNoticeContract:
    'No preenchimento do campo N.° Edital/Contrato, observar o seguinte:\r\na) Caso o Contrato já esteja assinado, preencher o campo com o número do Contrato;\r\nb) Caso o Contrato ainda não tenha sido assinado, preencher o campo com a seguinte frase, sem aspas: "a ser assinado, referente ao Edital n.° (AQUI DEVERÁ SER PREENCHIDO COM O NÚMERO REAL DO EDITAL REFERENTE A ESTA PROPOSTA)";\r\nc) Após o preenchimento, caso esteja no GOL Clássico, clique no link abaixo, caso esteja na Nova Plataforma, faça a impressão da Minuta, para visualizar o texto formatado no Objeto da apólice. Caso não esteja de forma harmônica, revisar preenchimento do campo do N.° Edital / Contrato ou entre em contato com a Regional que lhe atende.',
  helpNoticeAnnex:
    'Esta caixa deve ser preenchida somente para os processos dos Segurados DER/SP e SABESP. Neste campo deve ser informado o Número do Anexo / Modelo previsto nos Editais do DER/SP e da SABESP. A descrição desta caixa será impressa nas condições particulares do documento. Após o preenchimento, caso esteja no GOL Clássico, clicar no link "Clique aqui para visualizar as Condições Particulares".   \r\n\r\nCASO NÃO SE TRATE DE UM PROCESSO DOS SEGURADOS DER/SP E SABESP, DEIXAR ESTA CAIXA EM BRANCO.  \r\n',
  isJudicial: false,
  showAuctionNoticeFields: false,
  submodalityIdForCoverageLabor: 0,
  typeModalityId: 2,
  typeModalityDescription: 'Modalidades Tradicionais',
  submodalities: [
    {
      id: 1,
      newQuoterId: 1,
      description: 'Convencional',
      useBill: false,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
      ],
      appealJudicialPremium: null,
    },
    {
      id: 26,
      newQuoterId: 13,
      description:
        'Trabalhista e Previdenciária (Nova Público - Sem Reembolso)',
      useBill: true,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
      ],
      appealJudicialPremium: null,
    },
  ],
  needAcceptAdditionalCoverageLabor: true,
  showSpecialClause: false,
  labelSpecialClause: null,
  isSubstitute: false,
  allowsAdditionalCoverageLabor: true,
  allowsAdditionalCoverageVigilance: false,
  retroactiveDays: 180,
};
