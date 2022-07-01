import { thousandSeparator } from '@shared/utils';

export const SUMMARY_CARDS = [
  {
    key: 'policyholders',
    icon: 'briefcase',
    valueFormatter: thousandSeparator,
    label: 'Tomadores',
    useChangeValue: false,
  },
  {
    key: 'opportunities',
    icon: 'file',
    valueFormatter: thousandSeparator,
    label: 'Total de oportunidades',
    useChangeValue: false,
  },
  /* {
    key: 'is',
    icon: 'dollar-sign',
    valueFormatter: undefined,
    label: 'Em importância segurada (IS)',
    useChangeValue: false,
  },
  {
    key: 'premium',
    icon: 'dollar-sign',
    valueFormatter: undefined,
    label: 'Em prêmio estimado',
    useChangeValue: false,
  }, */
];
