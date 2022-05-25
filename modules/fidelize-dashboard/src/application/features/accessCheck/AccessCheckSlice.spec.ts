import { store } from '../../../config/store';
import AccessCheckApi from './AccessCheckApi';
import { fetchAccessToFeature } from './AccessCheckSlice';

describe('AccessCheckSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchAccessToFeature thunk should call api and set state correctly on success', async () => {
    jest
      .spyOn(AccessCheckApi, 'checkAccessToFeature')
      .mockImplementation(async () => {
        return true;
      });

    const result = await store.dispatch(fetchAccessToFeature('TESTE'));
    expect(AccessCheckApi.checkAccessToFeature).toHaveBeenCalledTimes(1);
    expect(result.payload).toStrictEqual({ feature: 'TESTE', allowed: true });
    expect(store.getState().accessCheck.featureAccess[0]).toStrictEqual({
      feature: 'TESTE',
      allowed: true,
    });
  });

  it('fetchAccessToFeature thunk should call api and set state correctly on fail', async () => {
    jest
      .spyOn(AccessCheckApi, 'checkAccessToFeature')
      .mockImplementation(async () => {
        return new Promise((resolve, reject) => {
          reject();
        });
      });

    const result = await store.dispatch(fetchAccessToFeature('TESTE_ERRO'));
    expect(AccessCheckApi.checkAccessToFeature).toHaveBeenCalledTimes(1);
    expect(result.payload).toStrictEqual({
      feature: 'TESTE_ERRO',
      allowed: false,
    });
    expect(store.getState().accessCheck.featureAccess[1]).toStrictEqual({
      feature: 'TESTE_ERRO',
      allowed: false,
    });
  });
});
