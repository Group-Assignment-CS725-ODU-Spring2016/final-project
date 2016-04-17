var margin = {top: 50, left: 60, right: 20, bottom: 20},
    width = 620 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svgindividual = d3.select("#chart_worker_detail").append("svg")
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

svgindividual.append("g")
  .attr("class", "x axis")
  .call(xAxis)
  .append("text")
  .attr("x", width/2)
  .attr("y", -35)
  .attr("class", "label")
  .text("Frequency (Hz)");

svgindividual.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height/2)
  .attr("y", -40)
  .attr("class", "label")
  .text("Hearing Level (dB)");

// hearning levels
svgindividual.append("rect")
  .attr("x", 1)
  .attr("y", 1)
  .attr("width", width)
  .attr("height", y(26))
  .attr("fill", "#fff7bc");

svgindividual.append("rect")
  .attr("x", 1)
  .attr("y", y(25))
  .attr("width", width)
  .attr("height", y(40)-y(25))
  .attr("fill", "#fee391");

svgindividual.append("rect")
  .attr("x", 1)
  .attr("y", y(40))
  .attr("width", width)
  .attr("height", y(55)-y(40))
  .attr("fill", "#fec44f");

svgindividual.append("rect")
  .attr("x", 1)
  .attr("y", y(55))
  .attr("width", width)
  .attr("height", y(70)-y(55))
  .attr("fill", "#fe9929");

svgindividual.append("rect")
  .attr("x", 1)
  .attr("y", y(70))
  .attr("width", width)
  .attr("height", y(90)-y(70))
  .attr("fill", "#ec7014");

svgindividual.append("rect")
  .attr("x", 1)
  .attr("y", y(90))
  .attr("width", width)
  .attr("height", y(110)-y(90))
  .attr("fill", "#cc4c02");

var text =svgindividual.append('g').attr("transform", "translate("+ width +",0)");;

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

d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/dataworkerid.php?workerid=000008", function(err, data) {
  // Create step values for slider : array from 0 to data.length()-1
  var stepValues = []
  for(var s=0; s<data.length; s++) {
    stepValues.push(s)
  }
  
  // Create initial graph for 1st element
  createGraph(data[0])
  
  // Record last slider value
  sliderValue = 0

  // Initialize slider
  var slider = d3.slider()
  .min(0)
  .max(data.length - 1)
  .tickValues(stepValues)
  .stepValues(stepValues)
  .showRange(true)
  .tickFormat(function(d) {
    var dateTime = data[d]["AudiogramDate"]
    var arrDateTime = dateTime.split(" ")
    var date = arrDateTime[0]
    return date
  })
  .callback(function(d) {
    // There is a bug in slider, when mouse is dragging but 
    // the button hasn't been moved, the callback function
    // is keep called --> it should not be called until button
    // is moved --> Solution : record last slider value, and 
    // only process when slide value is different with last
    // slider value
    if(sliderValue != d.value()) {
      // Create graph
      createGraph(data[d.value()])
      // record last slider value
      sliderValue = d.value()
    }
  });
  
  // Render the slider in the div
  var slider = d3.select('#slider_worker_detail').call(slider)
  
  function createGraph(data) {
    data = parseData(data)
    
    // Remove existing path and circle first
    svgindividual.selectAll("path").remove()
    svgindividual.selectAll("circle").remove()

    // Add line
    var addLine = function (data, cls) {
      // plot the lines
      var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d, i) { return x(data["x"][i]) })
      .y(function(d) { return y(d) });

      svgindividual.append("path")
        .datum(data["y"])
        .attr("class", cls)
        .attr("d", line);
    };

    addLine(data.left, "left");
    addLine(data.right, "right");

    // tooltip circles
    var addCircle = function (datax, datay, sel, cls, label) {
      svgindividual.selectAll(sel)
        .data(datay)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) { return x(datax[i]) })
        .attr("cy", function (d) { return y(d) })
        .attr("r", 5)
        .attr("class", cls)
        .insert("title", "circle").text(function (d, i) {
        	return label + " Ear: (" + datax[i] + ", " + 
            d + ")";
      });
    }

    addCircle(data.left.x, data.left.y, "circle.left", "left", "Left");
    addCircle(data.right.x, data.right.y, "circle.right", "right", "Right");
    
    // Label slider button
    if(slider !== undefined) slider.select(".draggertext").style("display", "none")
    setTimeout(function() {
      slider.select(".draggertext")
        .text("Age = " + data.age + ", " + "Job = " + data.jobId)
        .style("display", "")
    }, 300)
  }
  
  function parseData(data) {
    var newData = {}
    
    // Calculate data for left and right
    newData["right"] = {}
    newData["left"] = {}
    
    var lx = [], ly = [], rx = [], ry = [];
    var keys = Object.keys(data)
    keys.forEach(function(key) {
      if(key == "R500" || key == "R1000" || key == "R2000" || 
         key == "R3000" || key == "R4000" || key == "R6000") {
        rx.push(key.replace("R", ""))
        ry.push(data[key])
      } else if(key == "L500" || key == "L1000" || key == "L2000" || 
         key == "L3000" || key == "L4000" || key == "L6000") {
        lx.push(key.replace("L", ""))
        ly.push(data[key])
      }
    })
    
    newData["right"]["x"] = rx
    newData["right"]["y"] = ry
    newData["left"]["x"] = lx
    newData["left"]["y"] = ly
    
    // Calculate data for slider button
    birthYear = data["BirthYear"]
    
    audiogramDate = data["AudiogramDate"]
    arrAudiogramDate = audiogramDate.split(" ")
    date = arrAudiogramDate[0]
    arrYMD = date.split("-")
    audiogramYear = arrYMD[0]
    
    age = audiogramYear - birthYear
    newData["age"] = age
    
    // Get job id
    jobId = data["JobCodeNumber"]
    newData["jobId"] = jobId
    
    return newData
  }
})