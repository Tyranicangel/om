<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

class AssetTableSeeder extends Seeder {

	public function run()
	{
		$faker = Faker::create();

		DB::table("asset")->truncate();

		$assets=[
			[
				"type" => 1,
				"latitude" => "17.4262712",
				"longitude" => "78.4655877",
				"size" => "40ft X 100ft",
				"booking" => 30,
				"lit" => "neon lit",
				"location" => "Khairatabad Flyover",
				"visibility" => "3 roads visibility",
				"footfall" => "2 lakh per week",
				"original_price" => 180000,
				"discount_price" => 170000,
				"discount_percent" => 5,
				"advance_percent" => 1,
				"installation" => 4000,
				"locality" => 1,
				"city" => 1
			]
		];

		DB::table("asset")->insert($assets);
	}

}