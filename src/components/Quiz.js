import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import quizData from '../questions/lovehonor.json';
import { supabase } from './supabase.js';
import './style.css';
// import { AveragePieChart } from "./Results.js";
import { AverageBarChart } from "./BarChart.js";
  import html2canvas from 'html2canvas';

Chart.register(ArcElement, Tooltip, Legend);


export default function Quiz({ userName }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ Love: 0, Duty: 0, Honor: 0, Reason: 0 });
  const [NormScores, setNormScores] = useState({ Love: 0, Duty: 0, Honor: 0, Reason: 0 });
  const [lastAnswerCountUpdate, setLastAnswerCountUpdate] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [durations, setDurations] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const chartRef = useRef();
  const [animClass, setAnimClass] = useState("fade-in");
  const [avgValues, setAvgValues] = useState(null);


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


const handleShareClick = async () => {
  const node = document.getElementById('shareable-content');
  if (!node) return;

  try {
    const canvas = await html2canvas(node, { backgroundColor: null });
    const dataUrl = canvas.toDataURL();

    const link = document.createElement('a');
    link.download = 'your-values.png';
    link.href = dataUrl;
    link.click();

    // Optionally copy link to site
    const shareLink = 'https://yourdomain.com'; // or custom result link
    await navigator.clipboard.writeText(shareLink);
    alert('Image downloaded. Link copied to clipboard!');
  } catch (err) {
    console.error('Sharing failed', err);
  }
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
    if (userName === "123") {
    console.log("Test mode active: results not saved.");
    return;
  }
    const normalizedLove = finalScores.Love / 19;
    const normalizedDuty = finalScores.Duty / 17;
    const normalizedHonor = finalScores.Honor / 14;
    const normalizedReason = finalScores.Reason / 17;

    const {error: insertError } = await supabase
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
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Error saving final scores:", insertError);
      return;
    }

    // const responseId = responseData.id;

for (const item of history) {
  const { questionId, answerText } = item;

  // First, try to update the count if the record exists
  const { error: updateError } = await supabase
    .from("answer_counts")
    .upsert(
      {
        question_id: questionId,
        answer_text: answerText,
        count: 1,
        last_updated: new Date().toISOString(),
      },
      {
        onConflict: ["question_id", "answer_text"],
        ignoreDuplicates: false,
      }
    )
    .select();

  if (updateError) {
    console.error("Error upserting into answer_counts:", updateError);
  }
}



    // for (const item of history) {
    //   await supabase.from('answers').insert({
    //     response_id: responseId,
    //     name: userName || null,
    //     question_id: item.questionId,
    //     answer_text: item.answerText
    //   });
    // }
  };

  const normalizedLove = scores.Love / 19;
  const normalizedDuty = scores.Duty / 17;
  const normalizedHonor = scores.Honor / 14;
  const normalizedReason = scores.Reason / 15;


  const x = (normalizedReason - normalizedHonor);
  const y = (normalizedLove - normalizedDuty);


  useEffect(() => {
  const normScoreList = {
    Love: scores.Love / 19,
    Duty: scores.Duty / 17,
    Honor: scores.Honor / 14,
    Reason: scores.Reason / 15,
  };
  setNormScores(normScoreList);
}, [scores]);


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

    svg
  .attr("viewBox", `0 0 320 360`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("width", "100%")
  .attr("height", "auto");

    svg.append("line").attr("x1", 0).attr("y1", centerY).attr("x2", width).attr("y2", centerY).attr("stroke", "#ccc");
    svg.append("line").attr("x1", centerX).attr("y1", 20).attr("x2", centerX).attr("y2", height - 20).attr("stroke", "#ccc");
    svg.append("text").attr("x", centerX).attr("y", 10).attr("text-anchor", "middle").attr("class", "axis-label").text("Love");
    svg.append("text").attr("x", centerX).attr("y", height - 5).attr("text-anchor", "middle").attr("class", "axis-label").text("Duty");
    svg.append("text").attr("x", width - 5).attr("y", centerY - 5).attr("text-anchor", "end").attr("class", "axis-label").text("Reason");
    svg.append("text").attr("x", 5).attr("y", centerY - 5).attr("text-anchor", "start").attr("class", "axis-label").text("Honor");
    svg.append("circle").attr("cx", scaleX(x)).attr("cy", scaleY(y)).attr("r", 7).attr("fill", "#E5D6C7");


  const fetchAverages = async () => {
    const { data, error } = await supabase.from('responses').select(`
      love_normalized,
      duty_normalized,
      honor_normalized,
      reason_normalized
    `);

    if (error || !data || data.length === 0) {
      console.error("Error fetching comparison data:", error);
      return;
    }

    const totals = data.reduce((acc, curr) => {
      acc.love += curr.love_normalized || 0;
      acc.duty += curr.duty_normalized || 0;
      acc.honor += curr.honor_normalized || 0;
      acc.reason += curr.reason_normalized || 0;
      return acc;
    }, { love: 0, duty: 0, honor: 0, reason: 0 });

const avg = {
  Love: totals.love / data.length,
  Duty: totals.duty / data.length,
  Honor: totals.honor / data.length,
  Reason: totals.reason / data.length,
};

setAvgValues(avg);


    // Now render pie chart
    // const ctx = document.getElementById('avgPieChart');
    // if (ctx) {
    //   new Chart(ctx, {
    //     type: 'pie',
    //     data: {
    //       labels: ['Love', 'Duty', 'Honor', 'Reason'],
    //       datasets: [{
    //         data: [avg.Love, avg.Duty, avg.Honor, avg.Reason],
    //         backgroundColor: ['#E06666', '#FFD966', '#93C47D', '#6FA8DC'],
    //       }]
    //     },
    //     options: {
    //       plugins: {
    //         legend: {
    //           labels: { color: '#E5D6C7' }
    //         }
    //       }
    //     }
    //   });
    // }
  };

  fetchAverages();
  }, [completed, x, y]);


  const renderScores = () => {
    const lovePct = (scores.Love / 19) * 100;
    const dutyPct = (scores.Duty / 17) * 100;
    const honorPct = (scores.Honor / 14) * 100;
    const reasonPct = (scores.Reason / 15) * 100;

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
            {currentQ > 0 && (
              <div style={{ textAlign: "right", marginTop: "1rem" }}>
                <button className="quiz-button back-button" onClick={handleGoBack}>← Back</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div id="shareable-content">
          <h2 className="quiz-subtitle">Your Results</h2>
          <svg ref={chartRef} className="d3-chart"></svg>
          <ul className="score-list">
            {renderScores()}
          </ul>
         </div>
{/* <button className="quiz-button" onClick={handleShareClick}>Share Results</button> */}

          <br></br>
          <div className="dividerLine"></div><br></br>
          <p>What does this mean?</p>
          <button className=" explain quiz-button" onClick={() => setShowExplanation(true)}><u>Understand the Values.</u></button>

          <br /><div className="dividerLine"></div><br />
       {avgValues ? (
 <div className="bar-chart-wrapper">
  <AverageBarChart
    userScores={NormScores}
    averageScores={avgValues}
  />
</div>

) : (
  <p>Loading comparison chart...</p>
)}


        </div>
      )}
      {showExplanation && (
        <div className="about-overlay2" onClick={() => setShowExplanation(false)}>
          <div className="about-content2" onClick={(e) => e.stopPropagation()}>
            <button className="close-button2" onClick={() => setShowExplanation(false)}>×</button>
            <h2>Understanding Your Chart</h2>
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
      )}
    </div>
  );
}
