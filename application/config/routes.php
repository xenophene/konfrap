<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/
$route['user'] = 'user/home';
$route['user/follow'] = 'user/follow';
$route['user/unfollow'] = 'user/unfollow';
$route['user/all'] = 'user/all';
$route['user/remove_interest'] = 'user/remove_interest';
$route['user/add_interest'] = 'user/add_interest';
$route['user/login'] = 'user/login';
$route['user/logout'] = 'user/logout';
$route['user/home/(:any)'] = 'user/home/$1';

$route['debate/create'] = 'debate/create';
$route['debate/all'] = 'debate/all';
$route['debate/add_theme'] = 'debate/add_theme';
$route['debate/remove_theme'] = 'debate/remove_theme';
$route['debate/invite_friends'] = 'debate/invite_friends';
$route['debate/unfollow'] = 'debate/unfollow';
$route['debate/follow'] = 'debate/follow';
$route['debate/edit_field'] = 'debate/edit_field';
$route['debate/(:any)'] = 'debate/index/$1';

$route['comments/by_debate/(:any)'] = 'comments/by_debate/$1';

$route['contact/feedback'] = 'contact/feedback';
$route['contact/join_us'] = 'contact/join_us';
$route['contact/about'] = 'contact/about';

$route['default_controller'] = 'user/home';

/* End of file routes.php */
/* Location: ./application/config/routes.php */