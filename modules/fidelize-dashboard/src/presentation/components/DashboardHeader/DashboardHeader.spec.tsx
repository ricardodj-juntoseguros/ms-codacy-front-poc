import { render } from '@testing-library/react';
import DashboardHeader from './DashboardHeader';

describe('DashboardHeader', () => {
  it('Should render successfully', () => {
    const component = render(<DashboardHeader />);
    expect(component.getByText('Fidelize Dashboard')).toBeTruthy();
    expect(
      component.getByText(
        `Visualize as oportunidades judiciais que o Projeto Fidelize já mapeou para alguns tomadores da sua carteira. Além disso, você poderá solicitar novos mapeamentos para tomadores vinculados a sua Corretora.`,
      ),
    ).toBeTruthy();
  });
});
