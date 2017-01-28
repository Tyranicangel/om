<?php
class AdminController extends BaseController {


	public function registeruser() {

	    $data=Input::all();
		$date = new DateTime;
		$refresh=md5(microtime());
		if($data)
		{
			$user=Users::where('username','=',$data['username'])->get();
			if($user->count() == 0) {
				$nuser=array(
					'password'=>md5($data['password']),
					'username'=>$data['username'],
					'email'=>$data['email'],
					'token'=>$refresh,
					'phone_number'=>$data['phoneno']
					);
				$us=Users::create($nuser);
				$out="1";
			} else {

				$out = "2";
			}
			
			
		}
		else
		{
			$out="0";
		}
		return $out;
	}

	public function loginuser() {

	    $data=Input::all();


		if($data)
		{
			$user=Users::where('username','=',$data['loginname'])->where('password', '=', md5($data['loginpass']))->with('bookedasset')->with('bookedcamp')->get();
			if($user->count() != 0) {
				
				return $user;
			} else {

				return "2";
			}
			
		}
		else
		{
			return "0";
		}
	}

	public function change_user_pass() {

	    $data=Input::all();

	   	$token = Request::header('X-CSRFToken');

	    $md5pass = md5($data['currentpass']);

	    $newpass = md5($data['newpass']);

		if($data)
		{
			$user=Users::where('token','=',$token)->where('password','=',$md5pass)->first();
			if($user) {
				
				$user->password = $newpass;
				$user->save();

				return "1";
			} else {

				return "2";
			}
			
		}
		else
		{
			return "0";
		}
	}

	public function getuser() {

	    $token = Request::header('X-CSRFToken');

		$user=Users::where('token','=',$token)->with('bookedasset')->with('bookedcamp')->get();
		return $user;
			
	}

	public function book_ad() {

	    $assetid = Input::get('assetid');
	    $ourprice = Input::get('ourprice');
	    $advance = Input::get('advance');
	    $userid = Input::get('userid');
	    $bookstart = Input::get('bookstart');
	    $bookend = Input::get('bookend');
	    $txnid=md5(microtime());

	    $nbooking=array(
			'assetid'=>$assetid,
			'userid'=>$userid,
			'amount'=>$ourprice,
			'advance'=>$advance,
			'bookstart'=>$bookstart,
			'bookend'=>$bookend,
			'txnid'=>$txnid
			);
		$booking=Prebooking::create($nbooking);

		return $booking->id;
			
	}

	public function get_campdetails() {

		$campid = Input::get('campid');

		$campaign=Campaigns::serachById($campid)->with('campasset')->with('campasset.asset')->get();
		return $campaign;
	}

	public function get_allcampdetails() {

		$userid = Input::get('userid');

		$campaign=Campaigns::where('userid', '=', $userid)->with('campasset')->with('campasset.asset')->get();
		return $campaign;
	}

	public function insert_campasset() {

		$assetid = Input::get('assetid');
		$bookend = Input::get('tilldate');
		$bookstart = Input::get('fromdate');
		$campid = Input::get('campid');

		$nbookingasset=array(
			'assetid'=>$assetid,
			'campaignid'=>$campid,
			'bookstart'=>$bookstart,
			'bookend'=>$bookend
			);
		$bookingasset=Campaignassets::create($nbookingasset);

		return $bookingasset->id;
	}

	public function remove_campasset() {

		$assetid = Input::get('assetid');

		$campasset = Campaignassets::where('id','=',$assetid)->delete();
	}

	public function create_campaign() {

		$campname = Input::get('campname');
		$frombooking = Input::get('frombooking');
		$tillbooking = Input::get('tillbooking');
		$userid = Input::get('userid');
		$txnid=md5(microtime());

		$ncampaigns = array(
			'campaignname'=>$campname,
			'startdate'=>$frombooking,
			'enddate'=>$tillbooking,
			'userid'=>$userid,
			'txnid'=>$txnid
			);

		$campaign = Campaigns::create($ncampaigns);

		return $campaign->id;
	}

	public function delcampasset() {

		$campassetid = Input::get('campassetid');

		$updatecampasset = Campaignassets::find($campassetid)->delete();
		
		return $campassetid;
	}

	public function editcampname() {

		$campid=Input::get('campid');
		$campname=Input::get('campnewname');
		$camp = Campaigns::find($campid);
		if($camp) {

			$camp->campaignname = $campname;
			$camp->save();
			return $campname;
		}
	}

}