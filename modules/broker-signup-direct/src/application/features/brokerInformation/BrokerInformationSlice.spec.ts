import { brokerInformationMock } from 'modules/broker-signup-direct/src/__mocks__';
import { store } from '../../../config/store';
import { BrokerInformationModel } from '../../types/model';

import { brokerInformationSliceActions } from './BrokerInformationSlice';

describe('BrokerInformationSlice', () => {
  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should be able set the BrokerInformationSlice', async () => {
    const brokerInformationModelMock =
      brokerInformationMock as unknown as BrokerInformationModel;
    store.dispatch(
      brokerInformationSliceActions.setBrokerInformationModel(
        brokerInformationModelMock,
      ),
    );

    const { brokerInformation } = store.getState();

    expect(brokerInformation).toEqual(brokerInformationMock);
  });

  it('should be able reset the slice', async () => {
    const { brokerInformation } = store.getState();

    expect(brokerInformation.status).toEqual(1);
    expect(brokerInformation.description).toEqual('');
  });
});
