import React from 'react';
import { BrowserRouter, Route, Routes as DomRoutes } from 'react-router-dom';
import PreApprovalContainer from '../presentation/pages/PreApprovalContainer';
import SuccessContainer from '../presentation/pages/SucessContainer';

const Routes: React.FC = () => (
  <DomRoutes>
    <Route path="/" element={<PreApprovalContainer />} />
    <Route path="/success" element={<SuccessContainer />} />
  </DomRoutes>
);

export default Routes;
