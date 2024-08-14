import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import YouTuberLogin from './pages/YouTuberLogin';
import EditorLogin from './pages/EditorLogin';
import EditorRegister from './pages/EditorRegister';
import EditorDashboard from './components/dashboard/EditorDashboard';
import YouTuberDashboard from './components/dashboard/YouTuberDashboard';
import { AuthProvider } from './context/AuthContext';
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
import { Sidebar } from './components/Sidebar';
import { RecoilRoot } from 'recoil';
import { Header } from './components/Header';
import { Login } from './pages/Login';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AuthProvider>
          {/* <Header /> */}
          <div className="flex w-full">
            <div className="w-full">
              <Sidebar />
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/signup" element={<Home />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/loader" element={<Loader />} />
                  <Route path="/youtuber/login" element={<YouTuberLogin />} />
                  <Route path="/editor/login" element={<EditorLogin />} />
                  <Route path="/editor/signup" element={<EditorRegister />} />
                  <Route path="/editor/confirm-channel" element={<ConfirmChannel />} />
                  <Route path="/editor/forgot-password" element={<ForgotPassword />} />
                  <Route path="/editor/reset-password" element={<ResetPassword />} />
                  <Route path="/editor/dashboard" element={<ProtectedRouteEditor><EditorDashboard /></ProtectedRouteEditor>} />
                  <Route path="/editor/channel/:id" element={<ProtectedRouteEditor><AddVideo /></ProtectedRouteEditor>} />
                  <Route path="/youtuber/dashboard" element={<ProtectedRouteYouTuber><YouTuberDashboard /></ProtectedRouteYouTuber>} />
                  <Route path="/youtuber/video/:id" element={<ProtectedRouteYouTuber><ApproveVideo /></ProtectedRouteYouTuber>} />
                  <Route path="/youtuber/approve/:id" element={<ProtectedRouteYouTuber><ApproveVideoFromMail /></ProtectedRouteYouTuber>} />
                  <Route path="/youtuber/dashboard/invite-editor" element={<ProtectedRouteYouTuber>
                    <InvitationForm />
                  </ProtectedRouteYouTuber>}
                  />
                </Routes>
              </main>
            </div>
          </div>
        </AuthProvider>
      </Router >
    </RecoilRoot>
  );
}

export default App;
