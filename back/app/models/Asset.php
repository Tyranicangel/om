<?php

class Asset extends Eloquent {

	protected $table = "asset";
	protected $guarded = ["id"];

	public function types()
	{	
		return $this->belongsTo('Type','type_id','id');
	}

	public function localities()
	{	
		return $this->belongsTo('Location','locality_id','id');
	}

	public function slideshow()
	{
		return $this->hasMany('Slides','assetid','id');
	}

	public function booking()
	{
		return $this->hasMany('Bookings','assetid','id');
	}

	public function bookless()
	{
		return $this->hasMany('Bookings','assetid','id');
	}
	public function campasset() 
	{
		return $this->hasMany('campaignassets','assetid','id');
	}
}
