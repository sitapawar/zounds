import React from 'react';
import './style.css';

export default function Home({ onStart }) {
  return (
    <div className="home-screen">
        <div class="titleText">
            <h1>zounds.</h1>
            <h2><i>Map your Contradictions</i></h2><br></br>
            {/* <h2><i>Inspired by value conflicts in classic plays and poems, find out where you fall in situations that challenge your personal convictions, social obligations, logic, or heart.   </i></h2><br></br> */}
            {/* <button className="start-button" onClick={onStart}>
        Start Quiz
      </button> */}
      <button className="start-button" onClick={() => onStart('normal')}>Start Quiz</button>
<p className="quiz-modes">
  <span onClick={() => onStart('alt')} className="quiz-mode-option">Alternative Version</span> 
  {/* |{" "} */}
  {/* <span onClick={() => onStart('extended')} className="quiz-mode-option">Extended Edition</span>  */}

</p>

        </div>
      
    </div>
  );
}
