import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { ValidationEmailCode} from './ValidationEmailCode';


describe('ValidationEmailCode', () => {
  const codeIsValid = false
  const codeIsComplet = false
  const setCodeIsValid = jest.fn();
  const setCodeIsComplet = jest.fn();


  it('should render successfully', () => {
    const { baseElement } = render(
    <Provider store={store}>
        <ValidationEmailCode  userPath="41a5ecaa-bd94-47bc-b352-845fdf665a10" codeIsValid={codeIsValid} onSetCodeIsValid={setCodeIsValid} codeIsComplet={codeIsComplet} onSetCodeIsComplet={setCodeIsComplet}/>
    </Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
