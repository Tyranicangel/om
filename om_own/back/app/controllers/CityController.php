<?php

class CityController extends BaseController {

	public function getdata(){
		$out=City::with('localities')->get();
		return ")]}',\n".$out;
	}
}