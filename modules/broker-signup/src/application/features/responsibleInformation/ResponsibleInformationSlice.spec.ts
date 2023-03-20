import {responsibleInformationMock}  from 'modules/broker-signup/src/__mocks__';
import { store } from '../../../config/store';


import {
  responsibleInformationSliceActions
} from './ResponsibleInformationSlice';

describe('ModalitySelectionSlice', () => {


  afterEach(() => {
    store.dispatch(responsibleInformationSliceActions.resetResponsibleInformationSlice());
  });

  it('should be able search modalities by policyholder', async () => {
    store.dispatch(responsibleInformationSliceActions.setName('teste'));
    store.dispatch(responsibleInformationSliceActions.setCpf('99999999999'));
    store.dispatch(responsibleInformationSliceActions.setPhone('4199999999'));
    store.dispatch(responsibleInformationSliceActions.setEmail('teste@teste.com'));

    const { responsibleInformation } = store.getState();

    expect(responsibleInformation).toEqual(
      responsibleInformationMock,
    );
  });



  it('should be able reset the slice', async () => {
    const { responsibleInformation } = store.getState();

    expect(responsibleInformation.nameResponsable).toEqual('');
    expect(responsibleInformation.cpfResponsable).toEqual('');
    expect(responsibleInformation.emailBroker).toEqual('');
    expect(responsibleInformation.phoneNumberResponsable).toEqual('');
  });
});
