import React from 'react';
import './style.css';

export default function Home({ onStart }) {
  return (
    <div className="home-screen">
        <div class="titleText">
            <h1>furioso.</h1>
            <h2>epic charts for conflicting values</h2>
            <button className="start-button" onClick={onStart}>
        Start Quiz
      </button>
        </div>
      
    </div>
  );
}
