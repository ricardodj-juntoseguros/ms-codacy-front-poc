import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { storeMock } from 'modules/corretor-emissao/src/__mocks__';
import { ContractData, ContractDataProps } from './ContractData';

describe('ContractData', () => {
  let contractDataMock: ContractDataProps = {} as ContractDataProps;

  it('should render successfully', () => {
    const { baseElement } = render(<ContractData {...contractDataMock} />);
    expect(baseElement).toBeTruthy();
  });

  const onChangeInsuredInput = jest.fn();
  const onSelectInsured = jest.fn();
  const onSelectAddress = jest.fn();
  const onChangeContractNumber = jest.fn();
  const onChangeAttachmentNotice = jest.fn();
  const onSelectInstallment = jest.fn();
  const onChangeFirstInstallment = jest.fn();
  const onChangeEmails = jest.fn();
  const onChangePolicyInProgress = jest.fn();
  const onChangeComments = jest.fn();

  beforeEach(() => {
    contractDataMock = {
      insuredInput: 'Insured 01',
      insuredOptions: [
        {
          id: 1,
          externalId: 1,
          name: 'Insured 01',
          federalId: '',
          hasFederalId: false,
          insuredType: 1,
          insuredTypeDescription: 'Insured 01',
          addresses: [
            {
              addressExternalId: 1,
              addressId: 1,
              externalId: 1,
              street: 'Insured 01 address',
              city: 'city',
              state: 'state',
            },
          ],
        },
      ],
      addressOptions: [
        {
          addressExternalId: 1,
          addressId: 1,
          externalId: 1,
          street: 'Insured 01 address',
          city: 'city',
          state: 'state',
        },
      ],
      insuredTypeDescription: 'Insured Type',
      contractNumber: 'Number',
      policyPreview: {
        title: 'Policy preview title',
        description: 'Policy preview description',
      },
      attachmentNotice: '12345',
      installmentOptions: storeMock.quote.installments,
      firstInstallment: '2022-01-01',
      policyInProgress: false,
      comments: 'Initial',
      onChangeInsuredInput,
      onSelectInsured,
      onSelectAddress,
      onChangeContractNumber,
      onChangeAttachmentNotice,
      onSelectInstallment,
      onChangeFirstInstallment,
      onChangeEmails,
      onChangePolicyInProgress,
      onChangeComments,
      address: null,
      installment: null,
      emails: [],
    };
  });

  it('should render successfully with the default properties', () => {
    const { baseElement } = render(<ContractData {...contractDataMock} />);
    expect(baseElement).toBeInTheDocument();
  });

  it('should call onChangeContractNumber with the value entered in the field', () => {
    const { getAllByRole } = render(<ContractData {...contractDataMock} />);
    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[2], { target: { value: 'Contract number' } });

    expect(onChangeContractNumber).toHaveBeenCalledWith('Contract number');
  });

  // it('should call onChangeEmails with the value entered in the field', () => {
  //   const { getAllByRole } = render(<ContractData {...contractDataMock} />);
  //   const inputs = getAllByRole('textbox');
  //   fireEvent.change(inputs[6], { target: { value: 'email@example.com' } });
  //   fireEvent.keyDown(inputs[6], { key: 'Enter', code: 'Enter', charCode: 13 });

  //   expect(onChangeEmails).toHaveBeenCalled();
  // });

  // it('should call onChangeComments with the value entered in the field', () => {
  //   const { getAllByRole } = render(<ContractData {...contractDataMock} />);
  //   const inputs = getAllByRole('textbox');
  //   fireEvent.change(inputs[6], { target: { value: 'Comments' } });

  //   expect(onChangeComments).toHaveBeenCalledWith('Comments');
  // });
});
