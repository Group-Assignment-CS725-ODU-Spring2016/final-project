
			var elt = d3.select("#chart");
			var width = 1200, 
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
				PieChart(male,female,total);
			}
			
			
			function hideHover(el, d) {
				var hoverDiv = d3.selectAll("#hover");
				hoverDiv.style("opacity",1e-6);
				d3.selectAll("#pie").html("");
				PieChart(676197,58130,734327);
			}
			var rangeWidget = d3.elts.startEndSlider().minRange(40);
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
									.margin({top: 40, right: 20, bottom: 60, left: 100});

			redraw = function(sortCol) {
				stockData = _.sortBy(stockData, function(d) { if (sortCol===1) return -d[1]; else return -(-d[0]); });
				myChart.yMax(function(data) {
							var high = d3.max(data, function(d) {return d[1]}); 
							return Math.pow(high*high*yMax,1/3); // scales up small values, but not to the top
						});
						
						
						
						
				elt.datum(stockData).call(myChart);
				//d3.sum(data, function(d) { return d.Male; });
				PieChart(676197,58130,734327);
			
			}
			d3.csv('jobcountdetails.csv', function(data) {
				stockData = _.map(data, function(d) { return [d.JobCodeNumber, d.JobCount/1e6, d.MinimumAge, d.MaximumAge, d.Female, d.Male, d.Total] });
				yMax = d3.max(stockData, function(d) {return d[1]}); 
				redraw(1);
			});
			
				
	function PieChart(male,female,total){
		d3.selectAll("#pie").html("");
		var round = Math.round;
		var malepercent = round((male/total)*100);
        var femalepercent = round((female/total)*100);		
		var width = 1060,
		height = 500,
		radius = Math.min(width, height) / 2;
		
		
		var gender = ["Male: "+male, "Female: "+female];
		//var jobs = [jobid];
		 var w = 300,                        //width
			 h = 300,                            //height
			 r = 100,                            //radius
		color = d3.scale.category10();     //builtin range of colors
	
    data = [{"label":""+" "+malepercent+'%', "value":male}, 
            {"label":""+" "+femalepercent+'%', "value":female}
            ];
    
    var vis = d3.select("#pie")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + 1.5*r + "," + 1.5*r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

		

  
    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		//.transition().duration(500)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
       // arcs.transition().duration(750).attrTween("d",arcTween);
        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
		
			
		arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                 d.outerRadius = r+50;
				d.innerRadius = r+40;
               
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
			.style("fill",function(d, i) { return color(i); })
			.style("font", "bold 12px Arial")
            .text(function(d, i) { return gender[i]; });  
				

        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                         //center the text on it's origin
			.style("font", "bold 12px Arial")
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array

			function arcTween(a) {
			var i = d3.interpolate(this._current, a);
				this._current = i(0);
				return function(t) {
					return arc(i(t));
				};
			}
		}
