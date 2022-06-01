import { modalityMock } from 'modules/corretor-emissao/src/__mocks__';
import { store } from '../../../config/store';
import { ModalityDTO } from '../../types/dto';
import ModalitySelecionApi from './ModalitySelecionApi';
import {
  getModalityByPolicyHolder,
  modalitySearchActions,
} from './ModalitySelectionSlice';

describe('ModalitySelectionSlice', () => {
  beforeEach(() => {
    store.dispatch(modalitySearchActions.resetSearch());
  });

  it('should be able search modalities by policyholder', async () => {
    const policyHolderId = 140139;

    const apiGetModalitiesByPolicyholder = jest
      .spyOn(ModalitySelecionApi, 'getModalitiesByPolicyholder')
      .mockImplementation(() =>
        Promise.resolve([modalityMock] as ModalityDTO[]),
      );

    await store.dispatch(getModalityByPolicyHolder(policyHolderId));
    const { modalitySelecion } = store.getState();

    expect(apiGetModalitiesByPolicyholder).toHaveBeenCalled();
    expect(apiGetModalitiesByPolicyholder).toHaveBeenCalledWith(policyHolderId);
    expect(modalitySelecion.modalityOptions).toEqual([
      modalityMock,
    ] as ModalityDTO[]);
  });

  it('should not populate the modalities if the call returns an error', async () => {
    const policyHolderId = 140139;

    const apiGetModalitiesByPolicyholder = jest
      .spyOn(ModalitySelecionApi, 'getModalitiesByPolicyholder')
      .mockImplementation(() => Promise.reject(new Error('Not found')));

    await store.dispatch(getModalityByPolicyHolder(policyHolderId));

    const { modalitySelecion } = store.getState();

    expect(apiGetModalitiesByPolicyholder).toHaveBeenCalled();
    expect(apiGetModalitiesByPolicyholder).toHaveBeenCalledWith(policyHolderId);
    expect(modalitySelecion.modalityOptions).toEqual([]);
    expect(modalitySelecion.loadingGetModalities).toEqual(false);
  });

  it('should be able reset the slice', async () => {
    const policyHolderId = 140139;

    const apiGetModalitiesByPolicyholder = jest
      .spyOn(ModalitySelecionApi, 'getModalitiesByPolicyholder')
      .mockImplementation(() =>
        Promise.resolve([modalityMock] as ModalityDTO[]),
      );

    await store.dispatch(getModalityByPolicyHolder(policyHolderId));
    let { modalitySelecion } = store.getState();

    expect(apiGetModalitiesByPolicyholder).toHaveBeenCalled();
    expect(apiGetModalitiesByPolicyholder).toHaveBeenCalledWith(policyHolderId);
    expect(modalitySelecion.modalityOptions).toEqual([
      modalityMock,
    ] as ModalityDTO[]);

    store.dispatch(modalitySearchActions.resetSearch());
    modalitySelecion = store.getState().modalitySelecion;

    expect(modalitySelecion.modalityOptions).toEqual([]);
  });
});
