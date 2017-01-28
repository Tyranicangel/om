<?php

class MarkerController extends BaseController {

	public function getdata(){
		$city=Input::get('city');
		$citydata=City::where('name','=',$city)->first();
		$markerdata=Asset::where('city_id','=',$citydata['id'])->with('types')->with('localities')->get();
		return ")]}',\n".$markerdata;
	}

	public function update_origin(){
		$data=Input::all();
		$marker=Asset::where('id','=',$data['id'])->first();
		$marker->orginal_price=$data['price'];
		$marker->save();
	}

	public function update_my(){
		$data=Input::all();
		$marker=Asset::where('id','=',$data['id'])->first();
		$marker->my_price=$data['price'];
		$marker->save();
	}
}