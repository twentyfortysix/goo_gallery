<?php

// add custom url variable
add_filter('init', 'picture_recent');
function picture_recent() {
    global $wp;
    $wp->add_query_var('recent');
}
