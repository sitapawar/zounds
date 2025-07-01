// Quiz.js — displays normalized scores with shortened Y-axis lines to avoid label overlap

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import quizData from '../questions/lovehonor.json';
import './style.css';

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ Love: 0, Duty: 0, Honor: 0, Reason: 0 });
  const [completed, setCompleted] = useState(false);
  const chartRef = useRef();
  const [animClass, setAnimClass] = useState("fade-in");

const handleAnswer = (scoresToAdd) => {
  setAnimClass("fade-out"); // trigger fade out
  setTimeout(() => {
    const newScores = { ...scores };
    for (let key in scoresToAdd) {
      newScores[key] += scoresToAdd[key];
    }
    setScores(newScores);

    if (currentQ + 1 < quizData.length) {
      setCurrentQ(currentQ + 1);
      setAnimClass("fade-in"); // fade in new question
    } else {
      setCompleted(true);
    }
  }, 300); // match fade-out timing
};


  const totalX = scores.Reason + scores.Honor;
  const x = totalX === 0 ? 0 : (scores.Reason - scores.Honor) / totalX;

  const totalY = scores.Love + scores.Duty;
  const y = totalY === 0 ? 0 : (scores.Love - scores.Duty) / totalY;

  useEffect(() => {
    if (!completed) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = 320;
    const height = 360;
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 20;
    const scaleX = d3.scaleLinear().domain([-1, 1]).range([padding, width - padding]);
    const scaleY = d3.scaleLinear().domain([-1, 1]).range([height - padding, padding]);

    svg.attr("width", width).attr("height", height);

    const yAxisShorten = 20;

    // Draw X and shortened Y axes
    svg.append("line")
      .attr("x1", 0).attr("y1", centerY)
      .attr("x2", width).attr("y2", centerY)
      .attr("stroke", "#ccc");

    svg.append("line")
      .attr("x1", centerX)
      .attr("y1", yAxisShorten)
      .attr("x2", centerX)
      .attr("y2", height - yAxisShorten)
      .attr("stroke", "#ccc");

    // Axis labels (now outside visible Y axis line)
    svg.append("text")
      .attr("x", centerX)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Love");

    svg.append("text")
      .attr("x", centerX)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Duty");

    svg.append("text")
      .attr("x", width - 5)
      .attr("y", centerY - 5)
      .attr("text-anchor", "end")
      .attr("class", "axis-label")
      .text("Reason");

    svg.append("text")
      .attr("x", 5)
      .attr("y", centerY - 5)
      .attr("text-anchor", "start")
      .attr("class", "axis-label")
      .text("Honor");

    // Plot user's point
    svg.append("circle")
      .attr("cx", scaleX(x))
      .attr("cy", scaleY(y))
      .attr("r", 7)
      .attr("fill", "#E5D6C7");
  }, [completed, x, y]);

  const renderScores = () => {
    const totalVertical = scores.Love + scores.Duty;
    const totalHorizontal = scores.Honor + scores.Reason;

    const lovePct = totalVertical === 0 ? 0 : (scores.Love / totalVertical) * 100;
    const dutyPct = totalVertical === 0 ? 0 : (scores.Duty / totalVertical) * 100;
    const honorPct = totalHorizontal === 0 ? 0 : (scores.Honor / totalHorizontal) * 100;
    const reasonPct = totalHorizontal === 0 ? 0 : (scores.Reason / totalHorizontal) * 100;

    return (
      <>
        <li>Love: {lovePct.toFixed(1)}%</li>
        <li>Duty: {dutyPct.toFixed(1)}%</li>
        <li>Honor: {honorPct.toFixed(1)}%</li>
        <li>Reason: {reasonPct.toFixed(1)}%</li>
      </>
    );
  };

  return (
    <div className="quiz-container">
        
      {!completed ? (
        
        <div>
            <div className="progress-indicator">
  {quizData.map((_, index) => (
    <span
      key={index}
      className={`progress-bubble ${index < currentQ ? 'completed' : ''} ${index === currentQ ? 'current' : ''}`}
    ></span>
  ))}
</div>
            <div className={animClass}>
          <p className="quiz-question">{quizData[currentQ].text}</p><br></br>
          <div className="dividerLine"></div><br></br>
          {quizData[currentQ].answers.map((ans, idx) => (
            <button
              key={idx}
              className="quiz-button"
              onClick={() => handleAnswer(ans.scores)}
            >
              {ans.text}
            </button>
          ))}
          </div>
          {/* <br></br><div className="dividerLine"></div><br></br>
          <h3><i>While you might align with multiple or no answers depending on the situation, try to pick the answer that feels best in the abstract based on what you would feel good about doing or what feels true on impuse.</i></h3> */}
        </div>
      ) : (
        <div>
          <h2 className="quiz-subtitle">Your Results</h2>
          <svg ref={chartRef} className="d3-chart"></svg>
          <ul className="score-list">
            {renderScores()}
          </ul>
        </div>
      )}
    </div>
  );
}
