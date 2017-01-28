<?php
$connection = mysql_connect("localhost","root","")
        or die("Could'nt  connect to server");
$db = mysql_select_db("outdoormonk",$connection)
        or die("Couldn't select database");

?>