import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { SearchBrokerFederalId} from './SearchBrokerFederalId';
import SearchBrokerApi from '../../../application/features/searchBroker/SearchBrokerApi';
import { SearchRegisterBrokerDTO } from '../../../application/types/dto';

describe('SearchBrokerFederalId', () => {
  const historyMock = jest.fn();

  const props = {
    handleGoNextClick: {
      push: historyMock as any,
    } as any,
  };

  it('should render successfully', () => {
    const { baseElement } = render(
    <Provider store={store}>
        <SearchBrokerFederalId {...props} />
    </Provider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully with visible alert',  async () => {
    const mock= {
      status:3,
      description:'mock',
      information:{
        razao_social:'mock'
      }
    }

    const result = mock as unknown as SearchRegisterBrokerDTO;

    const SearchBrokerMockApi = jest
    .spyOn(SearchBrokerApi, 'searchRegisterBroker')
    .mockImplementation(() =>
      Promise.resolve(result)
    );

    const { getByTestId } = render(
       <Provider store={store}>
         <SearchBrokerFederalId {...props} />
       </Provider>
    );

    const input = getByTestId('broker-FederalId');

    await act(async () => {
      fireEvent.change(input, { target: { value: '43759422000158' } });
    });

    await SearchBrokerMockApi;

    expect(SearchBrokerMockApi).toBeCalled();
    expect(getByTestId('alert-broker-regisry')).toBeInTheDocument();
  });

  it('should render successfully with error invalid federalId',  async () => {
    const mock= {
      status:0,
      description:'mock',
      information:'mock'
    }

    const result = mock as unknown as SearchRegisterBrokerDTO;


    const SearchBrokerMockApi = jest
    .spyOn(SearchBrokerApi, 'searchRegisterBroker')
    .mockImplementation(() =>
      Promise.resolve(result),
    );

    const { getByTestId,getByText } = render(
      <Provider store={store}>
        <SearchBrokerFederalId {...props} />
       </Provider>
    );

    const input = getByTestId('broker-FederalId');

    await act(async () => {
      fireEvent.change(input, { target: { value: '99999999000199' } });
    });

    await SearchBrokerMockApi;

    expect(SearchBrokerMockApi).toBeCalled();
    expect(getByText('Ops, parece que esse CNPJ não existe.')).toBeInTheDocument();;
  });

  it('should render successfully with button enabled',  async () => {
    const mock= {
      status:1,
      description:'mock',
      information:'mock'
    }

    const result = mock as unknown as SearchRegisterBrokerDTO;


    const SearchBrokerMockApi = jest
    .spyOn(SearchBrokerApi, 'searchRegisterBroker')
    .mockImplementation(() =>
      Promise.resolve(result),
    );

    const { getByTestId } = render(
    <Provider store={store}>
      <SearchBrokerFederalId {...props} />
    </Provider>
    );

    const input = getByTestId('broker-FederalId');

    await act(async () => {
      fireEvent.change(input, { target: { value: '43759422000158' } });
    });

    await SearchBrokerMockApi;

    expect(SearchBrokerMockApi).toBeCalled();
    expect(getByTestId('button-start-broker-registry')).toBeEnabled();;
  })
});
