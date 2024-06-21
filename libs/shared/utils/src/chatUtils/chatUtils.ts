import TagManager from 'react-gtm-module';
import Cookies from 'js-cookie';

declare global {
  interface Window {
    zE: any;
  }
}

const chatUtils = () => {
  const USER_CHAT_KEY =
    process.env['NX_GLOBAL_BROKER_USER_CHAT_COOKIE'] || 'user-chat';
  return {
    zenDesk: {
      init: () => {
        const userChatCookie = Cookies.get(USER_CHAT_KEY);
        if (userChatCookie) {
          TagManager.dataLayer({
            dataLayer: {
              event: 'zenDeskChatInit',
            },
          });
        }
      },
      open: () => {
        if (!window.zE) return;
        window.zE('webWidget', 'open');
      },
      close: () => {
        TagManager.dataLayer({
          dataLayer: {
            event: 'zenDeskChatClose',
          },
        });
      },
    },
  };
};

export const ChatUtils = chatUtils();
