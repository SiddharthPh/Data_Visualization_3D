import define1 from "./a33468b95d0b15b0@703.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["temperature.csv",new URL("./files/9a14470ba5e0af46cf088ab46c9668850837be8d09b914f2a50977cc2a8d110a695b1337825641fa0d75242d88f803b75805eee2ef2e7878fc74a1cb1ce4b606",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Gradient Encoding

This variation of a [line chart](/@d3/line-chart) uses a gradient to change the line color based on its *y*-value. For a related technique along the *x*-axis, see [variable-color line](/@d3/variable-color-line).`
)});
  main.variable(observer()).define(["legend","color","data"], function(legend,color,data){return(
legend({color, title: data.title === undefined ? data.y : data.title})
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","DOM","xAxis","yAxis","margin","color","data","line"], function(d3,width,height,DOM,xAxis,yAxis,margin,color,data,line)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width
                        , height]);

  const gradient = DOM.uid();
  
  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("linearGradient")
      .attr("id", gradient.id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height - margin.bottom)
      .attr("x2", 0)
      .attr("y2", margin.top)
    .selectAll("stop")
      .data(d3.ticks(0, 1, 10))
    .join("stop")
      .attr("offset", d => d)
      .attr("stop-color", color.interpolator());

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", gradient)
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

  return svg.node();
}
);
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.value)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("color")).define("color", ["d3","y"], function(d3,y){return(
d3.scaleSequential(y.domain(), d3.interpolateTurbo)
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").append("tspan").text(data.y))
)});
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .curve(d3.curveStep)
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value))
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
Object.assign(d3.csvParse(await FileAttachment("temperature.csv").text(), d3.autoType).map(({date, temperature}) => ({date, value: temperature})), {title: "Temperature °F", y: " °F"})
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
