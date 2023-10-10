import { UserTypeEnum, VendorsAuthService } from '@services';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import ProcessListPolicyholderFilter from './ProcessListPolicyholderFilter';
import { searchPolicyholderOptionsMock } from '../../../__mocks__';

describe('ProcessListPolicyholderFilter', () => {
  jest.useFakeTimers();

  it('Should fetch policyholder options on input fill with insured user type', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'searchPolicyholderOptions')
      .mockImplementation(async () => searchPolicyholderOptionsMock);

    const { findByTestId } = render(
      <ProcessListPolicyholderFilter
        selectPolicyholderCallback={jest.fn()}
        showClearButton={false}
      />,
    );

    const input = await findByTestId(
      'processListPolicyholderFilter-input-search',
    );
    fireEvent.change(input, { target: { value: 'TOMADOR 1' } });
    jest.runAllTimers();
    await waitFor(async () => {
      expect((await findByTestId('search-input-list')).children.length).toBe(4);
    });
    await waitFor(() => {
      expect(ProcessListingApi.searchPolicyholderOptions).toHaveBeenCalledWith(
        'TOMADOR 1',
      );
    });
  });

  it('Should fetch policyholder options on input fill with broker user type', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.BROKER);
    jest
      .spyOn(ProcessListingApi, 'searchPolicyholderOptions')
      .mockImplementation(async () => searchPolicyholderOptionsMock);

    const { findByTestId } = render(
      <ProcessListPolicyholderFilter
        selectPolicyholderCallback={jest.fn()}
        showClearButton={false}
      />,
    );

    const input = await findByTestId(
      'processListPolicyholderFilter-input-search',
    );
    fireEvent.change(input, { target: { value: 'TOMADOR 1' } });
    jest.runAllTimers();
    await waitFor(async () => {
      expect((await findByTestId('search-input-list')).children.length).toBe(4);
    });
    await waitFor(() => {
      expect(ProcessListingApi.searchPolicyholderOptions).toHaveBeenCalledWith(
        'TOMADOR 1',
      );
    });
  });

  it('Should call selectPolicyholderCallback with policyholder federalId on option select', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'searchPolicyholderOptions')
      .mockImplementationOnce(async () => searchPolicyholderOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId, findByText } = render(
      <ProcessListPolicyholderFilter
        selectPolicyholderCallback={callbackMock}
        showClearButton={false}
      />,
    );
    const input = await findByTestId(
      'processListPolicyholderFilter-input-search',
    );
    fireEvent.change(input, { target: { value: 'TOMADOR' } });
    jest.runAllTimers();
    await waitFor(async () => {
      await waitFor(async () => {
        expect((await findByTestId('search-input-list')).children.length).toBe(
          4,
        );
      });
    });
    fireEvent.click(await findByText('TOMADOR 1'));
    expect(callbackMock).toHaveBeenCalledWith('33768864000107');
  });

  it('Should call selectPolicyholderCallback with null on clear button click', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'searchPolicyholderOptions')
      .mockImplementationOnce(async () => searchPolicyholderOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListPolicyholderFilter
        selectPolicyholderCallback={callbackMock}
        showClearButton
      />,
    );
    fireEvent.click(
      await findByTestId('processListPolicyholderFilter-btn-clear'),
    );
    expect(callbackMock).toHaveBeenCalledWith(null);
  });

  it('Should call selectPolicyholderCallback with null on input blur when empty if when on focus was filled', async () => {
    jest
      .spyOn(VendorsAuthService, 'getUserType')
      .mockImplementation(() => UserTypeEnum.INSURED);
    jest
      .spyOn(ProcessListingApi, 'searchPolicyholderOptions')
      .mockImplementationOnce(async () => searchPolicyholderOptionsMock);
    const callbackMock = jest.fn();

    const { findByTestId } = render(
      <ProcessListPolicyholderFilter
        selectPolicyholderCallback={callbackMock}
        showClearButton
      />,
    );
    const input = await findByTestId(
      'processListPolicyholderFilter-input-search',
    );
    fireEvent.change(input, { target: { value: 'TOMADOR' } });
    jest.runAllTimers();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    jest.runAllTimers();
    expect(callbackMock).toHaveBeenCalledWith(null);
  });
});
