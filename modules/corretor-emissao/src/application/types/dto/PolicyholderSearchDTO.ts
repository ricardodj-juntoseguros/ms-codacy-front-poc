export interface PolicyholderSearchDTO {
  hasMore: boolean;
  records: Array<{
    id: number;
    name: string;
    federalId: string;
  }>;
}
