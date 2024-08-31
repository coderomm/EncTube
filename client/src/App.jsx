import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, Suspense, lazy, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ProtectedRouteEditor from './components/ProtectedRouteEditor';
import ProtectedRouteYouTuber from './components/ProtectedRouteYoutuber';
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import pingServer from './utils/pingServer';

const Home = lazy(() => import('./pages/Home'));
const YouTuberLogin = lazy(() => import('./pages/YouTuberLogin'));
const EditorLogin = lazy(() => import('./pages/EditorLogin'));
const EditorRegister = lazy(() => import('./pages/EditorRegister'));
const EditorDashboard = lazy(() => import('./components/dashboard/EditorDashboard'));
const YouTuberDashboard = lazy(() => import('./components/dashboard/YouTuberDashboard'));
const InvitationForm = lazy(() => import('./components/InvitationForm'));
const ConfirmChannel = lazy(() => import('./pages/ConfirmChannel'));
const AddVideo = lazy(() => import('./pages/AddVideo'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ApproveVideo = lazy(() => import('./pages/ApproveVideo'));
const ApproveVideoFromMail = lazy(() => import('./pages/ApproveVideoFromMail'));
const Features = lazy(() => import('./pages/Features'));
const Contact = lazy(() => import('./pages/Contact'));
const EditorsList = lazy(() => import('./pages/EditorsList'));

function App() {
  console.log(`${import.meta.env.VITE_APP_BACKEND_URL}`)
  useEffect(() => {
    const interval = setInterval(pingServer, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
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
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="*" element={<Navigate to="/" replace />} />
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App;
