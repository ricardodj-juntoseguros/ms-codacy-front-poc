import {brokerInformationMock}  from 'modules/broker-signup/src/__mocks__';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { BrokerAddress} from './BrokerAddress';
import {
  brokerInformationSliceActions
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { brokerInformationAdapter } from '../../../application/features/brokerInformation/adapters/BrokerInformationAdapter';

describe('BrokerAddress', () => {
  const broker = brokerInformationAdapter(brokerInformationMock);

  beforeEach(() => {
    store.dispatch(brokerInformationSliceActions.setBrokerInformationModel(broker));
  });

  it('should render successfully', () => {
    const { baseElement,getByTestId } = render(
      <Provider store={store}>
        <BrokerAddress />
      </Provider>
    );

    const inputCep = getByTestId('broker-cep');
    const inputUf = getByTestId('broker-uf');
    const inputMunicipality = getByTestId('broker-municipality');
    const inputAddress = getByTestId('broker-address');
    const inputNumber = getByTestId('broker-number');
    const inputcomplement = getByTestId('broker-complement');

    expect(baseElement).toBeTruthy();
    expect(inputCep).toHaveValue(brokerInformationMock.information.cep);
    expect(inputCep).toBeDisabled
    expect(inputUf).toHaveValue(brokerInformationMock.information.uf);
    expect(inputUf).toBeDisabled
    expect(inputMunicipality).toHaveValue(brokerInformationMock.information.municipio);
    expect(inputMunicipality).toBeDisabled
    expect(inputAddress).toHaveValue(brokerInformationMock.information.logradouro);
    expect(inputAddress).toBeDisabled
    expect(inputNumber).toHaveValue(brokerInformationMock.information.numero);
    expect(inputNumber).toBeDisabled
    expect(inputcomplement).toHaveValue(brokerInformationMock.information.complemento);
    expect(inputcomplement).toBeDisabled
  });
});
