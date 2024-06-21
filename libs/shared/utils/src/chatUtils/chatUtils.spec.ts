/* eslint-disable import/order */
/* eslint-disable import/first */
import Cookies from 'js-cookie';
import { ChatUtils } from './chatUtils';

Object.defineProperty(window, 'zE', {
  writable: true,
  value: jest.fn(),
});
jest.mock('react-gtm-module', () => {
  return {
    ...(jest.requireActual('react-gtm-module') as any),
    dataLayer: jest.fn(),
  };
});

import TagManager from 'react-gtm-module';

describe('Chat Utils', () => {
  it('shoud init zendesk chat correctly', () => {
    jest.spyOn(Cookies, 'get').mockReturnValue('mockCookie' as any);
    ChatUtils.zenDesk.init();
    expect(TagManager.dataLayer).toHaveBeenLastCalledWith({
      dataLayer: {
        event: 'zenDeskChatInit',
      },
    });
  });
  it('shoud open zendesk chat correctly', () => {
    const mockZe = jest.spyOn(window, 'zE');
    ChatUtils.zenDesk.open();
    expect(mockZe).toHaveBeenLastCalledWith('webWidget', 'open');
  });
  it('shoud close zendesk chat correctly', () => {
    ChatUtils.zenDesk.close();
    expect(TagManager.dataLayer).toHaveBeenLastCalledWith({
      dataLayer: {
        event: 'zenDeskChatClose',
      },
    });
  });
});
