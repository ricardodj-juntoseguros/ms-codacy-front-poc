import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { BrokerGeneralInformation} from './BrokerGeneralInformation';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import {
  brokerInformationSliceActions
} from '../../../application/features/brokerInformation/BrokerInformationSlice';


describe('BrokerGeneralInformation', () => {

  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <BrokerGeneralInformation/>
      </Provider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs',  async () => {
    const { getByTestId } = render(
       <Provider store={store}>
          <BrokerGeneralInformation/>
       </Provider>
    );

    const inputCodSusep = getByTestId('cod-susep');
    const inputIss = getByTestId('broker-iss');
    const inputSimplesOptant = getByTestId('broker-simplesOptant');

    await act(async () => {
      fireEvent.change(inputCodSusep, { target: { value: '11111111111111' } });
      fireEvent.change(inputIss, { target: { value: 1.00 } });
      fireEvent.change(inputSimplesOptant, { target: { value: true } });
    });

    expect(inputCodSusep).toHaveValue('111111.1.111111-1');
    expect(inputIss).toHaveValue('1');
    expect(inputSimplesOptant).toBeTruthy
    });

  it('should render successfully with error invalid errors',  async () => {
    const { getByTestId,getAllByText  } = render(
      <Provider store={store}>
          <BrokerGeneralInformation/>
      </Provider>
   );

   const inputCodSusep = getByTestId('cod-susep');

   await act(async () => {
     fireEvent.change(inputCodSusep, { target: { value: '' } });
     fireEvent.blur(inputCodSusep);
   });
   const errors = getAllByText(VALIDATION_MESSAGES.required);

    expect(errors.length).toEqual(1);
  })
});
