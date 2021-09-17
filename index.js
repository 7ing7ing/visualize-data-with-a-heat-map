const width = 1100;
const height = 500;
const padding = 70;

const svg = d3
  .select("div")
  .append("svg")
  .attr("height", height)
  .attr("width", width);

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();
req.onload = function () {
  const dataset = JSON.parse(req.responseText);

  const baseTemp = 8.66;

  const monthlyVariance = dataset.monthlyVariance.map((elem) => {
    return elem;
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = dataset.monthlyVariance.map((elem) => {
    return elem.month;
  });

  function getMonthName(months) {
    return monthNames[months - 1]; //monthNames es un array con los meses
  }

  const years = dataset.monthlyVariance.map((elem) => {
    return new Date(elem.year, 1, 1);
  });

  const yScale = d3
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .range([0, height - 2 * padding]);

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(function (d) {
      //d es cada uno de los ticks que ya tenía (del 1 al 12).
      return getMonthName(d);
    });

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis)
    .attr("id", "y-axis");

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeYear.every(10));

  const tooltip = d3.select("div").append("div").attr("id", "tooltip");

  svg
    .append("g")
    .attr("transform", "translate(0, " + (height - 2 * padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  svg.append("g").attr("id", "legend");

  const legendTemp = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];
  const legendData = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6];

  const xLegend = d3
    .scaleLinear()
    .domain([d3.min(legendTemp), d3.max(legendTemp)])
    .range([padding, 5 * padding]);

  const legendAxis = d3
    .axisBottom()
    .scale(xLegend)
    .tickValues(legendTemp)
    .tickFormat(d3.format(".1f")); //1f es para que salga un decimal (2f saldrían dos decimales)

  svg
    .select("#legend")
    .append("g")
    .call(legendAxis)
    .attr("transform", "translate(0," + (height - padding) + ")");

  svg
    .select("#legend")
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xLegend(legendTemp[i]))
    .attr("y", 0)
    .attr("width", 31)
    .attr("height", 31)
    .attr("transform", "translate(0," + (height - padding - 31) + ")")
    .attr("fill", (d) => {
      if (d === 2.8) {
        return "rgb(69 117 180)";
      } else if (d === 3.9) {
        return "rgb(116 173 209)";
      } else if (d === 5) {
        return "rgb(171 217 233)";
      } else if (d === 6.1) {
        return "rgb(224 243 248)";
      } else if (d === 7.2) {
        return "rgb(255 255 191)";
      } else if (d === 8.3) {
        return "rgb(254 224 144)";
      } else if (d === 9.4) {
        return "rgb(253 174 97)";
      } else if (d === 10.5) {
        return "rgb(244 109 67)";
      } else if (d === 11.6) {
        return "rgb(215 48 39)";
      }
    });

  svg
    .selectAll("rect") //está seleccionando los 9 rectángulos creados para la leyenda
    .filter(function () {
      //filtra los rectángulos para que los que tengan de padre el id "#legend" no se seleccionen
      //de lo contrario, el índice empieza en 9 (y tiene que empezar en 0)
      return this.parentNode.id !== "legend";
    })
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(years[i]))
    .attr("y", (d) => yScale(d.month))
    .attr("width", "5")
    .attr("height", "30")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .attr("fill", (d) => {
      const variance = d.variance;
      const temp = baseTemp + variance;
      if (temp >= 2.8 && temp < 3.9) {
        return "rgb(69 117 180)";
      } else if (temp >= 3.9 && temp < 5.0) {
        return "rgb(116 173 209)";
      } else if (temp >= 5.0 && temp < 6.1) {
        return "rgb(171 217 233)";
      } else if (temp >= 6.1 && temp < 7.2) {
        return "rgb(224 243 248)";
      } else if (temp >= 7.2 && temp < 8.3) {
        return "rgb(255 255 191)";
      } else if (temp >= 8.3 && temp < 9.5) {
        return "rgb(254 224 144)";
      } else if (temp >= 9.5 && temp < 10.6) {
        return "rgb(253 174 97)";
      } else if (temp >= 10.6 && temp < 11.7) {
        return "rgb(244 109 67)";
      } else if (temp >= 11.7 && temp <= 12.8) {
        return "rgb(215 48 39)";
      }
    })
    .on("mouseover", function (evt, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(
        d.year +
          " - " +
          getMonthName(d.month) +
          "<br>" +
          Math.round((baseTemp + d.variance) * 10) / 10 +
          "℃" +
          "<br>" +
          d.variance.toFixed(1) +
          "℃"
      );
      tooltip.style("position", "absolute");
      tooltip.style("left", evt.pageX + 20 + "px");
      tooltip.style("top", evt.pageY + "px");
      tooltip.attr("data-year", d.year);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(400).style("opacity", 0);
    });
};
