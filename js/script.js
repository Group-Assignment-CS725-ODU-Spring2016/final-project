

document.getElementById("footer").innerHTML =
"<p>&copy;  " + new Date().getFullYear() + " All rights reserved.</p>";

 $(document).ready(function(){
    $("hide_the_detail").click(function(){
        
        
                    $("#divsecondchart").hide();
    });
});