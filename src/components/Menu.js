import React from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
        <h2 className="quiz-subtitle"> Menu</h2>
      <button onClick={() => navigate("/")}>Home</button>
      <p><i>Additional Content</i></p>
      <button onClick={() => navigate("/insights")}>Insights</button>
      {/* <button onClick={() => navigate("/extended")}>Extended Edition</button> */}
      <button onClick={() => navigate("/reoriented")}>Alt Orientation</button>
    </div>
  );
}
