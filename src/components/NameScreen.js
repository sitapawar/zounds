import React, { useState } from 'react';
import './style.css';

export default function NameScreen({ onSubmit }) {
  const [nameInput, setNameInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit(nameInput);
    }
  };

  return (
    <div className="name-screen">
      <div className="titleText">
        <br></br><br></br>
        <input
          type="text"
          placeholder="What's your name?"
          className="name-input"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <p><i>You can leave this blank to stay anonymous. <br></br>Your name will not be connected to your specific answers.</i></p>

        <button className="name-button" onClick={() => onSubmit(nameInput)}>
          Continue
        </button>
      </div>
    </div>
  );
}
