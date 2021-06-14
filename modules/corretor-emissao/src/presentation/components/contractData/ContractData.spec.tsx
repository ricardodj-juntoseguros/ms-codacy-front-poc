import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ContractData, ContractDataProps } from './ContractData';

describe('ContractData', () => {
  let contractDataMock: ContractDataProps = {} as ContractDataProps;
  const onChangeInsuredValue = jest.fn();
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
      insuredValue: 'Insured 01',
      searchInsuredOptions: [
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
      insuredType: 'Insured Type',
      contractNumber: 'Number',
      policyPreview: {
        title: 'Policy preview title',
        description: 'Policy preview description',
      },
      attachmentNotice: '12345',
      installmentOptions: [
        {
          number: 1,
          dueDate: new Date(),
          mainValue: 190,
          iof: 0,
          policyCost: 1,
          installmentValue: 190,
          fractionationValue: 0,
        },
      ],
      firstInstallment: new Date(),
      policyInProgress: false,
      comments: 'Initial',
      onChangeInsuredValue,
      onSelectInsured,
      onSelectAddress,
      onChangeContractNumber,
      onChangeAttachmentNotice,
      onSelectInstallment,
      onChangeFirstInstallment,
      onChangeEmails,
      onChangePolicyInProgress,
      onChangeComments,
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

  it('should call onChangeEmails with the value entered in the field', () => {
    const { getAllByRole } = render(<ContractData {...contractDataMock} />);
    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[5], { target: { value: 'email@example.com' } });

    expect(onChangeEmails).toHaveBeenCalled();
  });

  it('should call onChangeComments with the value entered in the field', () => {
    const { getAllByRole } = render(<ContractData {...contractDataMock} />);
    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[7], { target: { value: 'Comments' } });

    expect(onChangeComments).toHaveBeenCalledWith('Comments');
  });
});
