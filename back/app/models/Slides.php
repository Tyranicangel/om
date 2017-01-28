<?php

class Slides extends Eloquent {

	protected $table = "asset_slideshow";
	protected $guarded = ["id"];
	public $timestamps = false;
}