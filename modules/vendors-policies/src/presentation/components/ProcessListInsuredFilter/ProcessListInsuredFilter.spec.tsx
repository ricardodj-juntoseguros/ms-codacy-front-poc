import { UserTypeEnum, VendorsAuthService } from '@services';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import ProcessListInsuredFilter from './ProcessListInsuredFilter';
import { getInsuredOptionsMock } from '../../../__mocks__';

describe('ProcessListInsuredFilter', () => {
  it('Should fetch insured list on mount if userType is insured', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => getInsuredOptionsMock);

    render(
      <ProcessListInsuredFilter
        selectInsuredCallback={jest.fn()}
        showClearButton={false}
      />,
    );

    expect(ProcessListingApi.getInsuredOptions).toHaveBeenCalledWith(undefined);
  });

  it('should fetch insured list on insured name fill if user type is policyholder', async () => {
    jest.useFakeTimers();
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.POLICYHOLDER);
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => getInsuredOptionsMock);
    const { findByTestId } = render(
      <ProcessListInsuredFilter
        selectInsuredCallback={jest.fn()}
        showClearButton={false}
      />,
    );
    const input = await findByTestId('processListInsuredFilter-input-search');
    fireEvent.change(input, { target: { value: 'Teste' } });
    jest.runAllTimers();
    await waitFor(async () => {
      expect((await findByTestId('search-input-list')).children.length).toBe(5);
    });
    await waitFor(() => {
      expect(ProcessListingApi.getInsuredOptions).toHaveBeenLastCalledWith(
        'Teste',
      );
    });
  });

  it('Should filter insured list options on input fill based on name if user type is not policyholder', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => getInsuredOptionsMock);

    const { findByTestId, getByTestId } = render(
      <ProcessListInsuredFilter
        selectInsuredCallback={jest.fn()}
        showClearButton={false}
      />,
    );

    const input = await findByTestId('processListInsuredFilter-input-search');
    fireEvent.change(input, { target: { value: 'Teste Segurado 1' } });
    expect(getByTestId('search-input-list').children.length).toBe(1);
  });

  it('Should call selectInsuredCallback with insured federalId on option select', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementationOnce(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => getInsuredOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListInsuredFilter
        selectInsuredCallback={callbackMock}
        showClearButton={false}
      />,
    );
    const input = await findByTestId('processListInsuredFilter-input-search');
    fireEvent.change(input, { target: { value: 'Teste Segurado 1' } });
    fireEvent.click((await findByTestId('search-input-list')).children[0]);
    expect(callbackMock).toHaveBeenCalledWith('51715480000108');
  });

  it('Should call selectInsuredCallback with null on clear button click', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementationOnce(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => getInsuredOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListInsuredFilter
        selectInsuredCallback={callbackMock}
        showClearButton
      />,
    );
    fireEvent.click(await findByTestId('processListInsuredFilter-btn-clear'));
    expect(callbackMock).toHaveBeenCalledWith(null);
  });

  it('Should call selectInsuredCallback with null on input blur when empty if when on focus was filled', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementationOnce(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'getInsuredOptions')
      .mockImplementation(async () => getInsuredOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListInsuredFilter
        selectInsuredCallback={callbackMock}
        showClearButton
      />,
    );
    const input = await findByTestId('processListInsuredFilter-input-search');
    fireEvent.change(input, { target: { value: 'Segurado 1' } });
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(callbackMock).toHaveBeenCalledWith(null);
  });
});
