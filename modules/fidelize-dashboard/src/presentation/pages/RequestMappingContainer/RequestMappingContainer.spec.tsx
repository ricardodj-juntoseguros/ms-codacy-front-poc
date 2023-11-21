import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { store } from '../../../config/store';
import RequestMappingContainer from './RequestMappingContainer';

describe('RequestMappingContainer.', () => {
  it('Should render initial solicitation page', async () => {
    //
    const { container, findByText } = render(
      <Provider store={store}>
        <RequestMappingContainer />
      </Provider>,
    );

    expect(container).toBeInTheDocument();
    expect(
      await findByText('Nova solicitação de mapeamento'),
    ).toBeInTheDocument();
    expect(
      await findByText(
        'Informe os dados dos tomadores e selecione aqueles que deseja mapear. Ao finalizar a seleção, continue para a verificação da estimativa de processos.',
      ),
    ).toBeInTheDocument();
  });
});
