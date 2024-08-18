import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { RecoilRoot } from 'recoil';
import Home from './pages/Home';
import YouTuberLogin from './pages/YouTuberLogin';
import EditorLogin from './pages/EditorLogin';
import EditorRegister from './pages/EditorRegister';
import EditorDashboard from './components/dashboard/EditorDashboard';
import YouTuberDashboard from './components/dashboard/YouTuberDashboard';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ProtectedRouteEditor from './components/ProtectedRouteEditor';
import ProtectedRouteYouTuber from './components/ProtectedRouteYoutuber';
import InvitationForm from './components/InvitationForm';
import ConfirmChannel from './pages/ConfirmChannel';
import AddVideo from './pages/AddVideo';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ApproveVideo from './pages/ApproveVideo';
import Loader from './components/Loader';
import ApproveVideoFromMail from './pages/ApproveVideoFromMail';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Features from './pages/Features';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import EditorsList from './pages/EditorsList';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </Router>
    </RecoilRoot>
  );
}

function MainContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex w-full">
      <div className="w-full">
        <Sidebar />
        <Header />
        <main>
          <Routes>
            {!user && <Route path="/" element={<Home />} />}
            <Route path="/loader" element={<Loader />} />
            <Route path="/us/features" element={<Features />} />
            <Route path="/us/contact-us" element={<Contact />} />
            <Route path="/youtuber/login" element={<YouTuberLogin />} />
            <Route path="/editor/login" element={<EditorLogin />} />
            <Route path="/editor/signup" element={<EditorRegister />} />
            <Route path="/editor/confirm-channel" element={<ConfirmChannel />} />
            <Route path="/editor/forgot-password" element={<ForgotPassword />} />
            <Route path="/editor/reset-password" element={<ResetPassword />} />
            {user && user.role === 'Editor' &&
              <Route path="/" element={<Navigate to="/editor/dashboard" replace />} />}
            <Route path="/editor/dashboard" element={<ProtectedRouteEditor><EditorDashboard /></ProtectedRouteEditor>} />
            <Route path="/editor/channel/:id" element={<ProtectedRouteEditor><AddVideo /></ProtectedRouteEditor>} />
            {user && user.role === 'YouTuber' &&
              <Route path="/" element={<Navigate to="/youtuber/dashboard" replace />} />}
            <Route path="/youtuber/dashboard" element={<ProtectedRouteYouTuber><YouTuberDashboard /></ProtectedRouteYouTuber>} />
            <Route path="/youtuber/all-editors" element={<ProtectedRouteYouTuber><EditorsList /></ProtectedRouteYouTuber>} />
            <Route path="/youtuber/video/:id" element={<ProtectedRouteYouTuber><ApproveVideo /></ProtectedRouteYouTuber>} />
            <Route path="/youtuber/approve/:id" element={<ProtectedRouteYouTuber><ApproveVideoFromMail /></ProtectedRouteYouTuber>} />
            <Route path="/youtuber/dashboard/invite-editor" element={<ProtectedRouteYouTuber>
              <InvitationForm />
            </ProtectedRouteYouTuber>}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App;
