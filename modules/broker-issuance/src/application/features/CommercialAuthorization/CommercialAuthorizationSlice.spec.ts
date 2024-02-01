import { store } from "modules/broker-issuance/src/config/store";
import { commercialAuthorizationActions } from "./CommercialAuthorizationSlice";
import { CommercialAuthorizationTypeEnum } from "../../types/model";

describe('CommercialAuthorizationSlice', () => {
  beforeEach(() => {
    store.dispatch(commercialAuthorizationActions.clearCommercialAuthorization());
  });

  it('should be able to set approval contacts', async () => {
    store.dispatch(commercialAuthorizationActions.setApprovalContacts(['test@test.com']));
    const { commercialAuthorization } = store.getState();
    expect(commercialAuthorization.approvalContacts).toEqual(['test@test.com']);
  });

  it('should be able to set documents for authorization', async () => {
    store.dispatch(commercialAuthorizationActions.setDocumentsForAuthorization([{
      name: 'test', url: 'url', size: 1234
    }]));
    const { commercialAuthorization } = store.getState();
    expect(commercialAuthorization.documentsForAuthorization).toMatchObject([{ name: "test", size: 1234, url: "url" }]);
  });

  it('should be able to set type of authorization', async () => {
    store.dispatch(commercialAuthorizationActions.setTypeOfAuthorization(CommercialAuthorizationTypeEnum.hasAuthorization));
    const { commercialAuthorization } = store.getState();
    expect(commercialAuthorization.typeOfAuthorization).toEqual(CommercialAuthorizationTypeEnum.hasAuthorization);
  });
});