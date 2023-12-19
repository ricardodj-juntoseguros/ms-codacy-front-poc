/* eslint-disable prefer-promise-reject-errors */
import { waitFor } from '@testing-library/react';
import { modalityDefaultMock } from '../../../__mocks__';
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

  it('should be able to get modalities', async () => {
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() => Promise.resolve([modalityDefaultMock]));
    store.dispatch(
      fetchModalities({ brokerFederalId: '123', policyholderFederalId: '123' }),
    );
    expect(fetchModalitiesMock).toHaveBeenCalledWith('123', '123');
    await waitFor(() => {
      const { modalitySelecion } = store.getState();
      expect(modalitySelecion.modalityOptions).toEqual([
        {
          ...modalityDefaultMock,
          label: modalityDefaultMock.description,
          value: modalityDefaultMock.id.toString(),
        },
      ]);
    });
  });

  it('should be able to display an error if the call fails', async () => {
    const fetchModalitiesMock = jest
      .spyOn(ModalitySelecionApi, 'fetchModalities')
      .mockImplementation(() =>
        Promise.reject({ data: { message: 'error ao buscar as modalidades' } }),
      );
    store.dispatch(
      fetchModalities({ brokerFederalId: '123', policyholderFederalId: '123' }),
    );
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
