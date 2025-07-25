import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ParagraphSelection from './pages/ParagraphSelection';
import TypingTest from './pages/TypingTest';
import ResultsScreen from './pages/ResultsScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-paragraph" element={<ParagraphSelection />} />
          <Route path="/typing-test" element={<TypingTest />} />
          <Route path="/results" element={<ResultsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;