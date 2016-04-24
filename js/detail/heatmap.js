

function draw_heatmap(jobid)
{

d3.select("#heatmapchart").selectAll("*").remove();

var heatmapdata = [];

d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/dataagehearingbyjobid.php?jobid=" + jobid, function(err, data) {
        

//height of each row in the heatmap
//width of each column in the heatmap
var gridSize = 5,
    h = 4,
    w = 4;
//    rectPadding = 60;

var colorLow = 'green', colorMed = 'yellow', colorHigh = 'red';

var margin = {top: 20, right: 80, bottom: 50, left: 160},
    hmwidth = 1200 - margin.left - margin.right,
    hmheight = 560 - margin.top - margin.bottom;

var hmy = d3.scale.linear().range([hmheight, 0]);
var hmx = d3.scale.linear().range([ -100,hmwidth]);


var maxy = d3.max(data, function(d) { return +d.age; });
var miny = d3.min(data, function(d) { return +d.age; });
var maxx = d3.max(data, function(d) { return +d.th; });
var minx = d3.min(data, function(d) { return +d.th; });


            //ovy.domain([miny, maxy]);


hmy.domain([miny,maxy]);
hmx.domain([minx,maxx])

var colorScale = d3.scale.linear()
     .domain([1,40])
     .range(["#deebf7","#ff7f00"]);

var hmsvg = d3.select("#heatmapchart").append("svg")
    .attr("width", hmwidth + margin.left + margin.right)
    .attr("height", hmheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0]);

hmsvg.call(tip);



// Add a x-axis with label.
  hmsvg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(hmx).orient("bottom").ticks(10))
      .attr("transform", "translate(0," + (hmheight+10) + ")")
      .append("text")

      .attr("y", -6)
      .attr("x", hmwidth)
      .attr("class", "label")
     .attr("text-anchor", "end")
      .text("Total Hearing");

 // Add a y-axis with label.
  hmsvg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-100,10)")
      .call(d3.svg.axis().scale(hmy).orient("left"))
    .append("text")
      .attr("class", "label")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("Age");

var heatMap = hmsvg.selectAll(".heatmap")
    .data(data, function(d) { return d.age + ':' + d.th; })
    .enter().append("svg:rect")
    .attr("x", function(d) { return hmx(d.th) ; })
    .attr("y", function(d) { return hmy(d.age); })
    .attr("width", function(d) { return w; })
    .attr("height", function(d) { return h; })
    .style("fill", function(d) { return colorScale(d.numberofworkers); });

    heatMap
    .on("mouseover", function(d,i)
                  {
                    //console.log (d);
                     var tiphtml = "<strong>Number of Workers:</strong> <span style='color:red'>" + d.numberofworkers + "</span>";
                     tiphtml =tiphtml + "<br><strong>Total Hearing:</strong> <span style='color:red'>" + d.th + "</span>";
                      tiphtml =tiphtml + "<br><strong>Age:</strong> <span style='color:red'>" + d.age + "</span>";

                 
                    tip.html(tiphtml);
          
                       tip.show();
                })
    .on("mouseout",function(d,i)
            {
                tip.hide();
            }
        )


})

}