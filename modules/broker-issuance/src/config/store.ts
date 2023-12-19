import { configureStore } from '@reduxjs/toolkit';
import ModalitySlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import validationSlice from '../application/features/validation/ValidationSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';
import PolicyholderSelectionSlice from '../application/features/policyholderSelection/PolicyholderSelectionSlice';
import InsuredSelectionSlice from '../application/features/insuredSelection/InsuredSelectionSlice';
import ProposalSlice from '../application/features/proposal/ProposalSlice';
import ContractualConditionSlice from '../application/features/contractualCondition/ContractualConditionSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    policyholderSelection: PolicyholderSelectionSlice,
    modalitySelecion: ModalitySlice,
    insuredSelection: InsuredSelectionSlice,
    proposal: ProposalSlice,
    contractualCondition: ContractualConditionSlice,
    validation: validationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
