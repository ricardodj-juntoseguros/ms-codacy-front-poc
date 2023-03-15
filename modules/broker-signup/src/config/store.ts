import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import BrokerInformationSlice from '../application/features/brokerInformation/BrokerInformationSlice';
import ResponsibleInformationSlice from '../application/features/responsibleInformation/ResponsibleInformationSlice';
import validationSlice from '../application/features/validation/ValidationSlice';

export const store = configureStore({
  reducer: {
    brokerInformation: BrokerInformationSlice,
    responsibleInformation: ResponsibleInformationSlice,
    validation: validationSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
