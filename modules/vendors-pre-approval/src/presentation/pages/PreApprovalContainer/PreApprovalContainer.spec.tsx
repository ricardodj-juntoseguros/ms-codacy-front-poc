import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PreApprovalContainer from './PreApprovalContainer';

import PreApprovalAPI from '../../../application/features/PreApprovalAPI';

describe('PreApprovalContainer', () => {
  beforeAll(() => {
    jest.spyOn(PreApprovalAPI, 'getProposal').mockImplementation();
    jest.spyOn(PreApprovalAPI, 'refuseProposal').mockImplementation();
    jest.spyOn(PreApprovalAPI, 'approveProposal').mockImplementation();
  });
  it('Should render correctly', () => {
    const { container } = render(<PreApprovalContainer />);
    expect(container).toBeInTheDocument();
  });

  it('Should call getProposal on first render', () => {
    render(<PreApprovalContainer />);
    expect(PreApprovalAPI.getProposal).toHaveBeenCalled();
  });
});
