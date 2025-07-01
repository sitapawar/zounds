import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import quizData from '../questions/lovehonor.json';
import { supabase } from './supabase.js';
import './style.css';

export default function Quiz({ userName }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ Love: 0, Duty: 0, Honor: 0, Reason: 0 });
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [durations, setDurations] = useState([]);
  const chartRef = useRef();
  const [animClass, setAnimClass] = useState("fade-in");

  const handleAnswer = (scoresToAdd, answerText, questionId) => {
    const timeSpent = (Date.now() - startTime) / 1000;
    setDurations([...durations, timeSpent]);
    setStartTime(Date.now());
    setAnimClass("fade-out");

    setTimeout(() => {
      const newScores = { ...scores };
      for (let key in scoresToAdd) {
        newScores[key] += scoresToAdd[key];
      }
      setScores(newScores);
      setHistory([...history, { questionId, answerText, scores: scoresToAdd }]);

      if (currentQ + 1 < quizData.length) {
        setCurrentQ(currentQ + 1);
        setAnimClass("fade-in");
      } else {
        saveFinalResults(newScores);
        setCompleted(true);
      }
    }, 300);
  };

  const handleGoBack = () => {
    if (currentQ === 0 || history.length === 0) return;
    const last = history[history.length - 1];
    const updatedScores = { ...scores };
    for (let key in last.scores) {
      updatedScores[key] -= last.scores[key];
    }
    setScores(updatedScores);
    setCurrentQ(currentQ - 1);
    setHistory(history.slice(0, -1));
    setDurations(durations.slice(0, -1));
    setStartTime(Date.now());
  };

  const saveFinalResults = async (finalScores) => {
    const normalizedLove = finalScores.Love / 14;
    const normalizedDuty = finalScores.Duty / 14;
    const normalizedHonor = finalScores.Honor / 13;
    const normalizedReason = finalScores.Reason / 13;
    // const avgTimePerQuestion = durations.reduce((a, b) => a + b, 0) / durations.length || 0;

    const { data: responseData, error: insertError } = await supabase
      .from('responses')
      .insert([{
        name: userName || null,
        love: finalScores.Love,
        duty: finalScores.Duty,
        honor: finalScores.Honor,
        reason: finalScores.Reason,
        love_normalized: normalizedLove,
        duty_normalized: normalizedDuty,
        honor_normalized: normalizedHonor,
        reason_normalized: normalizedReason,
        // avg_time_seconds: avgTimePerQuestion
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Error saving final scores:", insertError);
      return;
    }

    const responseId = responseData.id;

    for (const item of history) {
      await supabase.from('answer_counts').insert({
        question_id: item.questionId,
        answer_text: item.answerText,
        timestamp: new Date().toISOString()
      });
    }

    for (const item of history) {
      await supabase.from('answers').insert({
        response_id: responseId,
        name: userName || null,
        question_id: item.questionId,
        answer_text: item.answerText
      });
    }
  };

  const normalizedLove = scores.Love / 14;
  const normalizedDuty = scores.Duty / 14;
  const normalizedHonor = scores.Honor / 13;
  const normalizedReason = scores.Reason / 13;

  const x = (normalizedReason - normalizedHonor);
  const y = (normalizedLove - normalizedDuty);

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

    svg.append("line").attr("x1", 0).attr("y1", centerY).attr("x2", width).attr("y2", centerY).attr("stroke", "#ccc");
    svg.append("line").attr("x1", centerX).attr("y1", 20).attr("x2", centerX).attr("y2", height - 20).attr("stroke", "#ccc");
    svg.append("text").attr("x", centerX).attr("y", 10).attr("text-anchor", "middle").attr("class", "axis-label").text("Love");
    svg.append("text").attr("x", centerX).attr("y", height - 5).attr("text-anchor", "middle").attr("class", "axis-label").text("Duty");
    svg.append("text").attr("x", width - 5).attr("y", centerY - 5).attr("text-anchor", "end").attr("class", "axis-label").text("Reason");
    svg.append("text").attr("x", 5).attr("y", centerY - 5).attr("text-anchor", "start").attr("class", "axis-label").text("Honor");
    svg.append("circle").attr("cx", scaleX(x)).attr("cy", scaleY(y)).attr("r", 7).attr("fill", "#E5D6C7");
  }, [completed, x, y]);

  const renderScores = () => {
    const lovePct = (scores.Love / 14) * 100;
    const dutyPct = (scores.Duty / 14) * 100;
    const honorPct = (scores.Honor / 13) * 100;
    const reasonPct = (scores.Reason / 13) * 100;

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
              <span key={index} className={`progress-bubble ${index < currentQ ? 'completed' : ''} ${index === currentQ ? 'current' : ''}`}></span>
            ))}
          </div>
          <div className={animClass}>
            <p className="quiz-question">{quizData[currentQ].text}</p>
            <br /><div className="dividerLine"></div><br />
            {quizData[currentQ].answers.map((ans, idx) => (
              <button key={idx} className="quiz-button" onClick={() => handleAnswer(ans.scores, ans.text, quizData[currentQ].id)}>
                {ans.text}
              </button>
            ))}
            
          </div>
          <br></br>
            {currentQ > 0 && (
              <button className="quiz-button back-button" onClick={handleGoBack}>← Back</button>
            )}
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
