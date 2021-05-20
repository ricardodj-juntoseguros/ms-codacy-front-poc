import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import selectEvent from 'react-select-event'

import PolicyholderAndModalitySearch, { PolicyholderAndModalitySearchProps } from './PolicyholderAndModalitySearch';

describe('PolicyholderAndModalitySearch', () => {
  const handleSetSearchValue = jest.fn();
  const handleSetModalityValue = jest.fn();
  const handleSetSubsidiaryValue = jest.fn();
  const handlePolicyholderDetails = jest.fn();
  let propsMock: PolicyholderAndModalitySearchProps = {} as PolicyholderAndModalitySearchProps;

  beforeEach(() => {
    propsMock = {
      searchOptions: [
        'Test 01',
        'Test 02',
        'Test 03',
        'Test 04',
      ],
      modalityOptions: [
        { label: 'Modality 01', value: 'Modality 01' },
        { label: 'Modality 02', value: 'Modality 02' },
        { label: 'Modality 03', value: 'Modality 03' },
      ],
      subsidiaryOptions: [
        { label: 'Subsidiary 01', value: 'Subsidiary 01' },
        { label: 'Subsidiary 02', value: 'Subsidiary 02' },
        { label: 'Subsidiary 03', value: 'Subsidiary 03' },
      ],
      hasValidPolicyholder: false,
      searchValue: '',
      handleSetSearchValue: handleSetSearchValue,
      handleSetModalityValue: handleSetModalityValue,
      handleSetSubsidiaryValue: handleSetSubsidiaryValue,
      handlePolicyholderDetails: handlePolicyholderDetails
    }
  })

  it('should render successfully with the default properties', () => {
    const { baseElement } = render(<PolicyholderAndModalitySearch {...propsMock}/>);
    expect(baseElement).toBeInTheDocument();
  });

  it('should call the handleSetSearchValue when the search input is changed', () => {
    const { getAllByRole } = render(<PolicyholderAndModalitySearch {...propsMock}/>);

    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Test 01' } })

    expect(handleSetSearchValue).toHaveBeenCalledWith('Test 01');
  });

  it('should call the handleSetModalityValue when the modality input is changed', async () => {
    propsMock.hasValidPolicyholder = true;
    const { getAllByRole } = render(<PolicyholderAndModalitySearch {...propsMock}/>);

    const modalitySelect = getAllByRole('textbox')[1];
    await selectEvent.select(modalitySelect, 'Modality 01')

    expect(handleSetModalityValue).toBeCalledTimes(1);
  });

  it('should show the policyHolderDetails button when the hasValidPolicyholder property is true', () => {
    propsMock.hasValidPolicyholder = true;
    const { getByRole } = render(<PolicyholderAndModalitySearch {...propsMock}/>);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should call PolicyholderDetails when the button is clicked', () => {
    propsMock.hasValidPolicyholder = true;
    const { getByRole } = render(<PolicyholderAndModalitySearch {...propsMock}/>);

    const button = getByRole('button');
    fireEvent.click(button);

    expect(handlePolicyholderDetails).toHaveBeenCalledTimes(1);
  });

  it('should render the modality field disabled if the searchValue is invalid', () => {
    const { getByTestId } = render(<PolicyholderAndModalitySearch {...propsMock}/>);

    const modalityDropdown = getByTestId('policyholder-modality');

    expect(modalityDropdown.getElementsByClassName('j-dropdown__input--disabled').length).toBe(1);
  });


  it('should call the handleSetSubsidiaryValue when the subsidiary input is changed', async () => {
    const { getAllByRole } = render(<PolicyholderAndModalitySearch {...propsMock}/>);

    const subsidiarySelect = getAllByRole('textbox')[2];
    await selectEvent.select(subsidiarySelect, 'Subsidiary 02')

    expect(handleSetSubsidiaryValue).toBeCalledTimes(1);
  });

  it('should not render the field on the screen if there is no subsidiary', async () => {
    propsMock.subsidiaryOptions = [];
    const { queryByTestId  } = render(<PolicyholderAndModalitySearch {...propsMock}/>);


    expect(await queryByTestId('policyholder-subsidiary')).not.toBeInTheDocument();
  });
});
