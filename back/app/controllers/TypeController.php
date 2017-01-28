<?php

class TypeController extends BaseController {

	protected $type;

	public function __construct(Type $type)
	{
		$this->type=$type;
	}

	public function getdata(){
		return $this->type->all();
	}
}