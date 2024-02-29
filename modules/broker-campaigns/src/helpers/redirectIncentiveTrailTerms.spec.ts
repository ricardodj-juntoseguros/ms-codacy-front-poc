import { redirectIncentiveTrailTerms } from './redirectIncentiveTrailTerms';

describe('redirectIncentiveTrailTerms', () => {
  const windowOpen = jest.fn();
  window.open = windowOpen;

  it('should redirect to the correct URL', () => {
    redirectIncentiveTrailTerms();
    expect(windowOpen).toHaveBeenCalledWith(
      'https://static.juntoseguros.com/docs/Regulamento-Programa-de-Incentivo-Trilha-de-Incentivo-2024.pdf',
      '_blank',
    );
  });
});
