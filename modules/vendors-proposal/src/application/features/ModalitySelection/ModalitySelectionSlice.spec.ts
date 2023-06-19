/* eslint-disable prefer-promise-reject-errors */
import { configureStore } from '@reduxjs/toolkit';
import { modalityListMock } from '../../../__mocks__';
import ModalitySelectionAPI from './ModalitySelectionAPI';
import ModalitySelectionSlice, {
  fetchModalities,
} from './ModalitySelectionSlice';

describe('ModalitySelectionSlice', () => {
  let getModalitiesMock = jest
    .spyOn(ModalitySelectionAPI, 'getModalities')
    .mockImplementation(() => Promise.resolve([modalityListMock[0]]));
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        modalitySelection: ModalitySelectionSlice,
      },
    });
  });

  afterEach(() => {
    store = null;
  });

  it('should set modality list correctly', async () => {
    await store.dispatch(fetchModalities('91833813000118'));
    const { modalitySelection } = store.getState();

    expect(getModalitiesMock).toHaveBeenCalledWith('91833813000118');
    expect(modalitySelection.modalityOptionsLoading).toEqual(false);
    expect(modalitySelection.modalityOptions).toMatchObject([
      modalityListMock[0],
    ]);
    expect(modalitySelection.modalityOptionsMapped).toMatchObject([
      {
        ...modalityListMock[0],
        label: modalityListMock[0].externalDescription,
        value: modalityListMock[0].modalityId.toString(),
      },
    ]);
  });

  it('should not set modality list', async () => {
    getModalitiesMock = jest
      .spyOn(ModalitySelectionAPI, 'getModalities')
      .mockImplementation(() =>
        Promise.reject({
          data: {
            data: {
              message: 'Error',
            },
          },
        }),
      );

    await store.dispatch(fetchModalities('Lorem'));
    const { modalitySelection } = store.getState();

    expect(getModalitiesMock).toHaveBeenCalledWith('Lorem');
    expect(modalitySelection.modalityOptionsLoading).toEqual(false);
    expect(modalitySelection.modalityOptions).toMatchObject([]);
    expect(modalitySelection.modalityOptionsMapped).toMatchObject([]);
  });
});
