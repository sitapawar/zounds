import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { supabase } from "./supabase";
import './style.css';

export default function Insights() {
  const pieRef = useRef();
  const scatterRef = useRef();
  const heatmapRef = useRef();
  const [averages, setAverages] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
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
  }, []);

  // PIE CHART RENDER
  useEffect(() => {
    if (!averages) return;

    const data = Object.entries(averages).map(([label, value]) => ({
      label,
      value,
    }));

    const svg = d3.select(pieRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(["#E5D6C7", "#D8C6B8", "#F1E5D9", "#CBB7A7"]);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);

    const chart = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "d3-chart")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    chart
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", "#121116")
      .attr("stroke-width", 2);

    chart
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", "#121116")
      .style("font-size", "0.8rem")
      .text((d) => `${d.data.label}: ${(d.data.value * 100).toFixed(0)}%`);
  }, [averages]);

  // SCATTER CHART RENDER
  useEffect(() => {
    if (!dataPoints.length) return;

    const svg = d3.select(scatterRef.current);
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

    svg.append("text").attr("x", centerX).attr("y", 10).attr("text-anchor", "middle").attr("class", "axis-label").text("Love");
    svg.append("text").attr("x", centerX).attr("y", height - 5).attr("text-anchor", "middle").attr("class", "axis-label").text("Duty");
    svg.append("text").attr("x", width - 5).attr("y", centerY - 5).attr("text-anchor", "end").attr("class", "axis-label").text("Reason");
    svg.append("text").attr("x", 5).attr("y", centerY - 5).attr("text-anchor", "start").attr("class", "axis-label").text("Honor");

    // dataPoints.forEach((d) => {
    //   const x = d.reason_normalized - d.honor_normalized;
    //   const y = d.love_normalized - d.duty_normalized;

    //   svg.append("circle")
    //     .attr("cx", scaleX(x))
    //     .attr("cy", scaleY(y))
    //     .attr("r", 5)
    //     .attr("fill", "#E5D6C7")
    //     .attr("stroke", "#121116")
    //     .attr("stroke-width", 0.5)
    //     .attr("opacity", 0.85);
    // });
    // // Add label on click
    // dataPoints.on("click", function (event, d) {
    //   svg.selectAll(".label").remove();

    //   svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", scaleX((d.reason_normalized ?? 0) - (d.honor_normalized ?? 0)) + 10)
    //     .attr("y", scaleY((d.love_normalized ?? 0) - (d.duty_normalized ?? 0)) - 10)
    //     .text(d.name || "Anonymous")
    //     .attr("fill", "#121116")
    //     .attr("font-size", "0.8rem")
    //     .attr("font-weight", "bold");
    // });
    dataPoints.forEach((d) => {
    const x = (d.reason_normalized ?? 0) - (d.honor_normalized ?? 0);
    const y = (d.love_normalized ?? 0) - (d.duty_normalized ?? 0);
    const cx = scaleX(x);
    const cy = scaleY(y);

    const point = svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 5)
      .attr("fill", "#E5D6C7")
      .attr("stroke", "#121116")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.85)
      .style("cursor", "pointer");

// point.on("click", function () {
//   svg.selectAll(".label-group").remove();

//   const labelText = d.name || "Anonymous";
//   const labelX = cx + 10;
//   const labelY = cy - 10;

//   const labelGroup = svg.append("g").attr("class", "label-group");

//   const textElem = labelGroup
//     .append("text")
//     .text(labelText)
//     .attr("x", labelX)
//     .attr("y", labelY)
//     .attr("fill", "#E5D6C7")
//     .attr("font-size", "0.8rem")
//     .attr("font-weight", "bold");

//   const bbox = textElem.node().getBBox();

//   // Add background rect behind the text
//   labelGroup
//     .insert("rect", "text")
//     .attr("x", bbox.x - 4)
//     .attr("y", bbox.y - 2)
//     .attr("width", bbox.width + 8)
//     .attr("height", bbox.height + 4)
//     .attr("fill", "#121116")
//     .attr("rx", 3); // Optional: rounded corners
// });

  });
  
  }, [dataPoints]);

// HEATMAP RENDER
useEffect(() => {
  if (!dataPoints.length) return;

  const pairs = [
    ["love_normalized", "honor_normalized"],
    ["love_normalized", "reason_normalized"],
    ["honor_normalized", "duty_normalized"],
    ["duty_normalized", "reason_normalized"],
  ];

  const quadrantMatrix = [];

  for (let [xKey, yKey] of pairs) {
    const label = `${xKey.replace("_normalized", "").toUpperCase()}/${yKey.replace("_normalized", "").toUpperCase()}`;
    const counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

    dataPoints.forEach((d) => {
      const x = d[xKey];
      const y = d[yKey];
      if (x == null || y == null) return;

      const xHigh = x >= 0.5;
      const yHigh = y >= 0.5;

      if (xHigh && yHigh) counts.Q1 += 1;
      else if (!xHigh && yHigh) counts.Q2 += 1;
      else if (!xHigh && !yHigh) counts.Q3 += 1;
      else if (xHigh && !yHigh) counts.Q4 += 1;
    });

    quadrantMatrix.push(
      { pair: label, quadrant: "Q1", count: counts.Q1 },
      { pair: label, quadrant: "Q2", count: counts.Q2 },
      { pair: label, quadrant: "Q3", count: counts.Q3 },
      { pair: label, quadrant: "Q4", count: counts.Q4 }
    );
  }

  const svg = d3.select(heatmapRef.current);
  svg.selectAll("*").remove();

  const width = 320;
  const height = 160;
  const margin = { top: 30, right: 20, bottom: 30, left: 100 };

  const chart = svg
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("width", "100%")
    .attr("height", "auto")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xLabels = ["Q1", "Q2", "Q3", "Q4"];
  const yLabels = [...new Set(quadrantMatrix.map((d) => d.pair))];

  const x = d3.scaleBand().range([0, width]).domain(xLabels).padding(0.1);
  const y = d3.scaleBand().range([0, height]).domain(yLabels).padding(0.1);
  const color = d3.scaleLinear().domain([0, d3.max(quadrantMatrix, d => d.count)]).range(["#F1E5D9", "#CBB7A7"]);

  chart.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text")
    .style("fill", "#121116")
    .style("font-size", "0.8rem");

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .style("fill", "#121116")
    .style("font-size", "0.8rem");

  chart.selectAll()
    .data(quadrantMatrix)
    .enter()
    .append("rect")
    .attr("x", d => x(d.quadrant))
    .attr("y", d => y(d.pair))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 4)
    .attr("fill", d => color(d.count));

  chart.selectAll()
    .data(quadrantMatrix)
    .enter()
    .append("text")
    .attr("x", d => x(d.quadrant) + x.bandwidth() / 2)
    .attr("y", d => y(d.pair) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "middle")
    .attr("fill", "#121116")
    .attr("font-size", "0.7rem")
    .text(d => d.count);
}, [dataPoints]);


  return (
    <div className="quiz-container">
      <h2 className="quiz-subtitle">Insights</h2>
      <p>Average love, honor, duty, reason distribution</p>
      <svg ref={pieRef}></svg>
      <br /><br />
      <div className="dividerLine"></div>
      {/* <h2 className="quiz-subtitle">Value Conflict Map</h2> */}
      <p>Full Scatterplot</p>
        <div className="scatter-container">
            <svg ref={scatterRef} className="d3-chart"></svg>
        </div>   
      {/* <div className="dividerLine"></div>
      <p>Matrix View</p> 
      <svg ref={heatmapRef} className="heatmap-chart" width="400" height="400"></svg> */}

    </div>
  );
}
