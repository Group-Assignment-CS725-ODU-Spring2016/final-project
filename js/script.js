 
 // footer content 
 $('[id$=footer]').html("&copy;" + new Date().getFullYear() + " All rights reserved.");

$(document).ready(function(){

	
	
	//first visualization
    $("#heatmapview").click(function(){
    	//console.log("vao day");
		$('#divsecondchart').hide();
		$("#divheatmapchart").fadeIn(1000);
		$('html, body').animate({scrollTop: $('#hide_the_detail').offset().top}, 3000);       

    });

    $("#hide_the_detail").click(function(){
    	//console.log("vao day");
		$('#divsecondchart').hide();
		$('#divheatmapchart').hide();
		$('html, body').animate({scrollTop: $('#divmasterhead').offset().top}, 100);       
		document.getElementById('divhidedetail').style.display = 'none';
    });

    //Hide the detail chart in job type vis
    $("#chartview").click(function(){

    	//console.log("vao day");
		//$('#divsecondchart').hide();
		$('#divheatmapchart').hide();
		$("#divsecondchart").fadeIn(1000);
		$('html, body').animate({scrollTop: $('#hide_the_detail').offset().top}, 3000);       
    });

    // end of first visualization

    // second visualization
    $("#hide_the_detail").click(function(){
    	
		$('#chartseconddetail').hide();
		$('#inset').hide();
		$('#slider').hide();
		$('#divhidedetail').hide();
		$('#divseconddetailtitle').hide();
		$('#divlegend').hide();
		
		
		$('html, body').animate({scrollTop: $('#divmasterhead').offset().top}, 100);       
		
		
    });

});

