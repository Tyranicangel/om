<?php
include "front/connect.php";

function get_discount($dis,$price)
{
	$d=intval($dis);
	$p=intval($price);
	$out=($p/100)*($d);
	return $out;
}
function get_displayprice($dis,$price)
{
	$d=intval($dis);
	$p=intval($price);
	$out=($p/100)*(100-$d);
	return $out;
}

function get_campaigntotalcost($txnid) {

	$totaladvance = 0;
	$totalcost = 0;
	$costArr = array();

	$row_id = mysql_fetch_array(mysql_query("SELECT * FROM campaigns WHERE txnid='$txnid' "));
	$result_cost = mysql_query("SELECT * FROM campaignassets casset, asset ast WHERE ast.id=casset.assetid AND casset.campaignid='".$row_id['id']."' ");
	while($row_cost=mysql_fetch_array($result_cost)) {

		$totaladvance = $totaladvance+get_discount($row_cost['advance_percent'],$row_cost['orginal_price']);

		$totalcost = $totalcost+get_displayprice($row_cost['discount_percent'],$row_cost['orginal_price']);
	}

	$costArr['totaladvance'] = $totaladvance;
	$costArr['totalcost'] = $totalcost;

	return $costArr;
}

$txnid = $_POST['txnid'];
$costarr = get_campaigntotalcost($txnid);
$row = mysql_fetch_array(mysql_query("SELECT * FROM campaigns WHERE txnid='$txnid' "));
$payuFromArrPre = array();
$result_payu = mysql_query("SELECT * FROM payu_credentials");
while($row_payu=mysql_fetch_array($result_payu)) {

	$payuFromArrPre[$row_payu['payu_key']] = $row_payu['payu_value'];
}
	$row_user = mysql_fetch_array(mysql_query("SELECT * FROM users WHERE id='".$row['userid']."' "));
	$explodename = explode(" ", $row_user['username']);
	$firstName = $explodename[0];
	$email = $row_user['email'];

	$productInfo = "[{'name':'bookingadvance','description':'','value':'".$costarr['totaladvance']."','isRequired':'false'}]";

	$hash_string = $payuFromArrPre['merchant_key']."|".$txnid."|".$costarr['totaladvance']."|".$productInfo."|".$firstName."|".$email."|||||||||||";
	$hash_string .= $payuFromArrPre['salt'];
	$hash = strtolower(hash('sha512', $hash_string));

	$hash_string2 = $_POST['key']."|".$_POST['txnid']."|".round($_POST['amount'])."|".$_POST['productinfo']."|".$_POST['firstname']."|".$_POST['email']."|||||||||||";
	$hash_string2 .= $payuFromArrPre['salt'];
	$hash2 = strtolower(hash('sha512', $hash_string2));

	if($hash == $hash2) {

		mysql_query("UPDATE campaigns SET book_flag=1 WHERE txnid='$txnid' ") or die(mysql_error());

		$result_asset = mysql_query("SELECT * FROM campaignassets casset, asset ast WHERE casset.assetid=ast.id AND casset.campaignid='".$row['id']."' ");
		while($row_asset = mysql_fetch_array($result_asset)) {

			$thisadvance = get_discount($row_asset['advance_percent'], $row_asset['orginal_price']);
			$thisamount = get_discount($row_asset['discount_percent'], $row_asset['orginal_price']);

			mysql_query("INSERT INTO booking (assetid, userid, bookstart, bookend, advance, amount) VALUES ('".$row_asset['assetid']."', '".$row['userid']."', '".$row_asset['bookstart']."', '".$row_asset['bookend']."', '".$thisadvance."', '".$thisamount."') ") or die(mysql_error());
		}
		
		echo "Success";
	}

?>