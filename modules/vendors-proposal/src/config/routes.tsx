import React from 'react';
import { BrowserRouter, Route, Routes as DomRoutes } from 'react-router-dom';
import FlowContainer from '../presentation/pages/FlowContainer';
import ProposalSummary from '../presentation/pages/ProposalSummaryContainer';
import ProposalSuccess from '../presentation/pages/ProposalSuccessContainer';

const Routes: React.FC = () => (
  <DomRoutes>
    <Route path="/" element={<FlowContainer />} />
    <Route path="/summary" element={<ProposalSummary />} />
    <Route path="/success" element={<ProposalSuccess />} />
  </DomRoutes>
);

export default Routes;
