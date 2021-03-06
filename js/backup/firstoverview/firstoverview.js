

var focusGraph;

var margin = {top: 100, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var x = d3.scale.linear().range([0, width]);

var x2 = d3.scale.linear().range([0, width]);

var y = d3.scale.linear().range([height,0]);
var y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x)
	
	.orient("bottom");

var  xAxis2 = d3.svg.axis().scale(x2)
    .orient("bottom");
	

var yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);	

var svg = d3.select("#overview_job_id").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

//define big chart (focus)
var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var barsGroup = focus.append("g")
    .attr('clip-path', 'url(#clip)');


//Define small slider (context)	
var context = svg.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
	

var area2 = d3.svg.area()
    //.interpolate("monotone")
    .x(function(d,i) { return x2(i); })
    .y0(height2)
    .y1(function(d) { return y2(d.totalhearing); });


var currentSelected;
var currentItem;



var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0]);
 

svg.call(tip);

//Looping through data
d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear=1928", function(err, data){
 
  //x,y for focus chart
  //x2,y2 for context chart
  //Define domain for x,y,x2,y2  

  
  
  x.domain(d3.extent(data.map(function(d,i) { return i; })));

	var maxy = d3.max(data, function(d) { return +d.totalhearing; });
  var miny = d3.min(data, function(d) { return +d.totalhearing; });

	y.domain([miny, maxy]);

  

	//x2.domain([x.domain()[0],x.domain()[1]+1]);
  x2.domain(x.domain());
	y2.domain(y.domain()); 

  //console.log(x2.domain());

  //Insert the y Axis
  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);
	
  //This in the big chart, which is the focus
  focusGraph = barsGroup.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .on("mouseover", function(d,i)
          {
            tip.html("<strong>Worker ID:</strong> <span style='color:red'>" + d.sixplaceid + "</span>");
  
               tip.show();

              d3.select(this).style("fill", "brown");
          })
        .on("mouseout", function(d,i)
          {

            
          
            tip.hide();
           // console.log(i);

            if (currentSelected )
            {
              if (currentItem != i)
              {
                if (d.totalhearing<0)
                  d3.select(this).style("fill", "orange");
                else
                  d3.select(this).style("fill", "steelblue");
              }
              else
              d3.select(this).style("fill", "magenta");  
            }
            else
            {
               if (d.totalhearing<0)
                  d3.select(this).style("fill", "orange");
                else
                  d3.select(this).style("fill", "steelblue");
            }
            
          })
        .on('click',  function(d,i)
        { 

           

            if (currentSelected)
            {
              if (currentD.totalhearing<0)
              d3.select(currentSelected).style("fill", "orange");
              else
                d3.select(currentSelected).style("fill", "steelblue");
              
            }

            d3.select(this).style("fill", "magenta");

            currentItem = i;
            currentD = d;
            currentSelected = this;

            //print info
            var viewinfo = d3.selectAll("#info");
            viewinfo.html(d.sixplaceid);
            d3.selectAll("#info").html = "aaa";
            
          
        })
      .attr("x", function(d,i) { return x(i); })
      .attr("width", function(d, i) { return width/(x.domain()[1]-x.domain()[0]+1); })
	    .attr("class", function(d) { return "bar bar--" + (d.totalhearing < 0 ? "negative" : "positive"); })
       .attr("y", function(d) { return y(Math.max(0, d.totalhearing)); })
  .attr("height", function(d) { return Math.abs(y(d.totalhearing) - y(0))});
	
    //this is the slider, context bar chart
     context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
		
	
});

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".x.axis").call(xAxis);
  focusGraph.attr("x", function(d, i) { return x(i); });
  focusGraph.attr("width", function(d, i) { return width/(x.domain()[1]-x.domain()[0]+1); });
}

