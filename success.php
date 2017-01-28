<?php
include "front/connect.php";

$txnid = $_POST['txnid'];
$row = mysql_fetch_array(mysql_query("SELECT * FROM asset ast, prebooking pre WHERE pre.assetid=ast.id AND pre.txnid='$txnid' "));
$payuFromArrPre = array();
$result_payu = mysql_query("SELECT * FROM payu_credentials");
while($row_payu=mysql_fetch_array($result_payu)) {

	$payuFromArrPre[$row_payu['payu_key']] = $row_payu['payu_value'];
}
	$row_user = mysql_fetch_array(mysql_query("SELECT * FROM users WHERE id='".$row['userid']."' "));
	$explodename = explode(" ", $row_user['username']);
	$firstName = $explodename[0];
	$email = $row_user['email'];

	$productInfo = "[{'name':'bookingadvance','description':'','value':'".$row['advance']."','isRequired':'false'}]";

	$hash_string = $payuFromArrPre['merchant_key']."|".$txnid."|".$row['advance']."|".$productInfo."|".$firstName."|".$email."|||||||||||";
	$hash_string .= $payuFromArrPre['salt'];
	$hash = strtolower(hash('sha512', $hash_string));

	$hash_string2 = $_POST['key']."|".$_POST['txnid']."|".round($_POST['amount'])."|".$_POST['productinfo']."|".$_POST['firstname']."|".$_POST['email']."|||||||||||";
	$hash_string2 .= $payuFromArrPre['salt'];
	$hash2 = strtolower(hash('sha512', $hash_string2));

	if($hash == $hash2) {

		mysql_query("UPDATE prebooking SET pay_flag=1 WHERE txnid='$txnid ' ") or die(mysql_error());

		mysql_query("INSERT INTO booking (assetid, userid, bookstart, bookend, advance, amount) VALUES ('".$row['assetid']."', '".$row['userid']."', '".$row['bookstart']."', '".$row['bookend']."', '".$row['advance']."', '".$row['amount']."') ") or die(mysql_error());

		echo "Success";
	}

?>