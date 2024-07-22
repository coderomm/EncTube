import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import YouTuberLogin from './pages/YouTuberLogin';
import EditorLogin from './pages/EditorLogin';
import EditorRegister from './pages/EditorRegister';
import EditorDashboard from './components/dashboard/EditorDashboard';
import YouTuberDashboard from './components/dashboard/YouTuberDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRouteYoutuber from './components/ProtectedRouteYoutuber';
import ProtectedRouteEditor from './components/ProtectedRouteEditor';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-youtuber" element={<YouTuberLogin />} />
          <Route path="/login-editor" element={<EditorLogin />} />
          <Route path="/register-editor" element={<EditorRegister />} />
          <Route
            path="/editor-dashboard"
            element={
              <ProtectedRouteEditor>
                <EditorDashboard />
              </ProtectedRouteEditor>
            }
          />
          <Route
            path="/youtuber-dashboard"
            element={
              <ProtectedRouteYoutuber>
                <YouTuberDashboard />
              </ProtectedRouteYoutuber>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
