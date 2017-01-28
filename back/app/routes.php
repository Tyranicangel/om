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

Route::get('/get_cdate',function(){
	$date = date('Y-m-d');
	return ")]}',\n".$date;
});

Route::get('/get_types',"TypeController@getdata");

Route::get('/get_cities',"CityController@getdata");

Route::get('/check_cities',"CityController@checkcity");

Route::get('/get_localities',"LocationController@getdata");

Route::get('/get_markers',"MarkerController@getdata");

Route::get('/get_markersthis',"MarkerController@getthismarker");

Route::post('/register_user',"AdminController@registeruser");

Route::post('/login_user',"AdminController@loginuser");

Route::get('/get_user',"AdminController@getuser");

Route::get('/get_usercamp',"AdminController@getusercamp");

Route::post('/change_user_pass',"AdminController@change_user_pass");

Route::post('/book_ad',"AdminController@book_ad");

Route::get('/get_campdetails',"AdminController@get_campdetails");

Route::post('/insert_campasset',"AdminController@insert_campasset");

Route::post('/remove_campasset',"AdminController@remove_campasset");

Route::post('/create_campaign',"AdminController@create_campaign");

Route::post('/delcampasset',"AdminController@delcampasset");

Route::post('/editcampname',"AdminController@editcampname");

Route::get('/get_allcampdetails',"AdminController@get_allcampdetails");
