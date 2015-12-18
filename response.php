<?php
// WP query
$recent = intval(get_query_var('recent'));

if(!empty($recent) && is_int($recent)){
	$att_image = wp_get_attachment_image_src($recent , "large");
	$arr = array(
		'id' => $recent,
		'img' => $att_image[0],
	);
	echo json_encode($arr);
}
