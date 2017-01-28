<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return "123";
});

Route::get('/get_types',"TypeController@getdata");

Route::get('/get_cities',"CityController@getdata");

Route::get('/get_localities',"LocationController@getdata");

Route::get('/get_markers',"MarkerController@getdata");

Route::post('/update_origin',"MarkerController@update_origin");

Route::post('/update_my',"MarkerController@update_my");