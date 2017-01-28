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
}