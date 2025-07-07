import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export function AverageBarChart({ userScores, averageScores }) {
  const barRef = useRef();

  useEffect(() => {
    if (!userScores || !averageScores) return;

    const data = ["Love", "Duty", "Honor", "Reason"].map(key => ({
      label: key,
      user: userScores[key],
      average: averageScores[key]
    }));

    const width = 400;
    const height = 250;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const barWidth = 20;
    const spacing = 50;

    const svg = d3.select(barRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    svg.attr("width", width).attr("height", height);

    const maxVal = d3.max(data.flatMap(d => [d.user, d.average]));

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([height - margin.bottom, margin.top]);

    const g = svg.append("g");

    // User bars
    g.selectAll(".bar-user")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.user))
      .attr("width", barWidth)
      .attr("height", d => y(0) - y(d.user))
      .attr("fill", "#E5D6C7");

    // Average bars
    g.selectAll(".bar-avg")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.label) + barWidth + 4)
      .attr("y", d => y(d.average))
      .attr("width", barWidth)
      .attr("height", d => y(0) - y(d.average))
      .attr("fill", "#E5D6C7")
      .attr("opacity", ".5")

    // Labels above bars
    // g.selectAll(".label-user")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .attr("x", d => x(d.label) + barWidth / 2)
    //   .attr("y", d => y(d.user) - 5)
    //   .attr("text-anchor", "middle")
    //   .attr("fill", "#E5D6C7")
    //   .attr("font-size", "0.75rem")
    //   .text(d => d.user.toFixed(2));

    // g.selectAll(".label-avg")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .attr("x", d => x(d.label) + barWidth * 1.5 + 4)
    //   .attr("y", d => y(d.average) - 5)
    //   .attr("text-anchor", "middle")
    //   .attr("fill", "#E5D6C7")
    //   .attr("opacity", ".5")
    //   .attr("font-size", "0.75rem")
    //   .text(d => d.average.toFixed(2));

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .style("fill", "#E5D6C7")
      .style("font-size", "0.9rem");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", "#E5D6C7")
      .style("font-size", "0.75rem");

  }, [userScores, averageScores]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h3>How Do You Compare?</h3>
      <svg ref={barRef}></svg>
      <p style={{ color: "#999", fontSize: "0.8rem" }}>Your score is brighter, average is darker</p>
    </div>
  );
}
