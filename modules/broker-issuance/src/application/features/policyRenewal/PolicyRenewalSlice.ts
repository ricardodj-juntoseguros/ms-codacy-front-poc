import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeToast } from 'junto-design-system';
import { RootState } from '../../../config/store';
import {
  PolicyDocumentRenewalModel,
  PolicyRenewalModel,
  PolicyRenewalTypeEnum,
} from '../../types/model';
import { VerifyPolicyDTO } from '../../types/dto';
import handleError from '../../../helpers/handlerError';
import PolicyRenewalApi from './PolicyRenewalApi';

export const verifyPolicy = createAsyncThunk<
  VerifyPolicyDTO,
  { mainPolicyNumber: string; policyholderId: number },
  { rejectValue: VerifyPolicyDTO | string }
>(
  'policyRenewal/verifyPolicy',
  async ({ mainPolicyNumber, policyholderId }, { rejectWithValue }) => {
    return PolicyRenewalApi.verifyPolicy(mainPolicyNumber, policyholderId)
      .then(async response => response)
      .catch(error => {
        const errorResult = error.response || error;
        if (errorResult.status !== 400) {
          const message = handleError(errorResult);
          return rejectWithValue(message);
        }
        return rejectWithValue(errorResult.data.data);
      });
  },
);

export const getRenewalDocumentList = createAsyncThunk(
  'policyRenewal/getRenewalDocumentList',
  async (_, { rejectWithValue }) => {
    return PolicyRenewalApi.getRenewalDocumentList()
      .then(response => response.data)
      .catch(error => rejectWithValue(makeToast('error', handleError(error))));
  },
);

const initialState: PolicyRenewalModel = {
  isPolicyRenewal: false,
  policyRenewalType: PolicyRenewalTypeEnum.Undefined,
  mainPolicyNumber: '',
  documentNumber: null,
  verifyErrorMessage: '',
  needEndorsement: false,
  verifyPolicyLoading: false,
  hasPolicyRenewalChanges: false,
  documentList: [],
  getRenewalDocumentListLoading: false,
};

export const policyRenewalSlice = createSlice({
  initialState,
  name: 'policyRenewal',
  reducers: {
    setIsPolicyRenewal: (state, action: PayloadAction<boolean>) => {
      state.isPolicyRenewal = action.payload;
      state.hasPolicyRenewalChanges = true;
      if (action.payload === false) {
        state.policyRenewalType = PolicyRenewalTypeEnum.Undefined;
        state.mainPolicyNumber = '';
        state.verifyErrorMessage = '';
        state.documentNumber = null;
        state.needEndorsement = false;
      }
    },
    setPolicyRenewalType: (
      state,
      action: PayloadAction<PolicyRenewalTypeEnum>,
    ) => {
      state.policyRenewalType = action.payload;
      state.mainPolicyNumber = '';
      state.verifyErrorMessage = '';
      state.documentNumber = null;
      state.needEndorsement = false;
      state.hasPolicyRenewalChanges = true;
    },
    setMainPolicyNumber: (state, action: PayloadAction<string>) => {
      state.mainPolicyNumber = action.payload;
      state.verifyErrorMessage = '';
      state.documentNumber = null;
      state.needEndorsement = false;
      state.hasPolicyRenewalChanges = true;
    },
    setHasPolicyRenewalChanges: (state, action: PayloadAction<boolean>) => {
      state.hasPolicyRenewalChanges = action.payload;
    },
    setDocument: (
      state,
      action: PayloadAction<{
        document: PolicyDocumentRenewalModel;
        active: boolean;
      }>,
    ) => {
      const { document, active } = action.payload;
      const documentIndex = state.documentList.findIndex(
        item => item.id === document.id,
      );
      if (!active) {
        state.documentList[documentIndex] = {
          ...document,
          active,
          inputValue: '',
          hasOrdinaryNumbering: true,
        };
        return;
      }
      state.documentList[documentIndex] = { ...document, active };
    },
    setDocumentInputValue: (
      state,
      action: PayloadAction<{ value: string; id: number }>,
    ) => {
      const { value, id } = action.payload;
      if (value === '') return;
      const documentIndex = state.documentList.findIndex(
        item => item.id === id,
      );
      state.documentList[documentIndex] = {
        ...state.documentList[documentIndex],
        inputValue: value,
      };
      state.hasPolicyRenewalChanges = true;
    },
    setHasOrdinaryNumbering: (
      state,
      action: PayloadAction<{ hasOrdinaryNumbering: string; id: number }>,
    ) => {
      const { hasOrdinaryNumbering, id } = action.payload;
      const documentIndex = state.documentList.findIndex(
        document => document.id === id,
      );
      state.documentList[documentIndex] = {
        ...state.documentList[documentIndex],
        hasOrdinaryNumbering: hasOrdinaryNumbering === 'true',
      };
      state.hasPolicyRenewalChanges = true;
    },
    setPolicyRenewalResume: (
      state,
      action: PayloadAction<{
        isPolicyRenewal: boolean;
        documentList: PolicyDocumentRenewalModel[];
        type: PolicyRenewalTypeEnum;
        mainPolicyNumber: string;
      }>,
    ) => {
      const { isPolicyRenewal, type, mainPolicyNumber, documentList } =
        action.payload;
      state.isPolicyRenewal = isPolicyRenewal;
      state.policyRenewalType = type;
      state.mainPolicyNumber = mainPolicyNumber;
      state.documentList = documentList;
    },
    resetPolicyRenewal: state => {
      state.isPolicyRenewal = false;
      state.policyRenewalType = PolicyRenewalTypeEnum.Undefined;
      state.mainPolicyNumber = '';
      state.verifyErrorMessage = '';
      state.documentNumber = null;
      state.needEndorsement = false;
      state.verifyPolicyLoading = false;
      state.hasPolicyRenewalChanges = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(verifyPolicy.pending, state => {
        state.verifyPolicyLoading = true;
      })
      .addCase(verifyPolicy.fulfilled, (state, action) => {
        state.documentNumber = action.payload.documentNumber;
        state.verifyErrorMessage = action.payload.message;
        state.needEndorsement = action.payload.needEndorsement;
        state.verifyPolicyLoading = false;
      })
      .addCase(verifyPolicy.rejected, (state, action) => {
        state.verifyPolicyLoading = false;
        if (typeof action.payload === 'string') {
          makeToast('error', action.payload);
        }
        if (
          typeof action.payload !== 'string' &&
          typeof action.payload !== 'undefined'
        ) {
          state.documentNumber = action.payload?.documentNumber;
          state.verifyErrorMessage = action.payload?.message;
          state.needEndorsement = action.payload?.needEndorsement;
        }
      })
      .addCase(getRenewalDocumentList.pending, state => {
        state.getRenewalDocumentListLoading = true;
      })
      .addCase(getRenewalDocumentList.fulfilled, (state, action) => {
        state.documentList = action.payload.map(document => ({
          id: document.id,
          description: document.description,
          hasChoiceOfNumberingType: document.hasChoiceOfNumberingType,
          active: false,
          inputValue: '',
          hasOrdinaryNumbering: false,
          value: document.id.toString(),
          label: document.description,
          disabled: false,
        }));
        state.getRenewalDocumentListLoading = false;
      })
      .addCase(getRenewalDocumentList.rejected, state => {
        state.getRenewalDocumentListLoading = false;
      });
  },
});

export const selectPolicyRenewal = (state: RootState) => state.policyRenewal;

export const { actions: policyRenewalActions } = policyRenewalSlice;

export default policyRenewalSlice.reducer;
