function switchLanguage(lang) {
  document.querySelectorAll('[data-en]').forEach(function(element) {
      element.textContent = element.getAttribute(`data-${lang}`);
  });
}

document.getElementById('dropdownMenuButton').addEventListener('click', function() {
  var dropdownMenu = this.nextElementSibling;
  dropdownMenu.classList.toggle('show');
});

function openPopup() {
  // Open the modal
  $('#jlptModal').modal('show');

  // Render the D3.js chart
  renderChart();
}

function renderChart() {
  // Clear any existing SVG (to avoid duplicating the chart on multiple clicks)
  d3.select("#chart").selectAll("*").remove();

  // Sample JLPT scores data
  const data = [
      {
          level: 'N5',
          label: 'N5',
          passingScore: 80,
          scores: [
              { date: new Date('2019-12-01'), totalScore: 76, details: { Vocabulary_Grammar_Reading: 54, Listening: 22}}
          ]
      },
      {
          level: 'N4',
          label: 'N4',
          passingScore: 90,
          scores: [
              { date: new Date('2020-07-05'), totalScore: 0, details: { Vocabulary_Grammar_Reading: 0, Listening: 0 }},
              { date: new Date('2020-12-06'), totalScore: 72, details: { Vocabulary_Grammar_Reading: 46, Listening: 26 }},
              { date: new Date('2021-07-01'), totalScore: 83, details: { Vocabulary_Grammar_Reading: 51, Listening: 32 }},
              { date: new Date('2022-07-03'), totalScore: 90, details: { Vocabulary_Grammar_Reading: 59, Listening: 31 }}
          ]
      },
      {
          level: 'N3',
          label: 'N3',
          passingScore: 95,
          scores: [
              { date: new Date('2022-12-04'), totalScore: 85, details: { Vocabulary_Grammar_Reading: 25, Reading: 28, Listening: 32 }},
              { date: new Date('2023-12-03'), totalScore: 77, details: { Vocabulary_Grammar_Reading: 26, Reading: 22, Listening: 29 }}
          ]
      },
      {
          level: 'N2',
          label: 'N2',
          passingScore: 90,
          scores: [
              { date: new Date('2026-07-01'), totalScore: 0, details: { Vocabulary_Grammar_Reading: 25, Reading: 25, Listening: 20 }}
          ]
      },
      {
          level: 'N1',
          label: 'N1',
          passingScore: 100,
          scores: [
              { date: new Date('2027-01-01'), totalScore: 0, details: { Vocabulary_Grammar_Reading: 25, Reading: 25, Listening: 20 }}
          ]
      }
  ];

  const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime()
      .domain([new Date('2019-01-01'), new Date('2027-01-01')])
      .range([0, width]);

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
      .domain([0, 120])
      .range([height, 0]);

  svg.append("g")
      .call(d3.axisLeft(y));

  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  data.forEach(levelData => {
      const line = d3.line()
          .x(d => x(d.date))
          .y(d => y(d.totalScore));

      svg.append("path")
          .datum(levelData.scores)
          .attr("fill", "none")
          .attr("stroke", color(levelData.level))
          .attr("stroke-width", 2)
          .attr("class", "line")
          .attr("d", line);

      svg.selectAll(`circle-${levelData.level}`)
          .data(levelData.scores)
          .enter()
          .append("circle")
          .attr("cx", d => x(d.date))
          .attr("cy", d => y(d.totalScore))
          .attr("r", 5)
          .attr("fill", d => d.totalScore >= levelData.passingScore ? "green" : "red")
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("class", "point")
          .on("mouseover", (event, d) => {
              tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
              tooltip.html(`日付: ${d.date.getFullYear()}<br>総得点: ${d.totalScore}<br>合格点: ${levelData.passingScore}<br>語彙・文法・読解: ${d.details.Vocabulary_Grammar_Reading}<br>読解: ${d.details.Reading}<br>聴解: ${d.details.Listening}`)
                  .style("left", (event.pageX + 5) + "px")
                  .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", () => {
              tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
          });

      svg.selectAll(`text-${levelData.level}`)
          .data(levelData.scores)
          .enter()
          .append("text")
          .attr("x", d => x(d.date))
          .attr("y", d => y(d.totalScore) - 10)
          .attr("text-anchor", "middle")
          .attr("fill", "black")
          .text(levelData.label);
  });
}

// Function to check if the device is mobile
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// Function to adjust the chart size
function adjustChartForMobile() {
  const chartContainer = document.getElementById('chart');
  const svg = chartContainer.querySelector('svg');

  if (isMobileDevice()) {
    // Adjust modal size
    document.querySelector('.modal-dialog').style.maxWidth = '90%';
    document.querySelector('.modal-dialog').style.margin = '15x auto';

    // Adjust chart size
    chartContainer.style.margin = '0';
    chartContainer.style.width = '100%';

    // Adjust SVG size
    svg.style.width = 'auto';
    svg.style.height = 'auto';

    // Adjust modal body padding
    document.querySelector('.modal-body').style.padding = '10px';
  }
}

// Run the function on page load and resize
window.addEventListener('load', adjustChartForMobile);
window.addEventListener('resize', adjustChartForMobile);
