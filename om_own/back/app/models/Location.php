<?php

class Location extends Eloquent {

	protected $table = "location";
	protected $guarded = ["id"];
	public $timestamps = false;
}