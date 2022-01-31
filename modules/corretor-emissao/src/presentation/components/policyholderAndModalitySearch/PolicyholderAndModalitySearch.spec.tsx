import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import selectEvent from 'react-select-event';

import {
  PolicyholderAndModalitySearch,
  PolicyholderAndModalitySearchProps,
} from './PolicyholderAndModalitySearch';

describe('PolicyholderAndModalitySearch', () => {
  const onChangePolicyholderInput = jest.fn();
  const onSelectPolicyholder = jest.fn();
  const handlePolicyholderDetails = jest.fn();
  const onSelectModality = jest.fn();
  const onSelectSubsidiary = jest.fn();

  let propsMock: PolicyholderAndModalitySearchProps =
    {} as PolicyholderAndModalitySearchProps;

  beforeEach(() => {
    propsMock = {
      onChangePolicyholderInput,
      policyholderInput: '',
      onSelectPolicyholder,
      policyholderOptions: [],
      hasValidPolicyholder: false,
      handlePolicyholderDetails,
      modalityOptions: [
        { id: 1, description: 'Modality 01' },
        { id: 2, description: 'Modality 02' },
        { id: 3, description: 'Modality 03' },
      ],
      onSelectModality,
      modality: null,
      subsidiary: null,
      subsidiaryOptions: [
        { id: 1, label: 'Subsidiary 01' },
        { id: 2, label: 'Subsidiary 02' },
        { id: 3, label: 'Subsidiary 03' },
      ],
      onSelectSubsidiary,
    };
  });

  it('should render successfully with the default properties', () => {
    const { baseElement } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );
    expect(baseElement).toBeInTheDocument();
  });

  it('should call the onChangePolicyholderInput when the search input is changed', () => {
    const { getAllByRole } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );

    const inputs = getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Test 01' } });

    expect(onChangePolicyholderInput).toHaveBeenCalledWith('Test 01');
  });

  it('should call the onSelectModality when the modality input is changed', async () => {
    propsMock.hasValidPolicyholder = true;
    const { getAllByRole } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );

    const modalitySelect = getAllByRole('textbox')[1];
    await selectEvent.select(modalitySelect, 'Modality 01');

    expect(onSelectModality).toBeCalledTimes(1);
  });

  it('should show the policyHolderDetails button when the hasValidPolicyholder property is true', () => {
    propsMock.hasValidPolicyholder = true;
    const { getByRole } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should call policyholderDetails when the button is clicked', () => {
    propsMock.hasValidPolicyholder = true;
    const { getByRole } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(handlePolicyholderDetails).toHaveBeenCalledTimes(1);
  });

  it('should render the modality field disabled if the searchValue is invalid', () => {
    const { getByTestId } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );

    const modalityDropdown = getByTestId('policyholder-modality');

    expect(
      modalityDropdown.getElementsByTagName('input')[0].disabled,
    ).toBeTruthy();
  });

  it('should call the onSelectSubsidiary when the subsidiary input is changed', async () => {
    const { getAllByRole } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );

    const subsidiarySelect = getAllByRole('textbox')[2];
    await selectEvent.select(subsidiarySelect, 'Subsidiary 02');

    expect(onSelectSubsidiary).toBeCalledTimes(1);
  });

  it('should not render the field on the screen if there is no subsidiary', async () => {
    propsMock.subsidiaryOptions = [];
    const { queryByTestId } = render(
      <PolicyholderAndModalitySearch {...propsMock} />,
    );

    expect(
      await queryByTestId('policyholder-subsidiary'),
    ).not.toBeInTheDocument();
  });
});
