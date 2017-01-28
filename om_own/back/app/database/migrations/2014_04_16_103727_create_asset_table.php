<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAssetTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('asset', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('type_id');
			$table->string('latitude');
			$table->string('longitude');
			$table->string('size');
			$table->integer('booking');
			$table->string('lit');
			$table->string('location');
			$table->string('visibility');
			$table->string('footfall');
			$table->integer('orginal_price');
			$table->integer('discount_price');
			$table->integer('discount_percent');
			$table->integer('advance_percent');
			$table->integer('installation');
			$table->integer('locality_id');
			$table->integer('city_id');
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('asset');
	}

}
