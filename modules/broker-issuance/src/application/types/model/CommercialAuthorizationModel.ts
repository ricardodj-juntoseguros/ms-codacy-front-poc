import { CommercialAuthorizationTypeEnum } from "./CommercialAuthorizationTypeEnum";

export interface CommercialAuthorizationModel {
  approvalContacts: string[];
  documentsForAuthorization: {
    name: string,
    url: string,
    size: number,
  }[];
  typeOfAuthorization: CommercialAuthorizationTypeEnum;
};
