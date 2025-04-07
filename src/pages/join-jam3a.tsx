import React from 'react';
import { Routes, Route } from 'react-router-dom';
import JoinJam3a from './JoinJam3a';

const JoinJam3aRoutes = () => {
  return (
    <Routes>
      <Route path="/:dealId" element={<JoinJam3a />} />
    </Routes>
  );
};

export default JoinJam3aRoutes;
