export const modalityMock = {
  id: 76,
  newQuoterId: 66,
  description: 'Judicial',
  labelNoticeContract: 'N.° dos Autos da Reclamação ',
  labelNoticeAnnex: 'Reclamante / Autor',
  helpNoticeContract:
    'N.° dos Autos da Reclamação Trabalhista; Movida por; Vara do Trabalho e Localidade da mesma \r\n\r\nNo preenchimento do campo N.° dos Autos da Reclamação Trabalhista; Movida por; Vara do Trabalho e Localidade da mesma, observar o seguinte:\r\na) Preencher o campo com o número dos Autos da Reclamação Trabalhista.\r\nb) Citar O nome da pessoa física que está movendo a Reclamação.\r\nc) Citar qual é a Vara do Trabalho que está tramitando o processo (Segurado da apólice), bem como, a localidade da mesma.\r\nd) Os campos em branco deverão ser preenchidos manualmente.\r\n\r\nCaso o objeto não esteja de forma harmônica, preencher manualmente, ou  entrar em contato com o Desenvolvimento.',
  helpNoticeAnnex:
    'Esta caixa deve ser preenchida somente para os processos dos Segurados DER/SP e SABESP. Neste campo deve ser informado o Número do Anexo / Modelo previsto nos Editais do DER/SP e da SABESP. A descrição desta caixa será impressa nas condições particulares do documento. Após o preenchimento, clicar no link "Clique aqui para visualizar as Condições Particulares".   \r\n\r\nCASO NÃO SE TRATE DE UM PROCESSO DOS SEGURADOS DER/SP E SABESP, DEIXAR ESTA CAIXA EM BRANCO. \r\n',
  isJudicial: true,
  showAuctionNoticeFields: false,
  submodalityIdForCoverageLabor: 0,
  typeModalityId: 1,
  typeModalityDescription: 'Modalidades Financeiras',
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
      ],
      appealJudicialPremium: [
        {
          judicialDurationInDays: 1095,
          securedAmountStart: 0.01,
        },
        {
          judicialDurationInDays: 1460,
          securedAmountStart: 0.01,
        },
        {
          judicialDurationInDays: 1825,
          securedAmountStart: 0.01,
        },
      ],
    },
    {
      id: 44,
      newQuoterId: 23,
      description: 'Cível',
      useBill: true,
      isSubstitute: false,
      isRecursal: false,
      payments: [
        {
          id: 1,
          description: 'Boleto',
        },
      ],
      appealJudicialPremium: [
        {
          judicialDurationInDays: 1095,
          securedAmountStart: 0,
        },
        {
          judicialDurationInDays: 1460,
          securedAmountStart: 0,
        },
        {
          judicialDurationInDays: 1825,
          securedAmountStart: 0,
        },
      ],
    },
    {
      id: 53,
      newQuoterId: 28,
      description: 'Substituição - Trabalhista',
      useBill: false,
      isSubstitute: true,
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
      appealJudicialPremium: [
        {
          judicialDurationInDays: 1095,
          securedAmountStart: 0,
        },
        {
          judicialDurationInDays: 1460,
          securedAmountStart: 0,
        },
        {
          judicialDurationInDays: 1825,
          securedAmountStart: 0,
        },
      ],
    },
  ],
  needAcceptAdditionalCoverageLabor: false,
  showSpecialClause: false,
  labelSpecialClause: null,
  isSubstitute: true,
  allowsAdditionalCoverageLabor: false,
  allowsAdditionalCoverageVigilance: false,
  retroactiveDays: 5,
};
