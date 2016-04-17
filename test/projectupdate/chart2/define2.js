

  var svg = d3.select("#chart2").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // axis
  var x = d3.scale.pow().exponent(0.000000000001)
  .domain([500, 8000])
  .range([0, width]);

  var y = d3.scale.linear()
  .domain([110, -10])
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .tickValues([500, 1000, 2000, 4000, 8000])
  .orient("top");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .append("text")
    .attr("x", width/2)
    .attr("y", -35)
    .attr("class", "label")
    .text("Frequency (Hz)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height/2))
    .attr("y", -40)
    .attr("class", "label")
    .text("Hearing Level (dB)");

  // hearning levels
  svg.append("rect")
    .attr("x", 1)
    .attr("y", 1)
    .attr("width", width)
    .attr("height", y(26))
    .attr("fill", function(d){return color[0];});

  svg.append("rect")
    .attr("x", 1)
    .attr("y", y(25))
    .attr("width", width)
    .attr("height", y(40)-y(25))
         .attr("fill", function(d){return color[1];});

  svg.append("rect")
    .attr("x", 1)
    .attr("y", y(40))
    .attr("width", width)
    .attr("height", y(55)-y(40))
         .attr("fill", function(d){return color[2];});

  svg.append("rect")
    .attr("x", 1)
    .attr("y", y(55))
    .attr("width", width)
    .attr("height", y(70)-y(55))
 .attr("fill", function(d){return color[3];});
	//
  svg.append("rect")
    .attr("x", 1)
    .attr("y", y(70))
    .attr("width", width)
    .attr("height", y(90)-y(70))
         .attr("fill", function(d){return color[4];});
//
  svg.append("rect")
    .attr("x", 1)
    .attr("y", y(90))
    .attr("width", width)
    .attr("height", y(110)-y(90))
 .attr("fill", function(d){return color[5];});

  var text =svg.append('g').attr("transform", "translate("+ width +",0)");;

  text.append('text').text('Normal')
    .attr('y', y(24))
    .attr('text-anchor', 'end');

  text.append('text').text('Mild')
    .attr('y', y(39))
    .attr('text-anchor', 'end');

  text.append('text').text('Moderate')
    .attr('y', y(54))
    .attr('text-anchor', 'end');

  text.append('text').text('Moderate Severe')
    .attr('y', y(69))
    .attr('text-anchor', 'end');

  text.append('text').text('Severe')
    .attr('y', y(89))
    .attr('text-anchor', 'end');

  text.append('text').text('Profound')
    .attr('y', y(109))
    .attr('text-anchor', 'end');