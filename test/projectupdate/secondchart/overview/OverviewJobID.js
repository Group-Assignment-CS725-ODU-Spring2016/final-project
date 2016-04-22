var elt = d3.select("#overviewjobid");
var width = 520, 
	height = 300;
var stockData = null,
	yMax;

function showHover(el, d) {
	var hoverDiv = d3.selectAll("#hover");
	var html = '<div class="key-value"><div class="key"><b>Job Id</b></div><div class="value">'+d[0]+'</div></div>';
	<!--html += '<div class="key-value"><div class="value">'+d[2]+'%</div><div class="key">Weight</div></div>'; -->
	html += '<div class="key-value"><div class="key"><b>Job Count</b></div><div class="value">'+d3.format(".2")(+d[1]*1000000)+'</div></div>';
	html += '<div class="key-value"><div class="key"><b>Age range</b></div><div class="value">'+d[2]+" - "+d[3]+'</div></div>';
	html += '<div class="key-value"><div class="key"><b>Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Female</b></div><div class="value">'+d[5]+"&nbsp;"+d[4]+'</div></div>';
	
	hoverDiv.html(html);
	hoverDiv.style("opacity",1);
}
function hideHover(el, d) {
	var hoverDiv = d3.selectAll("#hover");
	hoverDiv.style("opacity",1e-6);
}
var rangeWidget = d3.elts.startEndSlider().minRange(20);
var milDol = function(v) { return d3.format(".2")(v*1000000)};
var myChart = d3.elts.barChart()
						.width(width)
						.height(height)
						
						.rangeWidget(rangeWidget)
						.yAxis(d3.svg.axis().orient("left").tickSize(6, 0).tickFormat(milDol))
						//.yAxis(d3.svg.axis().orient("left").tickSize(6, 0))
						.xDomain([0, 40])
						
						.xAxisIfBarsWiderThan(19)
						.xAxisAnimate(false)
						.mouseOver(function(el, d) { showHover(el, d) })	
						.mouseOut(function(el, d) { hideHover(el, d) })
						
						.margin({top: 40, right: 20, bottom: 20, left: 60});

redraw = function(sortCol) {
	stockData = _.sortBy(stockData, function(d) { if (sortCol===1) return -d[1]; else return -(-d[0]); });
	myChart.yMax(function(data) {
				var high = d3.max(data, function(d) {return d[1]}); 
				return Math.pow(high*high*yMax,1/3); // scales up small values, but not to the top
			});
			
			
			
			
	elt.datum(stockData).call(myChart);
}





d3.csv('overview/jobcountdetails.csv', function(data) {
	stockData = _.map(data, function(d) { return [d.JobCodeNumber, d.JobCount/1e6, d.MinimumAge, d.MaximumAge, d.Female, d.Male] });
	yMax = d3.max(stockData, function(d) {return d[1]}); 
	redraw(1);
});
