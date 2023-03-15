import {brokerInformationMock}  from 'modules/broker-signup/src/__mocks__';
import { store } from '../../../config/store';
import { BrokerInformationModel, ResponsibleInformationModel} from '../../types/model'

import {
  brokerInformationSliceActions
} from './BrokerInformationSlice';

describe('BrokerInformationSlice', () => {


  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should be able search modalities by policyholder', async () => {
    const brokerInformationModelMock = brokerInformationMock as unknown as BrokerInformationModel
    store.dispatch(brokerInformationSliceActions.setBrokerInformationModel(brokerInformationModelMock));


    const { brokerInformation } = store.getState();

    expect(brokerInformation).toEqual(
      brokerInformationMock,
    );
  });



  it('should be able reset the slice', async () => {
    const { brokerInformation } = store.getState();

    expect(brokerInformation.status).toEqual(1);
    expect(brokerInformation.description).toEqual('');
  });
});
