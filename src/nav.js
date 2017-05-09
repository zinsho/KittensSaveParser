$(document).ready(function() {
    $("#navToggle a").click(function(e){
        e.preventDefault();
         
        $("header > nav").slideToggle();
        $("#title").toggleClass("menuUp menuDown");
    });
     
    $(window).resize(function() {
        if($( window ).width() >= "600") {
            $("header > nav").css("display", "block");
             
            if($("#title").attr('class') == "menuDown") {
                $("#title").toggleClass("menuUp menuDown");
            }
        }
        else {
            $("header > nav").css("display", "none");
        }
    });
     
    $("header > nav > ul > li > a").click(function(e) {
        if($( window ).width() <= "600") { if($(this).siblings().size() > 0 ) {
                e.preventDefault();
                $(this).siblings().slideToggle("fast")
                $(this).children(".toggle").html($(this).children(".toggle").html() == 'close' ? 'expand' : 'close');
            }
        }
    });

    
});