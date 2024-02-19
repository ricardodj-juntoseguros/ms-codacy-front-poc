import { ThemeProvider, Themes } from 'junto-design-system';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import Cookies from 'js-cookie';
import { waitFor } from '@testing-library/react';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { modalitySelectionActions } from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { brokerMock, modalityBidderMock } from '../../../__mocks__';
import { useRehydrateData } from './useRehydrateData';
import { store } from '../../../config/store';

describe('useRehydrateData', () => {
  const HookWrapper: React.FC = ({ children }) => {
    return (
      <ThemeProvider theme={Themes.DEFAULT}>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
    jest.spyOn(Cookies, 'get').mockReturnValue(
      JSON.stringify({
        policyholderFederalId: '99999999999',
        modalityId: 99,
      }) as any,
    );
    store.dispatch(
      modalitySelectionActions.setModalityOptions([modalityBidderMock]),
    );
  });

  it('should be able to rehydrate data sent via redirect', async () => {
    const { result } = renderHook(() => useRehydrateData(), {
      wrapper: HookWrapper,
    });
    await result.current();
    const state = store.getState();
    expect(state.policyholderSelection.policyholderSearchValue).toEqual(
      '99999999999',
    );
    await waitFor(async () => {
      await expect(state.quote.modality).toMatchObject(modalityBidderMock);
    });
  });
});
