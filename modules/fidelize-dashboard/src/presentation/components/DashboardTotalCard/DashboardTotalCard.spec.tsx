import { render } from '@testing-library/react';
import { DashboardTotalCard } from './DashboardTotalCard';

describe('DashboardTotalCard', () => {
  it('Should render successfully', () => {
    const component = render(
      <DashboardTotalCard
        icon="check"
        totalLabel="Teste 123"
        totalValue="Teste ABC"
        changedValue={10}
      />,
    );
    expect(component.getByText('Teste 123')).toBeTruthy();
    expect(component.getByText('Teste ABC')).toBeTruthy();
    expect(component.container.querySelector('.icon-check')).toBeTruthy();
    expect(component.getByText('+ 10')).toBeTruthy();
    expect(component.getByText('desde o último acesso')).toBeTruthy();
  });
});
