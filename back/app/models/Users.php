<?php

class Users extends Eloquent {

	protected $table = "users";
	protected $guarded = ["id"];
	public $timestamps = false;

		public function bookedasset()
		{	
			return $this->hasMany('Bookings','userid','id');
		}
		public function bookedcamp()
		{	
			return $this->hasMany('Campaigns','userid','id');
		}
		

}