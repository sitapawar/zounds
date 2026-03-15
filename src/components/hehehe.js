import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { supabase } from "./supabase";
import './style.css';

export default function SecretPage2() {
  const pieRef = useRef();
  const scatterRef = useRef();
  const relativeScatter1Ref = useRef();
  const relativeScatter2Ref = useRef();
  const [averages, setAverages] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const checkPassword = () => {
    if (passwordInput === "ariosto") {
      setAuthorized(true);
    } else {
      alert("Incorrect password.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") checkPassword();
  };

  useEffect(() => {
    if (!authorized) return;
    async function fetchData() {
      const { data, error } = await supabase.from("responses").select(`
        name,
        love_normalized,
        duty_normalized,
        honor_normalized,
        reason_normalized
      `);
      if (error || !data || data.length === 0) {
        console.error("Supabase error:", error);
        return;
      }

      const totals = data.reduce(
        (acc, curr) => {
          acc.love += curr.love_normalized || 0;
          acc.duty += curr.duty_normalized || 0;
          acc.honor += curr.honor_normalized || 0;
          acc.reason += curr.reason_normalized || 0;
          return acc;
        },
        { love: 0, duty: 0, honor: 0, reason: 0 }
      );

      const averages = {
        Love: totals.love / data.length,
        Duty: totals.duty / data.length,
        Honor: totals.honor / data.length,
        Reason: totals.reason / data.length,
      };

      setAverages(averages);
      setDataPoints(data);
    }

    fetchData();
  }, [authorized]);

  // Reusable normalization helper
  const getMinMax = (key) => {
    const values = dataPoints.map((d) => d[key]).filter((v) => v != null);
    return { min: d3.min(values), max: d3.max(values) };
  };

  // Render Relative Scatter Plot
  const renderRelativeScatter = (ref, axisX, axisY, axisLabels) => {
    if (!dataPoints.length) return;

    const minMax = {
      [axisX[0]]: getMinMax(axisX[0]),
      [axisX[1]]: getMinMax(axisX[1]),
      [axisY[0]]: getMinMax(axisY[0]),
      [axisY[1]]: getMinMax(axisY[1]),
    };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 320;
    const height = 360;
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 20;

    const scaleX = d3.scaleLinear().domain([-1, 1]).range([padding, width - padding]);
    const scaleY = d3.scaleLinear().domain([-1, 1]).range([height - padding, padding]);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", "auto");

    svg.append("line").attr("x1", 0).attr("y1", centerY).attr("x2", width).attr("y2", centerY).attr("stroke", "#E5D6C7");
    svg.append("line").attr("x1", centerX).attr("y1", 20).attr("x2", centerX).attr("y2", height - 20).attr("stroke", "#E5D6C7");

    svg.append("text").attr("x", centerX).attr("y", 10).attr("text-anchor", "middle").attr("class", "axis-label").text(axisLabels.top);
    svg.append("text").attr("x", centerX).attr("y", height - 5).attr("text-anchor", "middle").attr("class", "axis-label").text(axisLabels.bottom);
    svg.append("text").attr("x", width - 5).attr("y", centerY - 5).attr("text-anchor", "end").attr("class", "axis-label").text(axisLabels.right);
    svg.append("text").attr("x", 5).attr("y", centerY - 5).attr("text-anchor", "start").attr("class", "axis-label").text(axisLabels.left);

    const norm = (key, val) => {
      const { min, max } = minMax[key];
      return (val - min) / (max - min || 1);
    };

dataPoints.forEach((d) => {
  const x = norm(axisX[0], d[axisX[0]] ?? 0) - norm(axisX[1], d[axisX[1]] ?? 0);
  const y = norm(axisY[0], d[axisY[0]] ?? 0) - norm(axisY[1], d[axisY[1]] ?? 0);

  const cx = scaleX(x);
  const cy = scaleY(y);

  const isMatch = searchTerm && d.name?.toLowerCase().includes(searchTerm.toLowerCase());

  const point = svg.append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", 5)
    .attr("fill", isMatch ? "#f77f00" : "#E5D6C7")
    .attr("stroke", "#121116")
    .attr("stroke-width", 0.5)
    .attr("opacity", 0.85)
    .style("cursor", "pointer");

  // Always render label for search hit
  if (isMatch) addLabel(cx, cy, d.name);

  // Add label on click
  point.on("click", () => {
    svg.selectAll(".label-group").remove();
    addLabel(cx, cy, d.name);
  });

  function addLabel(x, y, name) {
    const labelGroup = svg.append("g").attr("class", "label-group");

    const text = labelGroup.append("text")
      .text(name || "Anonymous")
      .attr("x", x)
      .attr("y", y - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#E5D6C7")
      .attr("font-size", "0.8rem")
      .attr("font-weight", "bold");

    const bbox = text.node().getBBox();

    labelGroup.insert("rect", "text")
      .attr("x", bbox.x - 4)
      .attr("y", bbox.y - 2)
      .attr("width", bbox.width + 8)
      .attr("height", bbox.height + 4)
      .attr("fill", "#121116")
      .attr("rx", 3);
  }
});
  };

  useEffect(() => {
    renderRelativeScatter(relativeScatter1Ref,
      ["reason_normalized", "honor_normalized"],
      ["love_normalized", "duty_normalized"],
      { top: "Love", bottom: "Duty", right: "Reason", left: "Honor" }
    );

    renderRelativeScatter(relativeScatter2Ref,
      ["honor_normalized", "duty_normalized"],
      ["love_normalized", "reason_normalized"],
      { top: "Love", bottom: "Reason", right: "Honor", left: "Duty" }
    );
  }, [dataPoints, searchTerm]);

  if (!authorized) {
    return (
      <div className="name-screen">
        <div className="titleText">
          <input
            type="password"
            placeholder="Enter secret password"
            className="name-input"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <p><i>Enter password to unclasp a secret book.</i></p>
          <button className="name-button" onClick={checkPassword}>Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-subtitle">Welcome to Secret Insights</h2>
      <p><i>You’ve unlocked the hidden content.</i></p>

      <p>Search by name:</p>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a name..."
          className="name-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <p>Love vs Duty, Reason vs Honor</p>
      <svg ref={relativeScatter1Ref} className="d3-chart"></svg>

      <p>Variation (Love vs Reason, Honor vs Duty)</p>
      <svg ref={relativeScatter2Ref} className="d3-chart"></svg>
    </div>
  );
}