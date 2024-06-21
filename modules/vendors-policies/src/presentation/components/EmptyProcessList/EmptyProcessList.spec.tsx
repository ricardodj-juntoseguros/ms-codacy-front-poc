import '@testing-library/jest-dom';
import { UserTypeEnum } from '@services';
import { fireEvent, render } from '../../../config/testUtils';
import EmptyProcessList from './EmptyProcessList';

describe('EmptyProcessList', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should display correct text if has not applied filters', () => {
    const { getByText } = render(
      <EmptyProcessList
        hasAppliedFilter={false}
        userType={UserTypeEnum.INSURED}
      />,
    );
    expect(getByText('Você ainda não possui processos')).toBeInTheDocument();
    expect(
      getByText(
        'Assim que houverem garantias solicitadas, elas serão listadas aqui para acompanhamento.',
      ),
    ).toBeInTheDocument();
  });

  it('Should display correct text if has applied filters', () => {
    const { getByText } = render(
      <EmptyProcessList hasAppliedFilter userType={UserTypeEnum.INSURED} />,
    );
    expect(
      getByText('Não encontramos processos para sua busca'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Tente usar outros parâmetros e busque novamente. Caso ainda encontre dificuldades você pode falar com um de nossos especialistas no Chat.',
      ),
    ).toBeInTheDocument();
  });

  it('Should redirect to proposal page on button click', () => {
    const { getByText, getByTestId } = render(
      <EmptyProcessList
        userType={UserTypeEnum.INSURED}
        hasAppliedFilter={false}
      />,
    );
    expect(getByText('Você ainda não possui processos')).toBeInTheDocument();
    expect(
      getByText(
        'Assim que houverem garantias solicitadas, elas serão listadas aqui para acompanhamento.',
      ),
    ).toBeInTheDocument();
    const button = getByTestId('emptyProcessList-button-proposal');
    fireEvent.click(button);
    expect(window.location.assign).toHaveBeenCalledWith('/proposal');
  });
});
