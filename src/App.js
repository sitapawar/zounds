// App.js — uses separate Home component and Quiz component with nav bar

import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Quiz from './components/Quiz';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  const [started, setStarted] = useState(false);

  const goHome = () => setStarted(false);

  return (
    <div className="App">
      <Navbar onHomeClick={goHome} />
      {!started ? <Home onStart={() => setStarted(true)} /> : <Quiz />}
    </div>
  );
}

export default App;