// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import EditorLogin from './pages/EditorLogin';
import InvitationRegister from './pages/InvitationRegister';
import YouTuberDashboard from './components/dashboard/YouTuberDashboard';
import EditorDashboard from './components/dashboard/EditorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor-login" element={<EditorLogin />} /> {/* New Route */}
          <Route path="/register-editor" element={<InvitationRegister />} /> {/* New Route */}
          <Route
            path="/youtuber-dashboard"
            element={
              <ProtectedRoute role="YouTuber">
                <YouTuberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor-dashboard"
            element={
              <ProtectedRoute role="Editor">
                <EditorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
