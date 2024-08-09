import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/youtuber/dashboard/invite-editor" element={<ProtectedRouteYouTuber>
            <InvitationForm />
          </ProtectedRouteYouTuber>}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
