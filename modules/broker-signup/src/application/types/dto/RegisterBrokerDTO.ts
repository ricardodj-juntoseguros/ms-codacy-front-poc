export interface RegisterBrokerDTO {
  federalId: string,
  brokerCompanyName: string,
  address: string,
  complement: string,
  city: string,
  nameResponsable: string,
  cpfResponsable: string,
  phoneNumberResponsable: string,
  emailBroker: string,
  bankName: number,
  bankNumber: number,
  currentAccountNumber: number,
  branchNumber: number,
  digitalAgencyNumber: number
  digitalContactNumber: number
  simplesOptant: boolean,
  iSS: number
  susepCode: number
}
