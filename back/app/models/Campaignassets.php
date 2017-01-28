<?php

class Campaignassets extends Eloquent {

	protected $table = "campaignassets";
	protected $guarded = ["id"];
	public $timestamps = false;

		public function asset()
		{	
			return $this->hasOne('Asset','id','assetid');
		}
		public function booking()
		{
			return $this->hasMany('Bookings','assetid','assetid');
		}
		public function slideshow()
		{
			return $this->hasMany('Slides','assetid','assetid');
		}

}