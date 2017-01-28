<?php

include "../connect.php";
$requesturl = "http://localhost/outdoormonk/back/public/";
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

function get_campaigntotalcost($campid) {

	$totaladvance = 0;
	$totalcost = 0;
	$costArr = array();

	$result_cost = mysql_query("SELECT * FROM campaignassets casset, asset ast WHERE ast.id=casset.assetid AND casset.campaignid='$campid' ");
	while($row_cost=mysql_fetch_array($result_cost)) {

		$totaladvance = $totaladvance+get_discount($row_cost['advance_percent'],$row_cost['orginal_price']);

		$totalcost = $totalcost+get_displayprice($row_cost['discount_percent'],$row_cost['orginal_price']);
	}

	$costArr['totaladvance'] = $totaladvance;
	$costArr['totalcost'] = $totalcost;

	return $costArr;
}

 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Outdoor Monk | Book Campaign</title>
	<link rel="stylesheet" type="text/css" href="../styles/style_home.css">
	<link rel="stylesheet" type="text/css" href="../styles/mycss.css">
	<script type="text/javascript" src="../scripts/jquery.js"></script>
</head>
<body>
<?php 
$campid = $_GET['campid'];

$costarr = get_campaigntotalcost($campid);

$row_maincamp = mysql_fetch_array(mysql_query("SELECT * FROM campaigns WHERE id='$campid'"));

$result_camp = mysql_query("SELECT * FROM campaignassets WHERE campaignid='$campid'") or die(mysql_error());

 ?>

	<div class="campdetails" style="width:750px;margin:0 auto;">
		<h3 style="text-align:center;">Campaign Details</h3>
		<div class="campmaindetails">

			<span><strong>Campaign Name:</strong> <?php echo $row_maincamp['campaignname']; ?> </span>
			<span><strong>Campaign start date:</strong> <?php echo $row_maincamp['startdate']; ?> </span>
			<span><strong>Campaign end date:</strong> <?php echo $row_maincamp['enddate']; ?></span><br>
			<span><strong>Total advance to be paid:</strong> Rs. <?php echo $costarr['totaladvance']; ?></span>
			<span><strong>Total campaign amount:</strong> Rs. <?php echo $costarr['totalcost']; ?></span>
		</div>

		<div class="innerindibox" style="border: 1px solid #CCC;width: 700px;margin: 0 auto;padding: 10px;margin-bottom: 10px;overflow:hidden;height:initial;">

		<?php while($row_camp = mysql_fetch_array($result_camp)) { 

			$result_asset = mysql_fetch_array(mysql_query("SELECT * FROM asset WHERE id='".$row_camp['assetid']."' ")); 

			?>
			<div class="indidetails">

				<div class="innerindi">
					<img src="<?php echo $requesturl.'uploads/'.$result_asset['image']; ?>" style="width:75px;float:left;margin-right:10px;" />
					<div class="indiinfobox" style="width:86%;">
						
						<span><strong>Location:</strong> <?php echo $result_asset['location']; ?></span>
						<span><strong>Size:</strong> <?php echo $result_asset['size']; ?></span>
						<span><strong>Visibility:</strong> <?php echo $result_asset['visibility']; ?></span>
						<span><strong>Footfall:</strong> <?php echo $result_asset['footfall']; ?></span>
						<span><strong>Lit:</strong> <?php echo $result_asset['lit']; ?></span><br>
						<span><strong>Advance:</strong> Rs. <?php echo get_discount($result_asset['advance_percent'],$result_asset['orginal_price']); ?></span>
						<span><strong>Total amount:</strong> Rs. <?php echo get_displayprice($result_asset['discount_percent'], $result_asset['orginal_price']); ?></span><br>

						<span><strong>Booked From:</strong> <?php echo $row_camp['bookstart']; ?> <strong>To:</strong> <?php echo $row_camp['bookend']; ?></span>
					</div>
				</div>
				
			</div>
		
		<?php } ?>
		</div>
	
	</div>


<?php
	
	$payuFromArrPre = array();
	$result_payu = mysql_query("SELECT * FROM payu_credentials");
	while($row_payu=mysql_fetch_array($result_payu)) {

		$payuFromArrPre[$row_payu['payu_key']] = $row_payu['payu_value'];
	}

	$surl = "http://localhost/outdoormonk/campsuccess.php";
	$furl = "http://localhost/outdoormonk/campfailure.php";

	$row_user = mysql_fetch_array(mysql_query("SELECT * FROM users WHERE id='".$row_maincamp['userid']."' "));
	$explodename = explode(" ", $row_user['username']);
	$firstName = $explodename[0];
	$email = $row_user['email'];
	$phoneno = $row_user['phone_number'];

	$action = $payuFromArrPre['payu_base_url'];

	$productInfo = "[{'name':'bookingadvance','description':'','value':'".$costarr['totaladvance']."','isRequired':'false'}]";

	$hash_string = $payuFromArrPre['merchant_key']."|".$row_maincamp['txnid']."|".$costarr['totaladvance']."|".$productInfo."|".$firstName."|".$email."|||||||||||";
	$hash_string .= $payuFromArrPre['salt'];
	$hash = strtolower(hash('sha512', $hash_string));

	$payuFormArr["MERCHANTKEY"] = $payuFromArrPre['merchant_key'];
	$payuFormArr["HASH"] = $hash;
	$payuFormArr["TXNID"] = $row_maincamp['txnid'];
	$payuFormArr["AMOUNT"] = $costarr['totaladvance'];
	$payuFormArr["NAME"] = $firstName;
	$payuFormArr["EMAIL"] = $email;
	$payuFormArr["PHONE"] = $phoneno;
	$payuFormArr["PRODUCTINFO"] = $productInfo;
	$payuFormArr["SURL"] = $surl;
	$payuFormArr["FURL"] = $furl;
	$payuFormArr["SERVICEPROVIDER"] = $payuFromArrPre['service_provider'];
	$payuFormArr["ACTION"] = $action;

?>

		<?php if($costarr['totaladvance'] == 0){?>

			<a href="/outdoormonk/campsuccess.php?id=<?php echo $campid; ?>"><button class="booking_buttons">Book</button></a>
		<?php } else { ?>

			<form method="post" action="<?php echo $payuFormArr['ACTION']; ?>">
		        <input type="hidden" name="key" value="<?php echo $payuFormArr['MERCHANTKEY']; ?>" />
			    <input type="hidden" name="hash" value="<?php echo $payuFormArr['HASH']; ?>"/>
			    <input type="hidden" name="txnid" value="<?php echo $payuFormArr['TXNID']; ?>" />
			    <input type="hidden" name="amount" value="<?php echo $payuFormArr['AMOUNT']; ?>" />
			    <input type="hidden" name="firstname" value="<?php echo $payuFormArr['NAME']; ?>" />
			    <input type="hidden" name="email" value="<?php echo $payuFormArr['EMAIL']; ?>" />
			    <input type="hidden" name="phone" value="<?php echo $payuFormArr['PHONE']; ?>" />
			    <input type="hidden" name="productinfo" value="<?php echo $payuFormArr['PRODUCTINFO']; ?>" />
			    <input type="hidden" name="surl" value="<?php echo $payuFormArr['SURL']; ?>" />
			    <input type="hidden" name="furl" value="<?php echo $payuFormArr['FURL']; ?>" /></td>
			    <input type="hidden" name="service_provider" value="<?php echo $payuFormArr['SERVICEPROVIDER']; ?>" />
				<div class="butnbox" style="text-align:center;">
		        	<button type="submit" class="booking_buttons" style="width:150px;float:none;">Pay Advance</button>
		        </div>
		    </form>
		<?php } ?>
		
	</div>

	

</body>
</html>