

// document.getElementById("footer").innerHTML =
// "<p>&copy;  " + new Date().getFullYear() + " All rights reserved.</p>";



 

$(document).ready(function(){
    $("#heatmapview").click(function(){

    	console.log("vao day");
		$('#divsecondchart').hide();
		$("#divheatmapchart").fadeIn(1000);
		$('html, body').animate({scrollTop: $('#hide_the_detail').offset().top}, 3000);       

    });
});
//Hide the detail chart in job type vis
$(document).ready(function(){
    $("#hide_the_detail").click(function(){

    	//console.log("vao day");
		$('#divsecondchart').hide();
		$('#divheatmapchart').hide();
		$('html, body').animate({scrollTop: $('#divmasterhead').offset().top}, 3000);       
		document.getElementById('divhidedetail').style.display = 'none';
    });
});


$(document).ready(function(){
    $("#chartview").click(function(){

    	//console.log("vao day");
		//$('#divsecondchart').hide();
		$('#divheatmapchart').hide();
		$("#divsecondchart").fadeIn(1000);
		$('html, body').animate({scrollTop: $('#hide_the_detail').offset().top}, 3000);       

    });
});