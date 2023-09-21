import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { UploadDocuments} from './UploadDocuments';


describe('UploadDocuments', () => {
  const historyMock = jest.fn();

  const props = {
    handleGoNextClick: {
      push: historyMock as any,
    } as any,
  };

  it('should render successfully', () => {
    const { baseElement } = render(
    <Provider store={store}>
        <UploadDocuments {...props} />
    </Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
