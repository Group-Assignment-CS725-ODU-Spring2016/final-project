
var selected_worker_id = '';

var focusGraph;

var ovmargin = {top: 100, right: 10, bottom: 100, left: 40},
    ovmargin2 = {top: 430, right: 10, bottom: 40, left: 40},
    ovwidth = 960 - ovmargin.left - ovmargin.right,
    ovheight = 500 - ovmargin.top - ovmargin.bottom,
    ovheight2 = 500 - ovmargin2.top - ovmargin2.bottom;


function selected_year_chart(birthyear)
{

d3.select("#overview_worker_id").selectAll("*").remove();


var svg = d3.select("#overview_worker_id").append("svg")
    .attr("width", ovwidth + ovmargin.left + ovmargin.right)
    .attr("height", ovheight + ovmargin.top + ovmargin.bottom);


var ovx = d3.scale.linear().range([0, ovwidth]);

var ovx2 = d3.scale.linear().range([0, ovwidth]);

var ovy = d3.scale.linear().range([ovheight,0]);
var ovy2 = d3.scale.linear().range([ovheight2, 0]);

var ovxAxis = d3.svg.axis().scale(ovx)
  
  .orient("bottom");

var  ovxAxis2 = d3.svg.axis().scale(ovx2)
    .orient("bottom");
  

var ovyAxis = d3.svg.axis().scale(ovy).orient("left");



//define big chart (focus)
var focus = svg.append("g")
    .attr("transform", "translate(" + ovmargin.left + "," + ovmargin.top + ")");

var barsGroup = focus.append("g")
    .attr('clip-path', 'url(#clip)');

//Define small slider (context) 
var context = svg.append("g")
    .attr("transform", "translate(" + ovmargin2.left + "," + ovmargin2.top + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0]);

var brush = d3.svg.brush()
    .x(ovx2)
    .on("brush", brushed);	



svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", ovwidth)
    .attr("height", ovheight);



	
var area2 = d3.svg.area()
    //.interpolate("monotone")
    .x(function(d,i) { return ovx2(i); })
    .y0(ovheight2)
    .y1(function(d) { return ovy2(d.totalhearing); });


var currentSelected;
var currentItem;

 

svg.call(tip);

    //Looping through data
    d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear="+birthyear, function(err, data){
     
      //x,y for focus chart
      //x2,y2 for context chart
      //Define domain for x,y,x2,y2  
      ovx.domain(d3.extent(data.map(function(d,i) { return i; })));

    	var maxy = d3.max(data, function(d) { return +d.totalhearing; });
      var miny = d3.min(data, function(d) { return +d.totalhearing; });

    	ovy.domain([miny, maxy]);

      

    	//x2.domain([x.domain()[0],x.domain()[1]+1]);
      ovx2.domain(ovx.domain());
    	ovy2.domain(ovy.domain()); 

      //console.log(x2.domain());

      //Insert the y Axis
      focus.append("g")
          .attr("class", "y axis")
          .call(ovyAxis);
    	
      //This in the big chart, which is the focus
      focusGraph = barsGroup.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .on("mouseover", function(d,i)
              {
                tip.html("<strong>Worker ID:</strong> <span style='color:red'>" + d.sixplaceid + "</span>");
                  selected_worker_id = d.sixplaceid;
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


                //d3.select("#chartseconddetail").remove();
                draw_chart_detail_worker(d.sixplaceid);
                
              
            })
          .attr("x", function(d,i) { return ovx(i); })
          .attr("width", function(d, i) { return ovwidth/(ovx.domain()[1]-ovx.domain()[0]+1); })
    	    .attr("class", function(d) { return "bar bar--" + (d.totalhearing < 0 ? "negative" : "positive"); })
           .attr("y", function(d) { return ovy(Math.max(0, d.totalhearing)); })
      .attr("height", function(d) { return Math.abs(ovy(d.totalhearing) - ovy(0))});
    	
        //this is the slider, context bar chart
         context.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area2);

      context.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + ovheight2 + ")")
          .call(ovxAxis2);

      context.append("g")
          .attr("class", "x brush")
          .call(brush)
        .selectAll("rect")
          .attr("y", -6)
          .attr("height", ovheight2 + 7);
    		
    	
    });

    function brushed() {
      ovx.domain(brush.empty() ? ovx2.domain() : brush.extent());
      focus.select(".x.axis").call(ovxAxis);
      focusGraph.attr("x", function(d, i) { return ovx(i); });
      focusGraph.attr("width", function(d, i) { return ovwidth/(ovx.domain()[1]-ovx.domain()[0]+1); });
    }
}

 /*dropdown list to select birth year*/

 d3.csv("js/overview/birthyear.csv", function(error, data) {

  //add select to dropdown list to main page
    var select = d3.select("#dropdown_birthyear")
            .append("select");

    select
      .on("change", function(d) {

        var value = d3.select(this).property("value");
        
        selected_year_chart(value);
      });

    select.selectAll("option")
      .data(data)
      .enter()
        .append("option")
        .attr("value", function (d) { return d.birthyear; })
        .text(function (d) { return d.birthyear; });
  });

 
selected_year_chart(1928);