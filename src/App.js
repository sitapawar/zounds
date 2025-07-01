import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quiz from './components/Quiz';
import About from './components/About'; // ← new

function App() {
  const [started, setStarted] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // ← new

  return (
    <div className="App">
      <Navbar
        onHomeClick={() => {
          setShowAbout(false);
          setStarted(false);
        }}
        onStartOverClick={() => setStarted(false)}
        onAboutClick={() => setShowAbout(true)} // ← new
      />

      {showAbout && <About onClose={() => setShowAbout(false)} />} {/* ← new */}
      {!showAbout && (!started ? <Home onStart={() => setStarted(true)} /> : <Quiz />)}
    </div>
  );
}

export default App;
