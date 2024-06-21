/* eslint-disable no-console */
import Cookies from 'js-cookie';
import { IncentiveTrailCampaign } from './types';

export class IncentiveTrailService {
  private readonly USER_ACCESS_COOKIE =
    process.env['NX_GLOBAL_BROKER_USER_ACCESS_COOKIE'] || 'uac';

  private readonly COOKIE_DOMAIN =
    process.env['NX_GLOBAL_COOKIE_DOMAIN'] || 'juntoseguros.com';

  getUserAccessCookie() {
    const userCookie = Cookies.get(this.USER_ACCESS_COOKIE) || '';
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  }

  getIncentiveTrailCampaign(): IncentiveTrailCampaign | null {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return null;
    const { bonusJourney } = userCookie;
    return bonusJourney && bonusJourney.lastCampaign;
  }

  getIncentiveTrailIsEligible(): boolean {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return false;
    const { bonusJourney } = userCookie;
    return bonusJourney && bonusJourney.isEligible;
  }

  getIncentiveTrailIsAccept(): boolean {
    const userCookie = this.getUserAccessCookie();
    if (!userCookie) return false;
    const { bonusJourney } = userCookie;
    return bonusJourney && bonusJourney.isAcceptTerm;
  }

  updateIncentiveTrailAcceptTerm(isAccept: boolean) {
    const userCookie = this.getUserAccessCookie();
    const expiresIn = userCookie?.refreshExpiresIn || userCookie?.expiresIn;
    Cookies.remove(this.USER_ACCESS_COOKIE, { domain: this.COOKIE_DOMAIN });
    Cookies.set(
      this.USER_ACCESS_COOKIE,
      JSON.stringify({
        ...userCookie,
        bonusJourney: {
          ...userCookie?.bonusJourney,
          isAcceptTerm: isAccept,
        },
      }),
      {
        domain: this.COOKIE_DOMAIN,
        expires: new Date(new Date(userCookie?.createAt).getTime() + expiresIn),
      },
    );
  }
}

export default new IncentiveTrailService();
