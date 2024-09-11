import React from 'react';
import { BrowserRouter, Route, Routes as DomRoutes } from 'react-router-dom';
import ProcessListContainer from '../presentation/pages/ProcessListContainer';
import ProcessDetailsContainer from '../presentation/pages/ProcessDetailsContainer';

const Routes: React.FC = () => (
  <DomRoutes>
    <Route path="/" element={<ProcessListContainer />} />
    <Route path="/details/:proposalId" element={<ProcessDetailsContainer />} />
  </DomRoutes>
);

export default Routes;
