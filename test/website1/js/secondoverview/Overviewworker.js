var eltworker = d3.select("#overviewworker");
var widthsecondoverview = 650, 
	heightsecondoverview = 300;
var stockData = null,
	yMaxworker;

function showHoverworker(el, d) {
	var hoverDivworker = d3.selectAll("#hover_worker");
	var html = '<div class="key-value"><div class="key"><b>Worker ID</b></div><div class="value">'+d[0]+'</div></div>';
	<!--html += '<div class="key-value"><div class="value">'+d[2]+'%</div><div class="key">Weight</div></div>'; -->
	
	
	hoverDivworker.html(html);
	hoverDivworker.style("opacity",1);
}
function hideHoverworker(el, d) {
	var hoverDivworker = d3.selectAll("#hover_worker");
	hoverDivworker.style("opacity",1e-6);
}
var rangeWidget = d3.elts.startEndSlider().minRange(10);
var milDol = function(v) { return d3.format(".2")(v*1000000)};
var myChart_worker = d3.elts.barChart()
						.width(widthsecondoverview)
						.height(heightsecondoverview)
						
						.rangeWidget(rangeWidget)
						.yAxis(d3.svg.axis().orient("left").tickSize(6, 0).tickFormat(milDol))
						//.yAxis(d3.svg.axis().orient("left").tickSize(6, 0))
						.xDomain([0, 40])
						
						.xAxisIfBarsWiderThan(19)
						.xAxisAnimate(false)
						.mouseOver(function(el, d) { showHoverworker(el, d) })	
						.mouseOut(function(el, d) { hideHoverworker(el, d) })
						
						.margin({top: 40, right: 20, bottom: 50, left: 60});

redrawworker = function(sortCol) {
	stockData = _.sortBy(stockData, function(d) { if (sortCol===1) return -d[1]; else return -(-d[0]); });
	myChart_worker.yMaxworker(function(data) {
				var high = d3.max(data, function(d) {return d[1]}); 
				return Math.pow(high*high*yMaxworker,1/3); // scales up small values, but not to the top
			});
			
	eltworker.datum(stockData).call(myChart_worker);
}



var dispatch = d3.dispatch("load", "statechange");
 

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

console.log("selected year:",selectedyear);
//when loading the data
 d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear=1924", function(err, data) {
		//stockData = null;
		stockData = _.map(data, function(d) { return [d.sixplaceid,d.totalhearing/1e6] });
	yMaxworker = d3.max(stockData, function(d) {return d[1]}); 
  redrawworker(1);
//when changing the birthyear
dispatch.on("statechange.bar", function(d) {
    d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear="+d.birthyear, function(err, data) {
		stockData = null;
		stockData = _.map(data, function(d) { return [d.sixplaceid,d.totalhearing/1e6] });
	yMaxworker = d3.max(stockData, function(d) {return d[1]}); 
	});
		redrawworker(1);
	
  });

});


});
 
