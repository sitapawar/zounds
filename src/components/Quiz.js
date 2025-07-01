import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import quizData from '../questions/lovehonor.json';
import { supabase } from './supabase.js';
import './style.css';

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ Love: 0, Duty: 0, Honor: 0, Reason: 0 });
  const [completed, setCompleted] = useState(false);
  const chartRef = useRef();
  const [animClass, setAnimClass] = useState("fade-in");

const handleAnswer = async (scoresToAdd, answerText, questionId) => {
  setAnimClass("fade-out");

  setTimeout(async () => {
    // Fetch existing count (if any)
    const { data: existing, error: selectError } = await supabase
      .from('answer_counts')
      .select('count')
      .eq('question_id', questionId)
      .eq('answer_text', answerText)
      .maybeSingle();  // <-- more resilient than .single()

    if (selectError) {
      console.error("Error checking answer_counts:", selectError);
    }

    if (existing) {
      // Update existing count
      const { error: updateError } = await supabase
        .from('answer_counts')
        .update({ count: existing.count + 1 })
        .eq('question_id', questionId)
        .eq('answer_text', answerText);

      if (updateError) {
        console.error("Error updating answer_counts:", updateError);
      }
    } else {
      // Insert new count
      const { error: insertError } = await supabase
        .from('answer_counts')
        .insert([{ question_id: questionId, answer_text: answerText, count: 1 }]);

      if (insertError) {
        console.error("Error inserting into answer_counts:", insertError);
      }
    }

    // Update local scores
    const newScores = { ...scores };
    for (let key in scoresToAdd) {
      newScores[key] += scoresToAdd[key];
    }
    setScores(newScores);

    if (currentQ + 1 < quizData.length) {
      setCurrentQ(currentQ + 1);
      setAnimClass("fade-in");
    } else {
      const { error: insertFinal } = await supabase
        .from('responses')
        .insert([{
          love: newScores.Love,
          duty: newScores.Duty,
          honor: newScores.Honor,
          reason: newScores.Reason
        }]);

      if (insertFinal) {
        console.error("Error saving final scores:", insertFinal);
      }

      setCompleted(true);
    }
  }, 300);
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

    svg.append("text").attr("x", centerX).attr("y", 10)
      .attr("text-anchor", "middle").attr("class", "axis-label").text("Love");
    svg.append("text").attr("x", centerX).attr("y", height - 5)
      .attr("text-anchor", "middle").attr("class", "axis-label").text("Duty");
    svg.append("text").attr("x", width - 5).attr("y", centerY - 5)
      .attr("text-anchor", "end").attr("class", "axis-label").text("Reason");
    svg.append("text").attr("x", 5).attr("y", centerY - 5)
      .attr("text-anchor", "start").attr("class", "axis-label").text("Honor");

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
            <p className="quiz-question">{quizData[currentQ].text}</p>
            <br /><div className="dividerLine"></div><br />
            {quizData[currentQ].answers.map((ans, idx) => (
              <button
                key={idx}
                className="quiz-button"
                onClick={() => handleAnswer(ans.scores, ans.text, quizData[currentQ].id)}
              >
                {ans.text}
              </button>
            ))}
          </div>
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
