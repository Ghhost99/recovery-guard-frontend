import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./components/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import CaseList from "./pages/Cases";
import CaseDetail from "./components/CaseDetail"; // or wherever it's defined
import MessageDashboard from "./components/MessageDashboard"; // optional
import CaseMessageContainer from "./components/CaseMessageContainer"; // optional
import MessageList from "./pages/MessageList";
import Home from "./pages/home";
import SocialMediaRecoveryPage from "./pages/SocialMediaRecovery";
import MoneyRecoveryForm from "./pages/MoneyRecovery";
import CryptoLossReport from "./pages/CryptoCurrencyRecovery";
import ArticlesPage from "./pages/articles";
import RecoveryOptions from "./pages/RecoveryOptions";
import ContactSection from "./pages/contact";
import AboutSection from "./pages/about";
import FAQSection from "./pages/faq";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/start-recovery" element={<RecoveryOptions />} />
          <Route path="/socials" element={<SocialMediaRecoveryPage />} />
          <Route path="/money-recovery" element={<MoneyRecoveryForm />} />
          <Route path="/crypto-recovery" element={<CryptoLossReport />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/faq" element={<FAQSection />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/cases" element={<RequireAuth><CaseList /></RequireAuth>} />
          <Route path="/cases/:caseId" element={<RequireAuth><CaseDetail /></RequireAuth>} />
          <Route path="/cases/:caseId/messages" element={<RequireAuth><CaseMessageContainer /></RequireAuth>} />
          <Route path="/messages" element={<RequireAuth><MessageDashboard /></RequireAuth>} />
          <Route path="/support" element={<RequireAuth><MessageList /></RequireAuth>} />

          {/* Not Found */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
