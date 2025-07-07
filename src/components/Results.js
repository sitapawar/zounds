import * as d3 from "d3";
import { useRef, useEffect } from "react";

export function AveragePieChart({ averages }) {
    const pieRef = useRef();


  useEffect(() => {
    if (!averages) return null;
    const data = [
      { label: "Love", value: averages.love_normalized },
      { label: "Duty", value: averages.duty_normalized },
      { label: "Honor", value: averages.honor_normalized },
      { label: "Reason", value: averages.reason_normalized },
    ];

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(["#e06666", "#6fa8dc", "#ffd966", "#93c47d"]);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label))
      .attr("stroke", "#121116")
      .style("stroke-width", "2px");

    g.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .text(d => `${d.data.label}`)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "0.8rem");
  }, [averages]);

  return <svg ref={pieRef}></svg>;
}
