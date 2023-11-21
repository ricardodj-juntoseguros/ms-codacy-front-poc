import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { store } from '../../../config/store';
import RequestMappingHelper from './RequestMappingHelper';

describe('RequestMappingContainer.', () => {
  it('Should render initial solicitation page', async () => {
    //
    const { container, findByText } = render(
      <Provider store={store}>
        <RequestMappingHelper />
      </Provider>,
    );

    expect(container).toBeInTheDocument();
    expect(await findByText('Selecione tomadores')).toBeInTheDocument();
    expect(
      await findByText('Verifique a estimativa de processos'),
    ).toBeInTheDocument();
    expect(
      await findByText('Veja nossa análise do tomador'),
    ).toBeInTheDocument();
    expect(await findByText('Solicite o mapeamento')).toBeInTheDocument();
  });
});
