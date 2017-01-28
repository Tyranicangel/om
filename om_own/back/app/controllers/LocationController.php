<?php

class LocationController extends BaseController {

	protected $location;

	public function __construct(Location $location)
	{
		$this->location=$location;
	}

	public function getdata(){
		return $this->location->all();
	}
}