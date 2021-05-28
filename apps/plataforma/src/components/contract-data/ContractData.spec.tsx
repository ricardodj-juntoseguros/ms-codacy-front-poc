import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ContractData, ContractDataProps } from './ContractData';

describe('ContractData', () => {
  let contractDataMock: ContractDataProps = {} as ContractDataProps;
  const handleSetInsuredValue = jest.fn();
  const handleSetAddress = jest.fn();
  const handleSetContractNumber = jest.fn();
  const handleSetAttachmentNotice = jest.fn();
  const handleSetInstallment = jest.fn();
  const handleSetFirstInstallment = jest.fn();
  const handleSetEmails = jest.fn();
  const handleSetPolicyInProgress = jest.fn();
  const handleSetComments = jest.fn();

  beforeEach(() => {
    contractDataMock = {
      insuredValue: 'Insured 01',
      searchInsuredOptions: ['Insured 01', 'Insured 02', 'Insured 03'],
      addressOptions: [
        { label: 'Address 01', value: 'Address 01' },
        { label: 'Address 02', value: 'Address 02' },
        { label: 'Address 03', value: 'Address 03' },
      ],
      insuredType: 'Insured Type',
      contractNumber: 'Number',
      policyPreview: {
        title: 'Policy preview title',
        description: 'Policy preview description',
      },
      attachmentNotice: 12345,
      installmentOptions: [
        { label: 'Installment type 01', value: 'Installment type 01' },
      ],
      firstInstallment: new Date(),
      policyInProgress: false,
      comments: 'Initial',
      handleSetInsuredValue,
      handleSetAddress,
      handleSetContractNumber,
      handleSetAttachmentNotice,
      handleSetInstallment,
      handleSetFirstInstallment,
      handleSetEmails,
      handleSetPolicyInProgress,
      handleSetComments,
    };
  });

  it('should render successfully with the default properties', () => {
    const { baseElement } = render(<ContractData {...contractDataMock} />);
    expect(baseElement).toBeInTheDocument();
  });

  it('should call handleSetContractNumber with the value entered in the field', () => {
    const { getAllByRole } = render(<ContractData {...contractDataMock} />);
    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[2], { target: { value: 'Contract number' } });

    expect(handleSetContractNumber).toHaveBeenCalledWith('Contract number');
  });

  it('should call handleSetEmails with the value entered in the field', () => {
    const { getAllByRole } = render(<ContractData {...contractDataMock} />);
    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[6], { target: { value: 'email@example.com' } });

    expect(handleSetEmails).toHaveBeenCalled();
  });

  it('should call handleSetComments with the value entered in the field', () => {
    const { getAllByRole } = render(<ContractData {...contractDataMock} />);
    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[7], { target: { value: 'Comments' } });

    expect(handleSetComments).toHaveBeenCalledWith('Comments');
  });
});
