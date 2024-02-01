import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../config/store";
import { CommercialAuthorizationModel, CommercialAuthorizationTypeEnum } from "../../types/model";

const initialState: CommercialAuthorizationModel = {
  approvalContacts: [],
  documentsForAuthorization: [],
  typeOfAuthorization: CommercialAuthorizationTypeEnum.sendToApproval,
};

export const commercialAuthorizationSlice = createSlice({
  name: 'commercialAuthorization',
  initialState,
  reducers: {
    clearCommercialAuthorization: state => {
      state.typeOfAuthorization = CommercialAuthorizationTypeEnum.sendToApproval;
      state.approvalContacts = [];
      state.documentsForAuthorization = [];
    },
    setTypeOfAuthorization: (state, action: PayloadAction<CommercialAuthorizationTypeEnum>) => {
      state.typeOfAuthorization = action.payload;
    },
    setApprovalContacts: (state, action: PayloadAction<string[]>) => {
      state.approvalContacts = action.payload;
    },
    setDocumentsForAuthorization: (state, action: PayloadAction<{ name: string, url: string, size: number }[]>) => {
      state.documentsForAuthorization = action.payload;
    },
  },
});


export const selectCommercialAuthorization = (state: RootState) => state.commercialAuthorization;

export const { actions: commercialAuthorizationActions } = commercialAuthorizationSlice;

export default commercialAuthorizationSlice.reducer;
