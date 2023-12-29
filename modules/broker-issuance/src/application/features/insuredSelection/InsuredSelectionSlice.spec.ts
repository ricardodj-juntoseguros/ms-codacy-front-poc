import { store } from '../../../config/store';
import { insuredMock } from '../../../__mocks__';
import {
  insuredSelectionActions,
  searchInsured,
} from './InsuredSelectionSlice';
import InsuredSelectionApi from './InsuredSelectionApi';
import { InsuredSearchDTO } from '../../types/dto';
import { InsuredModel } from '../../types/model';

describe('InsuredSelectionSlice', () => {
  beforeEach(() => {
    store.dispatch(insuredSelectionActions.clearInsuredSelection());
  });

  it('should be able to search insured by typed text', async () => {
    const insureSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(() =>
        Promise.resolve({
          hasMore: false,
          records: [insuredMock],
        } as InsuredSearchDTO),
      );
    await store.dispatch(searchInsured('prefeitura'));
    const { insuredSelection } = store.getState();
    expect(insureSearchMock).toHaveBeenCalled();
    expect(insureSearchMock).toHaveBeenCalledWith('prefeitura');
    expect(insuredSelection.insuredOptions).toEqual([
      {
        ...insuredMock,
        value: insuredMock.insuredId.toString(),
        label: insuredMock.name,
      },
    ]);
  });

  it('should be able to search insured by typed text', async () => {
    const insureSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(() => Promise.reject(new Error('Not found')));
    await store.dispatch(searchInsured('prefeitura'));
    const { insuredSelection } = store.getState();
    expect(insureSearchMock).toHaveBeenCalled();
    expect(insureSearchMock).toHaveBeenCalledWith('prefeitura');
    expect(insuredSelection.insuredOptions).toEqual([]);
    expect(insuredSelection.loadingSearchInsureds).toEqual(false);
  });

  it('should be able to change the search value and if it is blank text you must clear the selection options', async () => {
    const insureSearchMock = jest
      .spyOn(InsuredSelectionApi, 'searchInsured')
      .mockImplementation(() =>
        Promise.resolve({
          hasMore: false,
          records: [insuredMock],
        } as InsuredSearchDTO),
      );
    await store.dispatch(searchInsured('prefeitura'));
    let { insuredSelection } = store.getState();
    expect(insureSearchMock).toHaveBeenCalled();
    expect(insureSearchMock).toHaveBeenCalledWith('prefeitura');
    expect(insuredSelection.insuredOptions).toEqual([
      {
        ...insuredMock,
        value: insuredMock.insuredId.toString(),
        label: insuredMock.name,
      },
    ]);
    await store.dispatch(insuredSelectionActions.setInsuredSearchValue(''));
    insuredSelection = store.getState().insuredSelection;
    expect(insuredSelection.insuredSearchValue).toEqual('');
    expect(insuredSelection.insuredOptions).toEqual([]);
  });

  it('should be able to correctly update the addresses', async () => {
    await store.dispatch(
      insuredSelectionActions.setInsuredAddressesOptions([
        insuredMock.addresses[0],
        insuredMock.addresses[1],
      ]),
    );
    const { insuredSelection } = store.getState();
    expect(insuredSelection.insuredAddressesOptions).toEqual([
      {
        ...insuredMock.addresses[0],
        value: insuredMock.addresses[0].addressId.toString(),
        label: `${insuredMock.addresses[0].street} - ${insuredMock.addresses[0].city}, ${insuredMock.addresses[0].state}`,
      },
      {
        ...insuredMock.addresses[1],
        value: insuredMock.addresses[1].addressId.toString(),
        label: `${insuredMock.addresses[1].street} - ${insuredMock.addresses[1].city}, ${insuredMock.addresses[1].state}`,
      },
    ]);
  });

  it('should be able to set the insured options array', async () => {
    const optionsMock: InsuredModel[] = [
      {
        ...insuredMock,
        value: insuredMock.insuredId.toString(),
        label: insuredMock.name,
      },
    ];
    store.dispatch(insuredSelectionActions.setInsuredOptions(optionsMock));
    expect(store.getState().insuredSelection.insuredOptions.length).toBe(1);
  });
});
