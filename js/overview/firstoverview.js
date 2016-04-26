

var focusGraph;
var currentSelected;
        var currentItem;
var maxy,miny;

var jobid = 1; //default jobid = 1
var minage =16;
var maxage = 90;

var ovmargin = {top: 10, right: 10, bottom: 100, left: 60},
    ovmargin2 = {top: 430, right: 10, bottom: 40, left: 40},
    ovwidth = 960 - ovmargin.left - ovmargin.right,
    ovheight = 500 - ovmargin.top - ovmargin.bottom,
    ovheight2 = 500 - ovmargin2.top - ovmargin2.bottom;

function load_first_overview(filename)
  {
        //remove the old content
        d3.select("#overview_job_id").selectAll("*").remove();

        var ovx = d3.scale.linear().range([0, ovwidth]);

        var ovx2 = d3.scale.linear().range([0, ovwidth]);

        var ovy = d3.scale.linear().range([ovheight,0]);
        var ovy2 = d3.scale.linear().range([ovheight2, 0]);

        var ovxAxis = d3.svg.axis().scale(ovx)
        	
        	.orient("bottom");

        var  ovxAxis2 = d3.svg.axis().scale(ovx2)
            .orient("bottom");
        	
        var ovyAxis = d3.svg.axis().scale(ovy).orient("left");

        var brush = d3.svg.brush()
            .x(ovx2)
            .on("brush", brushed);	

        var area2 = d3.svg.area()
            //.interpolate("monotone")
            .x(function(d,i) { return ovx2(i); })
            .y0(ovheight2)
            .y1(function(d) { return ovy2(d.JobCount); });

        var svg = d3.select("#overview_job_id").append("svg")
            .attr("width", ovwidth + ovmargin.left + ovmargin.right)
            .attr("height", ovheight + ovmargin.top + ovmargin.bottom);



          svg.append("g")
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -(ovheight/2))
          .attr("y", 10)
          .attr("class", "label")
          .text("Number of Workers");
		  
		  svg.append("g")
          .append("text")
          .attr("transform", "translate(0," + (ovheight+40) + ")")
          .attr("x", 500)
          .attr("y", 0)
          .attr("class", "label")
          .text("Job Id");
		  

         var zoom = d3.behavior.zoom()
            .x(ovx)
            .y(ovy)
            .scaleExtent([1, 50])
            .on("zoom", zoomed);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", ovwidth)
            .attr("height", ovheight)
            
			
					var tworkers = d3.selectAll("#totalworkers");
					tworkers.html("734327");
					var minAge = d3.selectAll("#minage");
					minAge.html("16");
					var maxAge = d3.selectAll("#maxage");
					maxAge.html("87");
        //define big chart (focus)
        var focus = svg.append("g")
            .attr("transform", "translate(" + ovmargin.left + "," + ovmargin.top + ")");
           

        var barsGroup = focus.append("g")
            .attr('clip-path', 'url(#clip)');

         var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0]);
         
        svg.call(tip);

        //Define small slider (context)	
        var context = svg.append("g")
            .attr("transform", "translate(" + ovmargin2.left + "," + ovmargin2.top + ")");
        	

        //Looping through data
        //d3.json("http://www.cs.odu.edu/~hdo/InfoVis/navy/databybirthyear.php?birthyear=1928", function(err, data){
         d3.csv(filename, function(err, data){
         
          //x,y for focus chart
          //x2,y2 for context chart
          //Define domain for x,y,x2,y2  
          ovx.domain(d3.extent(data.map(function(d,i) { return i; })));

        	maxy = d3.max(data, function(d) { return +d.JobCount; });
          miny = d3.min(data, function(d) { return +d.JobCount; });

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
                    PieChart(d.Male,d.Total-d.Male,d.Total,"#piechart");
					d3.selectAll("#jobsummary").style("visibility","visible");
					var jobId = d3.selectAll("#JobId");
					jobId.html(" Job Id: "+d.JobCodeNumber);
					var tworkers = d3.selectAll("#totalworkers");
					tworkers.html(d.Total);
					var minAge = d3.selectAll("#minage");
					minAge.html(d.MinimumAge);
					var maxAge = d3.selectAll("#maxage");
					maxAge.html(d.MaximumAge);
                    var tiphtml = "<strong>Job Code:</strong> <span style='color:red'>" + d.JobCodeNumber + "</span>";
                  //  tiphtml = tiphtml + "<br><strong>Total Workers:</strong> <span style='color:red'>" + d.Total + "</span>";
                    tip.html(tiphtml);
                    tip.show();

                    //Title for first piechart
                    var viewinfo = d3.selectAll("#Overviewpiechart_title");
                    viewinfo.html("Gender in job code ("+d.JobCodeNumber+") "); 

                    d3.select(this).style("fill", "brown");
                  })
                .on("mouseout", function(d,i)
                  {
                    //clear bar chart
					d3.selectAll("#JobId").html(" all jobs");
					var tworkers = d3.selectAll("#totalworkers");
					tworkers.html("734327");
					var minAge = d3.selectAll("#minage");
					minAge.html("16");
					var maxAge = d3.selectAll("#maxage");
					maxAge.html("87");

                    d3.selectAll("#piechart").html("");

                    PieChart(676197,58130,676197+58130,"#piechart");
                    
                    tip.hide();
                   // console.log(i);

                    if (currentSelected )
                    {
                      if (currentItem != i)
                      {
                        if (d.JobCount<0)
                          d3.select(this).style("fill", "orange");
                        else
                          d3.select(this).style("fill", "steelblue");
                      }
                      else
                      d3.select(this).style("fill", "magenta");  
                    }
                    else
                    {
                       if (d.JobCount<0)
                          d3.select(this).style("fill", "orange");
                        else
                          d3.select(this).style("fill", "steelblue");
                    }
                    
                  })
                .on('click',  function(d,i)
                { 
				
					d3.selectAll("#jobsummary").style("visibility","visible");
					var jobId = d3.selectAll("#JobId");
					jobId.html(d.JobCodeNumber);
					var tworkers = d3.selectAll("#totalworkers");
					tworkers.html(d.Total);
					var minAge = d3.selectAll("#minage");
					minAge.html(d.MinimumAge);
					var maxAge = d3.selectAll("#maxage");
					maxAge.html(d.MaximumAge);

                    jobid = d.JobCodeNumber;

                    draw_heatmap(jobid);
                    
                    //When user click only show heatmap and hide button                   
                    $("#divheatmapchart").fadeIn(1000);
                    $("#divhidedetail").fadeIn(1000);
                    $("#divsecondchart").hide();
                    
                    
                  $('html, body').animate({scrollTop: $("#heatmapchart").offset().top}, 3000);
                  
                  //focus to divsecondchart
                  //$('html, body').animate({scrollTop: $("#divsecondchart").offset().top}, 100);

                  //focus to the heatmap div
                    if (currentSelected)
                    {
                      if (currentD.JobCount<0)
                      d3.select(currentSelected).style("fill", "orange");
                      else
                        d3.select(currentSelected).style("fill", "steelblue");
                      
                    }

                    d3.select(this).style("fill", "magenta");

                    currentItem = i;
                    currentD = d;
                    currentSelected = this;

                    // //print info
                     var viewinfo = d3.selectAll("#dis_job_id");
                     viewinfo.html(d.JobCodeNumber);
                    // d3.selectAll("#info").html = "aaa";

                    PieChart(d.Male,d.Total-d.Male,d.Total,"#piechartdetail");
                    
                    
                  
                })
              .attr("x", function(d,i) { return ovx(i); })
              .attr("width", function(d, i) { return ovwidth/(ovx.domain()[1]-ovx.domain()[0]); })
        	    .attr("class", function(d) { return "bar bar--" + (d.JobCount < 0 ? "negative" : "positive"); })
               .attr("y", function(d) { return ovy(Math.max(0, d.JobCount)); })
          .attr("height", function(d) { return Math.abs(ovy(d.JobCount) - ovy(0))})
          .call(zoom);
        	 

          //  svg.         
          // append("rect")
          //   .attr("width", ovwidth + ovmargin.left + ovmargin.right)
          //   .attr("height", ovheight + ovmargin.top + ovmargin.bottom)
          //   .style("opacity", 0.1)


          //   .call(zoom);

            //this is the slider, context bar chart
             context.append("path")
              .datum(data)
              .attr("class", "area")
              .attr("transform", "translate(20,0)")
              .attr("d", area2);

          context.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(20," + (ovheight2) + ")")
              .call(ovxAxis2);

          context.append("g")
              .attr("class", "x brush")
              .call(brush)
            .selectAll("rect")
              .attr("y", -6)
              .attr("transform", "translate(20,0)")
              .attr("height", ovheight2 + 7);

        });

        function zoomed() {
                
              // console.log(ovy.domain()[1]);
              // console.log(maxy*ovy.domain()[1]);


              ovy.domain([0,maxy*ovy.domain()[1]]);

                svg.select(".y.axis").call(ovyAxis);
               //focusGraph.attr("transform", "scale(1," + d3.event.scale + ")");
               focusGraph.attr("transform", "scale(" + d3.event.scale + ",1)");
               //focusGraph.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            } 

        function brushed() {
          ovx.domain(brush.empty() ? ovx2.domain() : brush.extent());

          //focus.select(".x.axis").call(ovxAxis);
          focusGraph.attr("x", function(d, i) { return ovx(i); });
          focusGraph.attr("width", function(d, i) { return width/(ovx.domain()[1]-ovx.domain()[0]+1); });
        }
}



d3.select("#by_number_worker").on("click", reload_worker);
d3.select("#by_job_id").on("click", reload_jobid);

function reload_worker()
{
  var filetoload = "js/overview/jobcountdetails_by_number_of_worker.csv";
  load_first_overview (filetoload);
}

function reload_jobid()
{
  var filetoload = "js/overview/jobcountdetails_by_id.csv";
  load_first_overview (filetoload);
}

load_first_overview ("js/overview/jobcountdetails_by_number_of_worker.csv");

