import { thousandSeparator } from '@shared/utils';

export const dashboardTotals = [
  {
    key: 'policyholders',
    fieldName: 'totalPolicyholders',
    icon: 'briefcase',
    valueFormatter: thousandSeparator,
    label: 'Tomadores',
    useChangeValue: false,
  },
  {
    key: 'opportunities',
    fieldName: 'totalOpportunities',
    icon: 'file',
    valueFormatter: thousandSeparator,
    label: 'Total de oportunidades',
    useChangeValue: false,
  },
  {
    key: 'is',
    fieldName: 'totalIS',
    icon: 'dollar-sign',
    valueFormatter: undefined,
    label: 'Em importância segurada (IS)',
    useChangeValue: false,
  },
  {
    key: 'premium',
    fieldName: 'totalPremium',
    icon: 'dollar-sign',
    valueFormatter: undefined,
    label: 'Em prêmio estimado',
    useChangeValue: false,
  },
];
