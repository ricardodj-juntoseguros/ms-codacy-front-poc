import '@testing-library/jest-dom';
import { VALIDATION_MESSAGES } from 'modules/lease-bonds-issuance/src/constants';
import { act, fireEvent, render } from '../../../config/testUtils';
import ContactInputList from './ContactInputList';

describe('ContactInputList', () => {
  const onChangeContactsMock = jest.fn();

  it('should be able to add contact', () => {
    const { getByTestId } = render(
      <ContactInputList
        contacts={[]}
        idPrefix="test"
        inputLabel="Input label"
        onChangeContacts={onChangeContactsMock}
      />,
    );
    const inputContact = getByTestId('test-input-contact');
    const buttonAdd = getByTestId('test-button-add');
    act(() => {
      fireEvent.change(inputContact, { target: { value: 'email@email.com' } });
    });
    act(() => {
      fireEvent.click(buttonAdd);
    });
    expect(onChangeContactsMock).toHaveBeenCalledWith(['email@email.com']);
  });

  it('should be able to remove contact', () => {
    const { getAllByTestId } = render(
      <ContactInputList
        contacts={['email@email.com', 'email2@email.com']}
        idPrefix="test"
        inputLabel="Input label"
        onChangeContacts={onChangeContactsMock}
      />,
    );
    const buttonsRemoveContacts = getAllByTestId(
      'test-link-button-remove-contact',
    );
    act(() => {
      fireEvent.click(buttonsRemoveContacts[1]);
    });
    expect(onChangeContactsMock).toHaveBeenCalledWith(['email@email.com']);
  });

  it('should be able to display an error if the contact is invalid', () => {
    const { getByTestId, getByText } = render(
      <ContactInputList
        contacts={[]}
        idPrefix="test"
        inputLabel="Input label"
        onChangeContacts={onChangeContactsMock}
      />,
    );
    const inputContact = getByTestId('test-input-contact');
    const buttonAdd = getByTestId('test-button-add');
    act(() => {
      fireEvent.change(inputContact, { target: { value: 'email' } });
    });
    act(() => {
      fireEvent.click(buttonAdd);
    });
    expect(getByText(VALIDATION_MESSAGES.invalidEmail)).toBeInTheDocument();
  });

  it('should be able not to send a repeat contact', () => {
    const { getByTestId } = render(
      <ContactInputList
        contacts={['email@email.com']}
        idPrefix="test"
        inputLabel="Input label"
        onChangeContacts={onChangeContactsMock}
      />,
    );
    const inputEmail = getByTestId('test-input-contact');
    const buttonAdd = getByTestId('test-button-add');
    act(() => {
      fireEvent.change(inputEmail, { target: { value: 'email@email.com' } });
    });
    act(() => {
      fireEvent.click(buttonAdd);
    });
    expect(onChangeContactsMock).toHaveBeenCalledWith(['email@email.com']);
  });
});
