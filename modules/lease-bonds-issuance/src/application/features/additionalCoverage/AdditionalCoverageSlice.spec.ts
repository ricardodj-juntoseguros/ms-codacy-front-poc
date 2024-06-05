import { store } from 'modules/lease-bonds-issuance/src/config/store';
import { additionalCoverageActions } from './AdditionalCoverageSlice';

describe('AdditionalCoverageSlice', () => {
  beforeEach(() => {
    store.dispatch(additionalCoverageActions.clearAdditionalCoverage());
  });

  it('should return the initial state', () => {
    const state = store.getState().additionalCoverage;
    expect(state.labor).toBe(false);
    expect(state.rateAggravation).toBe(false);
    expect(state.hasAdditionalCoverageChanges).toBe(false);
  });

  it('should be able to set labor', () => {
    store.dispatch(additionalCoverageActions.setLabor(true));
    const state = store.getState().additionalCoverage;
    expect(state.labor).toBe(true);
    expect(state.rateAggravation).toBe(true);
    expect(state.hasAdditionalCoverageChanges).toBe(true);
  });

  it('should be able to set rate aggravation', () => {
    store.dispatch(additionalCoverageActions.setRateAggravation(true));
    const state = store.getState().additionalCoverage;
    expect(state.rateAggravation).toBe(true);
    expect(state.hasAdditionalCoverageChanges).toBe(true);
  });

  it('should be able to set has additional coverage changes', () => {
    store.dispatch(
      additionalCoverageActions.setHasAdditionalCoverageChanges(true),
    );
    const state = store.getState().additionalCoverage;
    expect(state.hasAdditionalCoverageChanges).toBe(true);
  });

  it('should be able to clear additional coverage', () => {
    store.dispatch(additionalCoverageActions.setLabor(true));
    store.dispatch(additionalCoverageActions.setRateAggravation(true));
    store.dispatch(
      additionalCoverageActions.setHasAdditionalCoverageChanges(true),
    );
    store.dispatch(additionalCoverageActions.clearAdditionalCoverage());
    const state = store.getState().additionalCoverage;
    expect(state.labor).toBe(false);
    expect(state.rateAggravation).toBe(false);
    expect(state.hasAdditionalCoverageChanges).toBe(false);
  });
});
