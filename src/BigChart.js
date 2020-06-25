import React, { useRef, useEffect } from "react";

import { scaleLinear, scaleOrdinal } from "d3-scale";
import { max, extent } from "d3-array";
import { select } from "d3-selection";
import { nest } from "d3-collection";
import { axisBottom, axisLeft } from "d3-axis";
import { line } from "d3";

import { data } from "./data";
// const data = require("./data").data;
// const data = [5, 10, 1, 3];

const size = [500, 500];
const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const BigChart = props => {
  const theNode = useRef();

  const setNode = n => {
    theNode.current = n;
  };

  const createBarChart = () => {
    const sumstat = nest()
      .key(d => d.name)
      .entries(data);

    const node = theNode.current;

    select(node)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var x = scaleLinear()
      .domain(extent(data, d => d.year))
      .range([0, width]);

    select(node)
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(axisBottom(x).ticks(5));

    var y = scaleLinear()
      .domain([
        0,
        max(data, function(d) {
          return +d.n;
        })
      ])
      .range([height, 0]);
    select(node)
      .append("g")
      .call(axisLeft(y));

    // color palette
    var res = sumstat.map(function(d) {
      return d.key;
    }); // list of group names
    var color = scaleOrdinal()
      .domain(res)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999"
      ]);

    select(node)
      .selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d) {
        return color(d.key);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function(d) {
        return line()
          .x(function(d) {
            return x(d.year);
          })
          .y(function(d) {
            return y(+d.n);
          })(d.values);
      });

    // const dataMax = max(data);
    // const yScale = scaleLinear()
    //   .domain([0, dataMax])
    //   .range([0, size[1]]);
    // select(node)
    //   .selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect");
    // select(node)
    //   .selectAll("rect")
    //   .data(data)
    //   .exit()
    //   .remove();
    // select(node)
    //   .selectAll("rect")
    //   .data(data)
    //   .style("fill", "#abc")
    //   .attr("x", (d, i) => i * 60)
    //   .attr("y", d => size[1] - yScale(d))
    //   .attr("height", d => yScale(d))
    //   .attr("width", 40);
  };

  useEffect(() => {
    createBarChart();
  }, []);

  return (
    <div>
      <svg ref={n => setNode(n)} width={500} height={500} />
    </div>
  );
};

export default BigChart;
