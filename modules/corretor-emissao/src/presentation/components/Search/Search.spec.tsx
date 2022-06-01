import '@testing-library/jest-dom';
import { BrokerPlatformAuthService, Broker } from '@services';
import { modalityMock } from 'modules/corretor-emissao/src/__mocks__';
import {
  PolicyholderDTO,
  PolicyholderSearchDTO,
  SubsidiaryDTO,
} from '../../../application/types/dto';
import PolicyholderSelectionApi from '../../../application/features/policyholderSelection/PolicyholderSelectionApi';
import ModalitySelecionApi from '../../../application/features/modalitySelection/ModalitySelecionApi';
import { render, fireEvent } from '../../../config/testUtils';
import { Search } from './Search';

describe('Search component', () => {
  const mockData = {
    hasMore: false,
    records: [
      {
        id: 1,
        federalId: '99999999999999',
        name: 'Test',
      },
      {
        id: 2,
        federalId: '88888888888888',
        name: 'Test 2',
      },
    ],
  } as PolicyholderSearchDTO;

  const mockPolicyholderDetailsData = {
    Activity: '',
    City: 'Curitiba',
    Class: '',
    ClosingReferenceDay: 0,
    CompanyName: 'Test',
    District: 'Centro',
    Email: '',
    ExternalId: 12345,
    FederalId: '99999999999999',
    Hangs: [],
    Id: 1,
    InvoiceDueDateDay: 20,
    IsNew: false,
    PhoneNumber: undefined,
    ProducerRegionals: '',
    RegionalName: '',
    State: 'Paraná',
    Street: 'Rua Visconde de Nácar',
    UseBill: true,
    ValidCredit: true,
    ZipCode: '80410-201',
  } as PolicyholderDTO;

  const mockBroker = {
    id: 1,
    externalId: 1,
    name: 'Broker',
    userId: 1,
    federalId: '77777777777777',
    susepId: 1,
    user: {
      id: 1,
      userName: 'test_cor',
      userType: 0,
      userTypeDescription: 'corretor',
    },
  } as Broker;

  const mockSubsidiary = [
    {
      id: 1,
      address: 'Rua Visconde de Nácar',
      cep: '80410-201',
      city: 'Curitiba',
      complement: '',
      country: 'Brasil',
      federalId: '99999999999999',
      name: 'Test',
      number: 1111,
      policyholdersId: 1,
      state: 'PR',
    },
  ] as SubsidiaryDTO[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Search />);

    expect(baseElement).toBeTruthy();
  });

  it('should search the policyholder and render the items found in the field', async () => {
    const apiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockData));

    const { findByTestId, findByText } = render(<Search />);
    const searchInput = await findByTestId('policyholder-input-search');

    await fireEvent.change(searchInput, { target: { value: 'Test' } });

    expect(apiMock).toHaveBeenCalledWith('Test');
    expect(await findByText('Test - 99999999999999')).toBeInTheDocument();
    expect(await findByText('Test 2 - 88888888888888')).toBeInTheDocument();
  });

  it('should open a new tab with the details of the policyholder', async () => {
    process.env.NX_GLOBAL_TOMADOR_WEB = 'tomador/';

    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockData));
    jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(mockPolicyholderDetailsData));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => mockBroker);

    const windowOpenMock = jest
      .spyOn(window, 'open')
      .mockImplementation(jest.fn());

    const { findByTestId, findByText } = render(<Search />);
    const searchInput = await findByTestId('policyholder-input-search');

    await fireEvent.change(searchInput, { target: { value: 'Test' } });
    const firstSearchOption = await findByText('Test - 99999999999999');
    await fireEvent.click(firstSearchOption);

    const linkButton = await findByTestId('policyholder-details-link-button');
    await fireEvent.click(linkButton);

    expect(windowOpenMock).toHaveBeenCalledTimes(1);
    expect(windowOpenMock).toBeCalledWith(
      'tomador/details/99999999999999',
      '_blank',
    );
  });

  it('should search for policyholder details when selecting an item in the search field', async () => {
    const apiMock = jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockData));
    const apiPolicyholderDetailsMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(mockPolicyholderDetailsData));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => mockBroker);

    const { findByTestId, findByText } = render(<Search />);
    const searchInput = await findByTestId('policyholder-input-search');

    await fireEvent.change(searchInput, { target: { value: 'Test' } });
    const firstSearchOption = await findByText('Test - 99999999999999');
    await fireEvent.click(firstSearchOption);

    expect(apiMock).toHaveBeenCalledWith('Test');
    expect(apiPolicyholderDetailsMock).toHaveBeenCalledTimes(1);
    expect(apiPolicyholderDetailsMock).toHaveBeenCalledWith(
      mockBroker.externalId,
      '99999999999999',
    );
    expect(
      await apiPolicyholderDetailsMock.mock.results[0].value,
    ).toMatchObject(mockPolicyholderDetailsData);
  });

  it('should not call policyholder details api if it does not have a broker', async () => {
    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockData));
    const apiPolicyholderDetailsMock = jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(mockPolicyholderDetailsData));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => null);

    const { findByTestId, findByText } = render(<Search />);
    const searchInput = await findByTestId('policyholder-input-search');

    await fireEvent.change(searchInput, { target: { value: 'Test' } });
    const firstSearchOption = await findByText('Test - 99999999999999');
    await fireEvent.click(firstSearchOption);

    expect(apiPolicyholderDetailsMock).not.toHaveBeenCalled();
  });

  it('should fetch the branches and render the dropdown for choice', async () => {
    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockData));
    jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(mockPolicyholderDetailsData));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => mockBroker);
    jest
      .spyOn(ModalitySelecionApi, 'getModalitiesByPolicyholder')
      .mockImplementation(() => Promise.resolve([modalityMock]));

    const apiGetPolicyholderSubsidiary = jest
      .spyOn(PolicyholderSelectionApi, 'getSubsidiaryByPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockSubsidiary));

    const { findByTestId, findByText } = render(<Search />);
    const searchInput = await findByTestId('policyholder-input-search');

    await fireEvent.change(searchInput, { target: { value: 'Test' } });
    const firstSearchOption = await findByText('Test - 99999999999999');
    await fireEvent.click(firstSearchOption);

    const dropdownSubsidiary = await findByTestId(
      'policyholder-dropdown-subsidiary',
    );

    expect(apiGetPolicyholderSubsidiary).toHaveBeenCalled();
    expect(apiGetPolicyholderSubsidiary).toBeCalledWith(1);
    expect(dropdownSubsidiary).toBeInTheDocument();
  });

  it('should place the selected subsidiary in the store', async () => {
    jest
      .spyOn(PolicyholderSelectionApi, 'searchPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockData));
    jest
      .spyOn(PolicyholderSelectionApi, 'getPolicyholderDetails')
      .mockImplementation(() => Promise.resolve(mockPolicyholderDetailsData));
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => mockBroker);
    jest
      .spyOn(ModalitySelecionApi, 'getModalitiesByPolicyholder')
      .mockImplementation(() => Promise.resolve([modalityMock]));
    jest
      .spyOn(PolicyholderSelectionApi, 'getSubsidiaryByPolicyHolder')
      .mockImplementation(() => Promise.resolve(mockSubsidiary));

    const { findByTestId, findByText } = render(<Search />);
    const searchInput = await findByTestId('policyholder-input-search');

    await fireEvent.change(searchInput, { target: { value: 'Test' } });
    const firstSearchOption = await findByText('Test - 99999999999999');
    await fireEvent.click(firstSearchOption);

    const dropdownSubsidiaryItem = await findByText(
      `${mockSubsidiary[0].city} - ${mockSubsidiary[0].state} - ${mockSubsidiary[0].federalId}`,
    );
    await fireEvent.click(dropdownSubsidiaryItem);

    const dropdownSubsidiary = await findByTestId(
      'policyholder-dropdown-subsidiary',
    );

    expect(dropdownSubsidiary).toHaveValue(
      `${mockSubsidiary[0].city} - ${mockSubsidiary[0].state} - ${mockSubsidiary[0].federalId}`,
    );
  });
});
