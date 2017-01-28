<?php

class CityController extends BaseController {

	public function getdata(){
		$out=City::with('localities')->get();
		return ")]}',\n".$out;
	}
	public function checkcity(){

		 $data=Input::get('term');

		 $out=City::where('name', 'like', '%'.$data.'%')->first();
		 if($out){
		 return $out['name'];
		}else {

			return "0";
		}
	}
}