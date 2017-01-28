<?php

class Campaigns extends Eloquent {

	protected $table = "campaigns";
	protected $guarded = ["id"];
	public $timestamps = false;

		public function campasset()
		{	
			return $this->hasMany('Campaignassets','campaignid','id');
		}
		public function scopeSerachById($query,$id) {

			$query->where('id','=',$id);
		}
		

}