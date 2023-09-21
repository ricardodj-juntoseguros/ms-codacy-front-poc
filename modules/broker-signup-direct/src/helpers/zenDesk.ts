import TagManager from 'react-gtm-module';

export const USER_CHAT = 'user-chat';

class ZenDesk {
  init() {
    TagManager.dataLayer({
      dataLayer: {
      event: 'zenDeskChatInit'
      },
    });
  }

  close() {
    TagManager.dataLayer({
      dataLayer: {
        event: 'zenDeskChatClose'
      },
    });
  }
}

const zenDesk = new ZenDesk();
export default zenDesk;
