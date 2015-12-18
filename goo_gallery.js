(function($){
    $.fn.Goo_gallery = function(){
    var container_id = $('.zoom');
    var run_on = $(this);
    
	// gallery
	var recent_processed_id = '';
	var recent_item_id = []; 
	var last_height = 500;
	var last_img_url = '';
	var abs_from_top = '';
	var zoom_hidden = true;
	var disabled_navigation = '';

	function get_data(prev_id, this_id, next_id){
		last_img_url = $(".zoomed_img").attr('src')
		$("#img_holder").css({"background-image": "url("+ last_img_url +")"});


		url = "/?recent=" + this_id;
		$.ajax({
			  "url": url,
			  "cache": true,
			  "dataType": "json"
			})
			.done(function( data ) {
				// 
			   	zoom = $(container_id);
			   	zoomed_img = $(zoom).find(".zoomed_img");
			   	$(zoomed_img).css({"opacity":0});
			   	prev = $(zoom).find(".prev");
			   	next = $(zoom).find(".next");

			   	recent = recent_item_id;
			   	last_inline = get_last_item_in_row('.scaleup');
			   	last = $(last_inline).attr('id');
			   	
		    	if( (last != recent) || ($(run_on).find(container_id).length == 0) ){
		    		zoom_hidden = true;
		    		hide_(container_id);
		    	}
		    	
			    zoom_hidden = $(container_id).hasClass('hide_me');

			    if(zoom_hidden == true){
			    	// will clean old stuff before the new comes
			    	$(zoom).find('#img_holder').css({"background-image":"none"});
					$(zoom).find('img').attr('src', '');

			   		$(zoom).attr("id", "zoomed_" + data.id);
			   		$(zoomed_img).attr("src", data.img);
			   		$(prev).attr("href", prev_id);
			   		$(next).attr("href", next_id);

		    		// move the zoom to its place
		    		$(last_inline).parent('.post').after(zoom);
		    		// just wait a bit for thee image, so that the animation makes sense
		    		setTimeout(function() {
						$(zoom).removeClass('hide_me');
						// $(zoomed_img).animate({opacity: 0}, 0);						
						$(zoomed_img).animate({opacity: 1}, 800);
					}, 300);
					
					
		    	}
		    	// if teh zoom is visible already
		    	else{
		    		// set the new data
					$(zoom).attr("id", "zoomed_" + data.id);
			   		$(zoomed_img).attr("src", data.img);
			   		$(prev).attr("href", prev_id);
			   		$(next).attr("href", next_id);
		    		// setTimeout(function() {
		    		// $(zoomed_img).animate({opacity: 0}, 0);
		    		setTimeout(function() {
						$(zoomed_img).animate({opacity: 1}, 800);
					}, 300);
		    	}

		    	correct_navi(prev);
		    	correct_navi(next);
		    	
	    	// remove loading message
	    	$('#loading').fadeOut('400');
		});

	}
	
	$("body").keydown(function(e){
		    // left arrow
		    if ((e.keyCode || e.which) == 37)
		    {   
		        if(disabled_navigation != 'prev'){
		        	here_and_there("prev");
		        }
		    }
		    // right arrow
		    if ((e.keyCode || e.which) == 39)
		    {
		         if(disabled_navigation != 'next'){
			         here_and_there("next");
			     }
		    }
		});
	// disallow empty navigation links 
	function correct_navi(el){
		if($(el).attr("href") == 0 || $(el).attr("href") == ''){
    		$(el).addClass('dis');
    		disabled_navigation = $(el).attr('rel');
    	}
    	else{
    		$(el).removeClass('dis');
    		disabled_navigation = '';
    	}
	}
	// get all elements with the same position as the one clicked 
    function get_last_item_in_row(elem){
    	var last = $();
    	var same_scope = false; 
		
		$(run_on).find(elem).each(function(index, value){
	   		each_from_top = $(this).offset().top;
	   		if(each_from_top == abs_from_top){
	   			last = $(this);
	   		}
	    });

    	recent_item_id = $(last).attr('id');
	    return last;
	}

	// scaleup images in full archive
    $(run_on).find("a.scaleup").on( "click", function(event) {
    	event.preventDefault();
    	

    	window_top = $(window).scrollTop();
    	// get the Yposition of this element
    	abs_from_top = $(this).offset().top;
    	// count the difference 
    	relative_from_top = ( window_top - abs_from_top);
    	this_height = $(this).height();
    	this_id_raw = $(this).attr('id');
    	this_id = this_id_raw.replace("picture_", "");
    	recent_processed_id = this_id;


    	// get possible prev, next picture ids.. 
    	prev_id_attr = $(this).parents('.post').prevAll('.post:first').find('a').attr('id');
    	prev_id = (typeof prev_id_attr === 'undefined' ? '' : prev_id_attr.replace("picture_", ""));
    	next_id_attr = $(this).parents('.post').nextAll('.post:first').find('a').attr('id');
    	next_id = (typeof next_id_attr === 'undefined' ? '' : next_id_attr.replace("picture_", ""));
    	
    	
    	// show loading icon
	   	show_loading_msg();
	 	
		// GET DATA
  		get_data(prev_id, this_id, next_id);
	  
	});
	// on in zoom navigation click, get and process data
	$("a.scaleup_inside").on("click", function(event) {
		event.preventDefault();
		// find the navigation directio name
		direction = $(this).attr('rel');

		here_and_there(direction);	

	})
	
	function here_and_there(direction){
		

		// find the recent picture and look for prev and next pictures
		// first find the actual element
		recent_el_attr = $(container_id).attr('id');
		recent_id = recent_el_attr.replace("zoomed_", "");

	    // show loading icon
	   	show_loading_msg();
	 	
		// GET DATA
		navi = get_next_prev(direction, recent_id);	
		// GET DATA
  		get_data(navi[0], navi[1], navi[2]);
	}

	function get_next_prev(direction, recent_id){
		// next link
		if(direction == 'prev'){
			// Going backward
			prev_id_attr = $(run_on).find('#picture_'+recent_id).parents('.post').prevAll('.post:first').prevAll('.post:first').find('a').attr('id');
			prev_id = (typeof prev_id_attr === 'undefined' ? '' : prev_id_attr.replace("picture_", ""));
			gofor_id_attr = $(run_on).find('#picture_'+recent_id).parents('.post').prevAll('.post:first').find('a').attr('id');
	    	gofor_id = (typeof gofor_id_attr === 'undefined' ? '' : gofor_id_attr.replace("picture_", ""));
	    	next_id = recent_id;
	    	// console.log(prev_id, next_id)
	    }else{
	    	// Going forwards
			prev_id = recent_id;
			gofor_id_attr = $(run_on).find('#picture_'+recent_id).parents('.post').nextAll('.post:first').find('a').attr('id');
	    	gofor_id = (typeof gofor_id_attr === 'undefined' ? '' : gofor_id_attr.replace("picture_", ""));
	    	next_id_attr = $(run_on).find('#picture_'+recent_id).parents('.post').nextAll('.post:first').nextAll('.post:first').find('a').attr('id');
	    	next_id = (typeof next_id_attr === 'undefined' ? '' : next_id_attr.replace("picture_", ""));
	    }
	    return [prev_id, gofor_id, next_id]
	}


	// });
	// loading message
	function show_loading_msg(){
		// msg = '<div id="loading">Loading ...</div>';
		// $('body').prepend(msg);
		$('#loading').fadeOut(0).fadeIn('200');
	}

	// close archive zoomed view
	$(document).on( "click", '.zoomed_img, .close', function(event) {
		event.preventDefault();
		hide_(container_id);
		// $('.stopper').remove()
	});
	
	function hide_(el){
		$(el).addClass('hide_me');
	}

}	
})(jQuery);
