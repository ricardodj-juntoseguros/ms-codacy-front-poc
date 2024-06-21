import PreApprovalDTO from '../dto/PreApprovalDTO';

interface PreApproval {
  proposal: PreApprovalDTO | null;
  isLoading: boolean;
  error: string | null;
  hasApprove: boolean;
}
export default PreApproval;
