import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadVideo from './components/UploadVideo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/upload" element={<UploadVideo />} />
      </Routes>
    </div>
  );
}

export default App;
