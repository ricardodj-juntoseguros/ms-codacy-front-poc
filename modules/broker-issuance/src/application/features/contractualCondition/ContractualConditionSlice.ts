import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeToast } from "junto-design-system";
import handleError from "../../../helpers/handlerError";
import { RootState } from "../../../config/store";
import { ContractualConditionModel, CustomClauseRequestedByEnum } from "../../types/model";
import ContractualConditionApi from "./ContractualConditionApi";
import { CustomClauseDTO } from "../../types/dto";

export const getCustomClause = createAsyncThunk<
  CustomClauseDTO[],
  number,
  { rejectValue: string }
>(
  'contractualCondition/getCustomClause',
  async (policyId: number, { rejectWithValue }) => {
    return ContractualConditionApi.getCustomClause(policyId)
      .then(response => response)
      .catch(error => {
        const defaultMessage = 'Ocorreu um erro ao buscar a condição contratual.';
        const message = error.data ? handleError(error.data, defaultMessage) : defaultMessage;
        return rejectWithValue(message);
      });
  },
);

export const postCustomClause = createAsyncThunk<
  CustomClauseDTO,
  { policyId: number; requestedBy: CustomClauseRequestedByEnum, text: string },
  { rejectValue: string }
>(
  'contractualCondition/postCustomClause',
  async ({ policyId, requestedBy, text }, { rejectWithValue }) => {
    return ContractualConditionApi.postCustomClause(policyId, requestedBy, text)
      .then(response => response)
      .catch(error => {
        const defaultMessage = 'Ocorreu um erro ao cadastrar a condição contratual.';
        const message = error.data ? handleError(error.data, defaultMessage) : defaultMessage;
        return rejectWithValue(message);
      });
  },
);

export const patchCustomClause = createAsyncThunk<
  boolean,
  { clauseId: number; requestedBy: CustomClauseRequestedByEnum, text: string, isDelete: boolean },
  { rejectValue: string }
>(
  'contractualCondition/patchCustomClause',
  async ({ clauseId, isDelete, requestedBy, text }, { rejectWithValue }) => {
    return ContractualConditionApi.patchCustomClause(clauseId, isDelete, requestedBy, text)
      .then(() => isDelete)
      .catch(error => {
        const defaultMessage = 'Ocorreu um erro ao editar a condição contratual.';
        const message = error.data ? handleError(error.data, defaultMessage) : defaultMessage;
        return rejectWithValue(message);
      });
  },
);

const initialState: ContractualConditionModel = {
  currentContractualCondition: null,
  requestedBy: null,
  text: '',
  openContractualConditions: false,
  loadingContractualCondition: false,
  hasContractualConditionsChanges: false,
};

export const contractualConditionSlice = createSlice({
  name: 'contractualCondition',
  initialState,
  reducers: {
    clearContractualConditions: state => {
      state.currentContractualCondition = null;
      state.requestedBy = null;
      state.text = '';
    },
    setOpenContractualConditions: (state, action: PayloadAction<boolean>) => {
      state.openContractualConditions = action.payload;
    },
    setRequestedBy: (state, action: PayloadAction<string>) => {
      state.requestedBy = Number(action.payload);
      state.hasContractualConditionsChanges = true;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
      state.hasContractualConditionsChanges = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(postCustomClause.pending, (state) => {
        state.loadingContractualCondition = true;
      })
      .addCase(postCustomClause.fulfilled, (state, action) => {
        state.loadingContractualCondition = false;
        state.currentContractualCondition = action.payload;
        state.hasContractualConditionsChanges = false;
      })
      .addCase(postCustomClause.rejected, (state, action) => {
        state.loadingContractualCondition = false;
        state.hasContractualConditionsChanges = true;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(patchCustomClause.pending, (state) => {
        state.loadingContractualCondition = true;
      })
      .addCase(patchCustomClause.fulfilled, (state, action) => {
        state.loadingContractualCondition = false;
        state.hasContractualConditionsChanges = false;
        if (action.payload) {
          state.currentContractualCondition = null;
          state.requestedBy = null;
          state.text = '';
        }
      })
      .addCase(patchCustomClause.rejected, (state, action) => {
        state.loadingContractualCondition = false;
        state.hasContractualConditionsChanges = true;
        if (action.payload) makeToast('error', action.payload);
      })
      .addCase(getCustomClause.pending, (state) => {
        state.loadingContractualCondition = true;
      })
      .addCase(getCustomClause.fulfilled, (state, action: PayloadAction<CustomClauseDTO[]>) => {
        const [currentContractualCondition] = action.payload;
        state.currentContractualCondition = currentContractualCondition;
        state.requestedBy = action.payload[0]?.requestedBy;
        state.text = action.payload[0]?.text;
        state.loadingContractualCondition = false;
      })
      .addCase(getCustomClause.rejected, (state, action) => {
        state.loadingContractualCondition = false;
        if (action.payload) makeToast('error', action.payload);
      })
  }
});

export const selectContractualCondition = (state: RootState) => state.contractualCondition;

export const { actions: contractualConditionActions } = contractualConditionSlice;

export default contractualConditionSlice.reducer;
