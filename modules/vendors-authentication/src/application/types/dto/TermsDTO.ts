interface terms {
  id: number;
  description: string;
  version: number;
  recurrence: boolean;
  createdAt: string;
}

export interface TermsDTO {
  data: terms[];
}

export default TermsDTO;
