import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quiz from './components/Quiz';
import About from './components/About';
import NameScreen from './components/NameScreen'; // <-- make sure to create this component

function App() {
  const [started, setStarted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [nameEntered, setNameEntered] = useState(false);
  const [userName, setUserName] = useState('');
  
  const handleReset = () => {
    setShowAbout(false);
    setStarted(false);
    setNameEntered(false);
    setUserName('');
  };


  return (
    <div className="App">
      <Navbar
        onHomeClick={handleReset}
        onStartOverClick={handleReset}
        onAboutClick={() => setShowAbout(true)}  
      />

      {showAbout && <About onClose={() => setShowAbout(false)} />} 

      {!showAbout && (
        !started ? (
          <Home onStart={() => setStarted(true)} />
        ) : !nameEntered ? (
          <NameScreen
            onSubmit={(name) => {
              setUserName(name);
              setNameEntered(true);
            }}
          />
        ) : (
          <Quiz userName={userName} />
        )
      )}
    </div>
  );
}

export default App;
