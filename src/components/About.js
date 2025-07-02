// components/About.js
import React from 'react';
import './style.css';

export default function About({ onClose }) {
  return (
    <div className="about-overlay2">
      <div className="about-content2">     
         <button className="close-button2" onClick={onClose}>✕</button>

        <h1>about.</h1>
        <p>
        Drawn from the enduring conflicts in poetry and literature, <i>Zounds</i> lets you explore where your values lie between love, honor, duty, and reason. Follow your instincts in order to navigate these undefineable ideals and embrace ambiguity.</p>
        <p>
        Use it as a mirror, a story prompt, a conversation starter. It's not a personality test — it’s a map of your contradictions.
        </p>
      </div>
    </div>
  );
}
