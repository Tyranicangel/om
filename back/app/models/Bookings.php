<?php

class Bookings extends Eloquent {

	protected $table = "booking";
	protected $guarded = ["id"];
	public $timestamps = false;

}