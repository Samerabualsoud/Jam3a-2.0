import React from 'react';
import { HashRouter } from 'react-router-dom';

// This component replaces BrowserRouter with HashRouter for static deployments
// HashRouter uses URL hashes which work better in static hosting environments
const StaticRouter = ({ children }) => {
  return <HashRouter>{children}</HashRouter>;
};

export default StaticRouter;
