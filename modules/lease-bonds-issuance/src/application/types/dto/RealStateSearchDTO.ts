export interface RealStateSearchDTO {
  hasMore: boolean;
  records: Array<{
    id: number;
    name: string;
    federalId: string;
  }>;
}
