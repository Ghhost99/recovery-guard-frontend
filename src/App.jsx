import { Routes, Route } from "react-router-dom";
import Home from "@pages/home";
import SocialMediaRecoveryForm from "@pages/SocialMediaRecovery";
import MoneyRecoveryForm from "@pages/MoneyRecovery";
import CryptoLossForm from "@pages/CryptoCurrencyRecovery";
import ArticlesPage from "./pages/articles";
import RecoveryOptions from "./pages/RecoveryOptions";
import ContactSection from "./pages/contact";
import AboutSection from "./pages/about";
import FAQSection from "./pages/faq";
import NotFound from "./pages/NotFound"; 
import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notifications from "./pages/Notifications";
import Cases from "./pages/Cases";
import MessageList from "./pages/MessageList"; 
import MessageDashboard from "./components/MessageDashboard"; 
import MessageContainer from "./components/MessageContainer"; 
import Socials from "./utils/Socials"; 
import ComingSoon from "./utils/ComingSoon";
import CaseHistory from "./pages/CaseHistory";
import LanguageSelector from "./pages/LanguageSelector";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/start-recovery" element={<RecoveryOptions />} /> {/* ✅ add route */}
      <Route path="/submit-case" element={<RecoveryOptions />} /> {/* ✅ add route */}
      <Route path="/coming-soon" element={<ComingSoon/>}/>
      <Route path="/socials" element={<Socials />} />
      <Route path="/money-recovery" element={<MoneyRecoveryForm />} />
      <Route path="/crypto-recovery" element={<CryptoLossForm />} />
      <Route path="/socials-recovery" element={<SocialMediaRecoveryForm/>}/>
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/contact" element={<ContactSection />} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="/faq" element={<FAQSection />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="*" element={<NotFound />} /> {/* Use NotFound for 404 */}
      <Route path="/messages" element={<MessageDashboard />} /> {/* optional */}
      <Route path="/support" element={<MessageDashboard />} /> {/* optional */}
      <Route path="/cases/:caseId" element={<MessageContainer />} /> {/* optional */}
      <Route path="/cases/:caseId/messages" element={<MessageContainer />} /> {/* optional */}
      <Route path="/case-history" element={<CaseHistory/>}/>
<Route path="/language" element={<LanguageSelector />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
