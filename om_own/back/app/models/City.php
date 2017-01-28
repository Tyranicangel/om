<?php

class City extends Eloquent {

	protected $table = "city";
	protected $guarded = ["id"];
	public $timestamps = false;

	public function localities()
	{
		return $this->hasMany('Location','city_id');
	}
}