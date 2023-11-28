export interface RegisterBrokerNewUserDTO {
  login: string;
  password: string;
  confirmPassword: string;
  _brokerExternalId?: number;
  hash?: string;
  token?: string;
  acceptTerms: boolean;
  brokerAutomaticSignup: boolean;
}
