<?php

class MarkerController extends BaseController {

	public function getdata(){
		$city=Input::get('city');
		$fdate=new DateTime();
		$citydata=City::where('name','=',$city)->first();
		$markerdata=Asset::where('city_id','=',$citydata['id'])
			->with('types')
			->with('localities')
			->with('slideshow')
			->with(array('booking' => function($query) use ($fdate){
				$query->where('bookend','>',$fdate)->orderby('bookstart');
			}))
			->get();
		return ")]}',\n".$markerdata;
	}

	public function getthismarker(){
		$city=Input::get('city');
		$campid = Input::get('campid');
		$fdate=new DateTime();
		$citydata=City::where('name','=',$city)->first();
		$markerdata=Campaigns::where('id','=',$campid)
			->with('campasset.asset.slideshow')->with('campasset.asset.booking')->with('campasset.asset.types')->with('campasset.asset.localities')->with('campasset.asset.campasset')
			->get();
		return ")]}',\n".$markerdata;
	}
}