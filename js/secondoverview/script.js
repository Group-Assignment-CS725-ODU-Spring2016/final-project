
			var elt = d3.select("#chart");
			var width = 900, 
				height = 400;
			var stockData = null,
				yMax;
			function showHover(el, d) {
				var hoverDiv = d3.selectAll("#hover");
				var html = '<div class="key-value"><div class="key"><b>Job Id</b></div><div class="value">'+d[0]+'</div></div>';
				<!--html += '<div class="key-value"><div class="value">'+d[2]+'%</div><div class="key">Weight</div></div>'; -->
				html += '<div class="key-value"><div class="key"><b>Job Count</b></div><div class="value">'+d3.format(".2")(+d[1]*1000000)+'</div></div>';
				html += '<div class="key-value"><div class="key"><b>Age range</b></div><div class="value">'+d[2]+" - "+d[3]+'</div></div>';
		
				hoverDiv.html(html);
				hoverDiv.style("opacity",1);
				var male = d[5];
				//var jobid = d[0];
				var female = d[4];
				var total = d[6];
				//PieChart(male,female,total);
			}
			
			
			function hideHover(el, d) {
				var hoverDiv = d3.selectAll("#hover");
				hoverDiv.style("opacity",1e-6);
				d3.selectAll("#pie").html("");
			//	PieChart(676197,58130,734327);
			}
			var rangeWidget = d3.elts.startEndSlider().minRange(40);
			var milDol = function(v) { return d3.format(".2")(v*1000000)};
			var myChart = d3.elts.barChart()
									.width(width)
									.height(height)
									
									.rangeWidget(rangeWidget)
									.yAxis(d3.svg.axis().orient("left").tickSize(6, 0).tickFormat(milDol))
									//.yAxis(d3.svg.axis().orient("left").tickSize(6, 0))
									.xDomain([0, 10])
									
									.xAxisIfBarsWiderThan(19)
									.xAxisAnimate(false)
									.mouseOver(function(el, d) { showHover(el, d) })	
									.mouseOut(function(el, d) { hideHover(el, d) })
									.margin({top: 40, right: 20, bottom: 60, left: 100});

			redraw = function(sortCol) {
				stockData = _.sortBy(stockData, function(d) { if (sortCol===1) return -d[1]; else return -(-d[0]); });
				myChart.yMax(function(data) {
							var high = d3.max(data, function(d) {return d[1]}); 
							return Math.pow(high*high*yMax,1/3); // scales up small values, but not to the top
						});
						
						
						
						
				elt.datum(stockData).call(myChart);
				//d3.sum(data, function(d) { return d.Male; });
				//PieChart(676197,58130,734327);
			
			}
			d3.csv('jobcountdetails.csv', function(data) {
				stockData = _.map(data, function(d) { return [d.JobCodeNumber, d.JobCount/1e6, d.MinimumAge, d.MaximumAge, d.Female, d.Male, d.Total] });
				yMax = d3.max(stockData, function(d) {return d[1]}); 
				redraw(1);
			});
			
			
	
				
	var dispatch = d3.dispatch("load", "statechange");
	var totalworker =0;
d3.csv("js/secondoverview/birthyear.csv", function(error, birthyears) {
  if (error) throw error;
  var selectedyear = d3.map();
  birthyears.forEach(function(d) { selectedyear.set(d.birthyear, d); });
  dispatch.load(selectedyear);
  dispatch.statechange(selectedyear.get("1924"));
});


// A drop-down menu for selecting a birthyear; uses the "menu" namespace.
dispatch.on("load.menu", function(selectedyear) {
  var select = d3.select("#dropdown_birthyear")
      
    .append("select")
      .on("change", function() { dispatch.statechange(selectedyear.get(this.value)); });

  select.selectAll("option")
      .data(selectedyear.values())
    .enter().append("option")
      .attr("value", function(d) { return d.birthyear; })
      .text(function(d) { return d.birthyear; });

  dispatch.on("statechange.menu", function(state) {
    select.property("value", state.birthyear);
  });
});

// A bar chart to show total population; uses the "bar" namespace.
dispatch.on("load.bar", function(selectedyear) {



//when loading the data
 d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear=1924", function(err, data) {
		
 		totalworker = 0;	
	data.forEach(function(d) {
		console.log(d);
    	totalworker++;
  	});
		console.log(totalworker);
		
		stockData = _.map(data, function(d) { return [d.sixplaceid,d.totalhearing/1e6] });
	yMaxworker = d3.max(stockData, function(d) {return d[1]}); 
	console.log(stockData);
  redraw(1);
//when changing the birthyear
dispatch.on("statechange.bar", function(d) {
	
    d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear="+d.birthyear, function(err, data) {
    
    //count number of workers
    totalworker = 0;	
	data.forEach(function(d) {
    	totalworker++;
  	});
		console.log(totalworker);

		stockData = null;
		stockData = _.map(data, function(d) { return [d.sixplaceid,d.totalhearing/1e6] });
	yMaxworker = d3.max(stockData, function(d) {return d[1]}); 
	});
		redraw(1);

	
  });

});


});
