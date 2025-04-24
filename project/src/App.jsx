import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detect from './pages/Detect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detect" element={<Detect />} />
    </Routes>
  );
}

export default App;