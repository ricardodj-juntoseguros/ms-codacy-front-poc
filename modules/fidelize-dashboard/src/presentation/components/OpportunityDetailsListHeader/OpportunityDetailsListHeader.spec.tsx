import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { ModalityEnum } from 'modules/fidelize-dashboard/src/application/types/model';
import { store } from 'modules/fidelize-dashboard/src/config/store';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import OpportunityDetailsListHeader from '.';
import styles from './OpportunityDetailsListHeader.module.scss';

describe('Opportunity Details List Header', () => {
  it('Should render successfully', () => {
    const { getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsListHeader modality={ModalityEnum.FISCAL} />,
      </Provider>,
    );
    expect(getByText('TIPO/OBS.')).toBeTruthy();
    expect(getByText('RELEVÂNCIA')).toBeTruthy();
    expect(getByText('VALOR IS')).toBeTruthy();
    expect(getByText('TOMADOR')).toBeTruthy();
    expect(getByText('DT MAPEAMENTO')).toBeTruthy();
  });

  it('Should change active sorting button when clicked', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsListHeader modality={ModalityEnum.FISCAL} />,
      </Provider>,
    );
    const btnClicked = getByTestId('btn-desc-policyholder');

    await act(async () => {
      fireEvent.click(btnClicked);
    });

    expect(btnClicked).toHaveClass(
      styles['opportunity-details-header__order-btn--active'],
    );
    expect(getByTestId('btn-desc-relevance')).not.toHaveClass(
      styles['opportunity-details-header__order-btn--active'],
    );
  });
});
