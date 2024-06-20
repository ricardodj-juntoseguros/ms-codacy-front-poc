import '@testing-library/jest-dom';
import { store } from '../../../config/store';
import { renewalDocumentListMock } from '../../../__mocks__';
import PolicyRenewalApi from '../../../application/features/policyRenewal/PolicyRenewalApi';
import { fireEvent, render, waitFor } from '../../../config/testUtils';
import PolicyRenewalDocuments from './PolicyRenewalDocuments';

const createProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => createProposalMock,
  };
});

describe('PolicyRenewalDocuments', () => {
  let getRenewalDocumentListMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    getRenewalDocumentListMock = jest
      .spyOn(PolicyRenewalApi, 'getRenewalDocumentList')
      .mockImplementation(() => Promise.resolve(renewalDocumentListMock));
  });

  it('should be able to render the component', async () => {
    // Arrange
    const { getByTestId, getByText, getAllByText } = render(
      <PolicyRenewalDocuments />,
    );
    // Act
    await waitFor(async () => {
      await expect(getRenewalDocumentListMock).toHaveBeenCalled();
    });
    const checkboxMulti = getByTestId(
      'policyRenewalDocuments-documents-checkbox-multi-select',
    );
    fireEvent.click(checkboxMulti);
    await waitFor(async () => {
      const checkBoxAdittionTerm = getAllByText('Termo de aditamento');
      await fireEvent.click(checkBoxAdittionTerm[0]);
    });
    const inputAddittionTerm = await getByTestId(
      'policyRenewalDocuments-Termo de aditamento-input',
    );
    fireEvent.change(inputAddittionTerm, {
      target: { value: 'Test Adittion Term' },
    });
    fireEvent.blur(inputAddittionTerm);
    const checkBoxOrdinaryNumbering = await getByText('Formato numérico');
    fireEvent.click(checkBoxOrdinaryNumbering);
    // Assert
    const { policyRenewal } = store.getState();
    expect(policyRenewal.documentList[9]).toEqual({
      id: 10,
      description: 'Termo de aditamento',
      hasChoiceOfNumberingType: true,
      active: true,
      inputValue: 'Test Adittion Term',
      hasOrdinaryNumbering: true,
      value: '10',
      label: 'Termo de aditamento',
      disabled: false,
    });
    expect(createProposalMock).toBeCalledTimes(1);
  });
});
