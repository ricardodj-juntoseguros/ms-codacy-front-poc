import { thousandSeparator, thousandTextFormatter } from '@shared/utils';

export const SUMMARY_CARDS = [
  {
    key: 'policyholders',
    icon: 'briefcase',
    valueFormatter: thousandSeparator,
    label: 'Tomadores',
    useChangeValue: false,
    isMoney: false
  },
  {
    key: 'opportunities',
    icon: 'file',
    valueFormatter: thousandSeparator,
    label: 'Total de oportunidades',
    useChangeValue: false,
    isMoney: false
  },
   {
    key: 'is',
    icon: 'dollar-sign',
    valueFormatter: thousandTextFormatter,
    label: 'Em importância segurada (IS)',
    useChangeValue: false,
    isMoney: true
  },
  /* {
    key: 'premium',
    icon: 'dollar-sign',
    valueFormatter: undefined,
    label: 'Em prêmio estimado',
    useChangeValue: false,
  }, */
];
