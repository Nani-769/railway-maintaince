import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ExcelUpload from './pages/excel-upload';
import LoginPage from './pages/login';
import CreateRequest from './pages/create-request';
import UserDashboard from './pages/user-dashboard';
import RequestManagement from './pages/request-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CreateRequest />} />
        <Route path="/excel-upload" element={<ExcelUpload />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/request-management" element={<RequestManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
