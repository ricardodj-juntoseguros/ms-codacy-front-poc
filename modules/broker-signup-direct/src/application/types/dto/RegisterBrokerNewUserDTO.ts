export interface RegisterBrokerNewUserDTO {
  login: string;
  password: string;
  confirmPassword: string;
  _brokerExternalId: number;
  acceptTerms: boolean;
  brokerAutomaticSignup: boolean;
}
