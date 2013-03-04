<?php echo doctype('html5'); ?>
<html>
  <head>
<?php
$meta = array(
        //array('name' => 'robots', 'content' => 'no-cache'),
        array('name' => 'description', 'content' => 'A new debating platform'),
        array('name' => 'keywords', 'content' => 'debates, discussion'),
        array('name' => 'Content-type', 'content' => 'text/html; charset=utf-8', 'type' => 'equiv')
    );
echo meta($meta);
?>

<title><?php echo $name; ?> | Konfrap</title>
<?php

echo link_tag('/assets/css/bootstrap.min.css');
echo link_tag('/assets/css/style.css');
echo link_tag('/assets/css/jquery.tagit.css');
echo link_tag('/assets/css/tagit.ui-zendesk.css');
echo link_tag('/assets/ico/favicon.ico', 'shortcut icon', 'image/ico');