import { configureStore } from '@reduxjs/toolkit';
import ModalitySlice from '../application/features/modalitySelection/ModalitySelectionSlice';
import validationSlice from '../application/features/validation/ValidationSlice';
import QuoteSlice from '../application/features/quote/QuoteSlice';
import PolicyholderSelectionSlice from '../application/features/policyholderSelection/PolicyholderSelectionSlice';
import InsuredSelectionSlice from '../application/features/insuredSelection/InsuredSelectionSlice';
import ProposalSlice from '../application/features/proposal/ProposalSlice';
import ContractualConditionSlice from '../application/features/contractualCondition/ContractualConditionSlice';
import ProposalDocumentsSlice from '../application/features/proposalDocuments/ProposalDocumentsSlice';
import CommercialAuthorizationSlice from '../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import AdditionalCoverageSlice from '../application/features/additionalCoverage/AdditionalCoverageSlice';
import IssuanceSlice from '../application/features/issuance/IssuanceSlice';

export const store = configureStore({
  reducer: {
    quote: QuoteSlice,
    policyholderSelection: PolicyholderSelectionSlice,
    modalitySelecion: ModalitySlice,
    insuredSelection: InsuredSelectionSlice,
    proposal: ProposalSlice,
    contractualCondition: ContractualConditionSlice,
    proposalDocuments: ProposalDocumentsSlice,
    commercialAuthorization: CommercialAuthorizationSlice,
    additionalCoverage: AdditionalCoverageSlice,
    validation: validationSlice,
    issuance: IssuanceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
