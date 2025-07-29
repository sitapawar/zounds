import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quiz from './components/Quiz';
import About from './components/About';
import NameScreen from './components/NameScreen';
import Insights from './components/insights';
import SecretPage from './components/hehe';

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [nameEntered, setNameEntered] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  const handleReset = () => {
    setShowAbout(false);
    setShowExplanation(false);
    setStarted(false);
    setNameEntered(false);
    setUserName('');
    navigate('/');
  };

  return (
    <div className="App">
      <Navbar
        onHomeClick={handleReset}
        onStartOverClick={handleReset}
        onAboutClick={() => {
          setShowAbout(true);
          setShowExplanation(false);
        }}
        onExplainClick={() => {
          setShowExplanation(true);
          setShowAbout(false);
        }}
        onInsightsClick={() => navigate('/insights')}
      />

      <Routes>
        <Route path="/hehe" element={<SecretPage />} />
        <Route path="/" element={
          showAbout ? <About onClose={() => setShowAbout(false)} /> :
          showExplanation ? (
            <div className="about-overlay2" onClick={() => setShowExplanation(false)}>
              <div className="about-content2" onClick={(e) => e.stopPropagation()}>
                <button className="close-button2" onClick={() => setShowExplanation(false)}>×</button>
                <h2>understand the values. </h2>
                <p><em>Love</em>, <em>honor</em>, <em>duty</em>, and <em>reason</em> are not inherently in conflict, but this chart explores the ways they can come into tension. These ideals hold different meanings for everyone, and understanding your results may benefit from how we’ve chosen to frame them here.</p>
                <p><strong>Love</strong> can refer to romantic, platonic, or familial connections, but it also represents passion, desire, and a commitment to what matters most to you. It’s about following your heart: sometimes generous and selfless, other times impulsive or self-interested. You might value love deeply while recognizing that, in practice, you often prioritize duty.</p>
                <p><strong>Duty</strong> is not the opposite of love; they can be in tension while interwoven. In this context, duty reflects a sense of obligation: what you feel you <em>ought</em> to do. It can be motivated by care for others, commitment to a cause, or responsibility to a community. While love looks inward, duty looks outward to what you owe the people and things around you.</p>
                <p><strong>Honor</strong> can mean living by a moral code, preserving one’s ideals or reputation, or upholding tradition. Honor inspires courageous, principled action, but it can also lead to inflexibility, pridefulness, or isolation when it overrides practicality or empathy.</p>
                <p><strong>Reason</strong> is the domain of logic, pragmatism, and calm deliberation. It can mean knowing when to yield or avoid the overlooked casualties of honor and duty. But taken too far, reason risks becoming detached: machiavellian and calculating outcomes without the anchor of moral conviction or emotional connection.</p>
                <p>Each of these values, when overemphasized or unbalanced, can become distorted. Life constantly asks us to choose, to trade one principle for another depending on the moment. While this chart explores Love vs. Duty and Honor vs. Reason, other arrangements such as Love vs. Reason or Honor vs. Duty can be just as revealing.</p>
                <p>. . .</p>
                <p>For more examples of these conflicts, consider stories like <em>Orlando Furioso</em>, <em>The Iliad</em>, <em>Les Misérables</em>, <em>Star Wars</em>, Shakespeare's <em>Julius Caesar</em>, and <em>Cyrano de Bergerac</em>. </p>
                <button className="close-button3" onClick={() => setShowExplanation(false)}><u>close.</u></button><br></br>
              </div>
            </div>
          ) : (
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
          )
        }/>
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
