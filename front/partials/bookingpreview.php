<?php

include "../connect.php";

$id = $_GET['id'];

$row = mysql_fetch_array(mysql_query("SELECT * FROM asset ast, prebooking pre WHERE pre.assetid=ast.id AND pre.id='$id' "));
	
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
	$advancetobepaid = get_discount($row['discount_percent'],$row['orginal_price']);
	$payuFromArrPre = array();
	$result_payu = mysql_query("SELECT * FROM payu_credentials");
	while($row_payu=mysql_fetch_array($result_payu)) {

		$payuFromArrPre[$row_payu['payu_key']] = $row_payu['payu_value'];
	}

	$surl = "http://localhost/outdoormonk/success.php";
	$furl = "http://localhost/outdoormonk/failure.php";

	$row_user = mysql_fetch_array(mysql_query("SELECT * FROM users WHERE id='".$row['userid']."' "));
	$explodename = explode(" ", $row_user['username']);
	$firstName = $explodename[0];
	$email = $row_user['email'];
	$phoneno = $row_user['phone_number'];

	$action = $payuFromArrPre['payu_base_url'];

	$productInfo = "[{'name':'bookingadvance','description':'','value':'".$row['advance']."','isRequired':'false'}]";

	$hash_string = $payuFromArrPre['merchant_key']."|".$row['txnid']."|".$row['advance']."|".$productInfo."|".$firstName."|".$email."|||||||||||";
	$hash_string .= $payuFromArrPre['salt'];
	$hash = strtolower(hash('sha512', $hash_string));

	$payuFormArr["MERCHANTKEY"] = $payuFromArrPre['merchant_key'];
	$payuFormArr["HASH"] = $hash;
	$payuFormArr["TXNID"] = $row['txnid'];
	$payuFormArr["AMOUNT"] = $row['advance'];
	$payuFormArr["NAME"] = $firstName;
	$payuFormArr["EMAIL"] = $email;
	$payuFormArr["PHONE"] = $phoneno;
	$payuFormArr["PRODUCTINFO"] = $productInfo;
	$payuFormArr["SURL"] = $surl;
	$payuFormArr["FURL"] = $furl;
	$payuFormArr["SERVICEPROVIDER"] = $payuFromArrPre['service_provider'];
	$payuFormArr["ACTION"] = $action;

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Outdoor Monk | Book Ad</title>
	<link rel="stylesheet" type="text/css" href="../styles/style_home.css">
	<link rel="stylesheet" type="text/css" href="../styles/mycss.css">
	<script type="text/javascript" src="../scripts/jquery.js"></script>
</head>
<body>
	<div class="bookbox" style="width:600px;margin:0 auto;background:#ccc;color:#000;">
		<h3 style="text-align:center;">Book This Ad</h3>

		<div class="hoarding_details" style="width:initial;">
			<div class="details_indi">
				<div class="details_bullet"></div>
				<div class="details_text">Hoarding size (w x h):<?php echo $row['size']; ?></div>
			</div>
			<div class="details_indi">
				<div class="details_bullet"></div>
				<div class="details_text">Minimum booking period: 1 month</div>
			</div>
			<div class="details_indi">
				<div class="details_bullet"></div>
				<div class="details_text">Lit: <?php echo $row['lit']; ?></div>
			</div>
			<div class="details_indi">
				<div class="details_bullet"></div>
				<div class="details_text">Location: <?php echo $row['location']; ?></div>
			</div>
			<div class="details_indi">
				<div class="details_bullet"></div>
				<div class="details_text">Visiblity:<?php echo $row['visibility']; ?></div>
			</div>
			<div class="footfall_div" style="width:initial;">Footfall:<?php echo $row['footfall']; ?></div>
		</div>
		<div class="hording_data" style="float:none;width:425px;margin:auto;">
			
		<div class="price_div" style="width:450px;border:1px dashed #8a8a8a;">
		
			<div class="original_price">
				<div class="price_text">Original Price:</div>
				<div class='org_price_data'>1 month @ Rs <?php echo $row['size']; ?>/month</div>
			</div>
			<div class="our_price">
				<div class="price_text">Our Price:</div>
				<div class="price_select_div">
					<div class="price_select">1 month @ Rs <?php echo get_displayprice($row['discount_percent'],$row['orginal_price']); ?>/month</div>
					<div class="select_icon_div">
						<img src="../images/select_icon.png">
					</div>
				</div>
			</div>
			<div class="saving_div">You save Rs <?php echo get_discount($row['discount_percent'],$row['orginal_price']); ?>/-</div>
			<div class="instal_cost">Installation Cost: Rs <?php echo $row['installation']; ?>/-</div>
			<div class="advance_cost">Advance(<?php echo $row['advance_percent']; ?>% of total cost): Rs <?php echo get_discount($row['discount_percent'],$row['orginal_price']); ?>/-</div>
		</div>
	</div>
</div>
<div style="clear:both;height:15px;"></div>
	<div class="bookingdates" style="">
		You are booking this Ad From : <input type='text' value="<?php echo $row['bookstart']; ?>" readonly /> &nbsp; &nbsp; To: <input type='text' value="<?php echo $row['bookend']; ?>" readonly /> <br>
		Amount to be paid now: Rs.<?php echo get_discount($row['discount_percent'],$row['orginal_price']); ?> (Advance) <br>
	</div>



	<div class="adbooking_div">
		<?php if($advancetobepaid == 0){?>

			<a href="/outdoormonk/success.php?id=<?php echo $id; ?>"><button class="booking_buttons">Book</button></a>
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

		        <button type="submit" class="booking_buttons" >Pay Advance</button>
		    </form>
		<?php } ?>
		
	</div>

	

</body>
</html>