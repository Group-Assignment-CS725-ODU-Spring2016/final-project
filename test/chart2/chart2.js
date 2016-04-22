//	var color = ['#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'];
var color = ['#E3F2FD','#BBDEFB','#90CAF9','#64B5F6','#42A5F5','#2196F3','#993404','#662506'];

	
      var margin = {top: 50, left: 120, right: 20, bottom: 20},
          width = 920 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

	var numberofdatatokeep = 10;
	var historydata = {};





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

function draw_chart2(jobid,minage,maxage)
{
	
	console.log(jobid,minage,maxage);

	//	console.log("http://www.cs.odu.edu/~hdo/InfoVis/navy/datajobage.php?jobid="+jobid + "&minage="+minage +"&maxage=" +maxage);
	
	d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/datajobage.php?jobid="+jobid + "&minage="+minage +"&maxage=" +maxage, function(err, data) {
		
	//	console.log(data);

  // Create step values for slider : array from 0 to data.length()-1
  var stepValues = []
  for(var s=0; s<data.length; s++) {
    stepValues.push(s)
  }
  
  // Create initial graph for 1st element
  createGraph(data[0])
  
  // Record last slider value
  sliderValue = 0
 
  
  
  function createGraph(data) {
    data = parseData(data)
    
    // Remove existing path and circle first
	svg.selectAll("path")
		.attr("stroke-width", 2)
		.attr('opacity', function(d,i){ return 0.2;})
		// svg.selectAll("circle").remove()

    // Add line
    var addLine = function (data, cls) {
      
	 //  //save history data
		// for (var i=1;i<=numberofdatatokeep;i++)
		// {
		// 	if (historydata[i] === undefined) {
		// 	}
		// 	else
		// 	{
		// 		historydata[i-1] = historydata[i];
		// 		//console.log(i-1,historydata[i-1]);
		// 	}
		// }
		
		// historydata[numberofdatatokeep-1] = data;
	 
	  
	  // plot the lines
		
    var line = d3.svg.line()
		//.interpolate("cardinal")
		.x(function(d, i) { return x(data["x"][i]) })
		.y(function(d) { return y(d) });

    var lineGraph =  svg.append("path")
		.datum(data["y"])
		.attr("class", cls)
		.attr('opacity', 1)
		.attr("stroke-width", 3)
		.attr("d", line);
		
	var totalLength = lineGraph.node().getTotalLength();

	lineGraph
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(1000)
		.ease("linear")
		.attr("stroke-dashoffset", 0);

    };

    addLine(data.left, "left");
    addLine(data.right, "right");

  }
  
  function parseData(data) {
    //data = JSON.parse(JSON.stringify(data));
    var newData = {}
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
    
    return newData
  }
})


}