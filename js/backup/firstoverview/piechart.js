function PieChart(male,female,total){
		d3.selectAll("#piechart").html("");
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