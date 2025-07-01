import React from 'react';
import './style.css';

export default function Home({ onStart }) {
  return (
    <div className="home-screen">
        <div class="titleText">
            <h1>zounds.</h1>
            <h2>epic charts for conflicting values</h2>
            <h2><i>Inspired by value conflicts in classic plays and poems, find out where you fall in situations that challenge your personal convictions, social obligations, logic, or heart.   </i></h2><br></br>
            <button className="start-button" onClick={onStart}>
        Start Quiz
      </button>
        </div>
      
    </div>
  );
}
