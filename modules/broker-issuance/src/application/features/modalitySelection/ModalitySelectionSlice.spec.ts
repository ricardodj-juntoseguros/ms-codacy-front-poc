/* eslint-disable prefer-promise-reject-errors */
import { waitFor } from '@testing-library/react';
import { modalityMock } from '../../../__mocks__';
import { store } from '../../../config/store';
import ModalitySelecionApi from './ModalitySelecionApi';
import {
  fetchModalities,
  modalitySelectionActions,
} from './ModalitySelectionSlice';

describe('ModalitySelectionSlice', () => {
  beforeEach(() => {
    store.dispatch(modalitySelectionActions.resetModalitySelection());
  });

  it('', async () => {
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.resolve([modalityMock]));
    store.dispatch(fetchModalities({ brokerFederalId: '123', policyholderFederalId: '123' }));
    expect(fetchModalitiesMock).toHaveBeenCalledWith('123', '123');
    await waitFor(() => {
      const { modalitySelecion } = store.getState();
      expect(modalitySelecion.modalityOptions).toEqual([{
        ...modalityMock,
        label: modalityMock.description,
        value: modalityMock.id.toString(),
      }]);
    });
  });

  it('', async () => {
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.reject({ data: { message: 'error ao buscar as modalidades' } }));
    store.dispatch(fetchModalities({ brokerFederalId: '123', policyholderFederalId: '123' }));
    expect(fetchModalitiesMock).toHaveBeenCalledWith('123', '123');
    await waitFor(() => {
      const { modalitySelecion } = store.getState();
      expect(modalitySelecion.loadingModalities).toEqual(false);
    });
  });

  it('should be able to reset the slice', () => {
    store.dispatch(modalitySelectionActions.resetModalitySelection());
    const { modalitySelecion } = store.getState();
    expect(modalitySelecion.modalityOptions).toEqual([]);
    expect(modalitySelecion.loadingModalities).toBe(false);
  });
});
