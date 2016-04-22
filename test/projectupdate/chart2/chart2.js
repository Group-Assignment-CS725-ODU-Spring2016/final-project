
function draw_chart2(jobid,minage,maxage)
{
	
	//console.log(jobid,minage,maxage);

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
      
	  //save history data
		for (var i=1;i<=numberofdatatokeep;i++)
		{
			if (historydata[i] === undefined) {
			}
			else
			{
				historydata[i-1] = historydata[i];
				console.log(i-1,historydata[i-1]);
			}
		}
		
		historydata[numberofdatatokeep-1] = data;
	 
	  
	  // plot the lines
		
    var line = d3.svg.line()
		.interpolate("cardinal")
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