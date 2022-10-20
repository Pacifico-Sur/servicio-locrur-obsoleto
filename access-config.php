<?php

define('BASEPATH', 'https://superapp1349.herokuapp.com');

use ApiControl\Router;//el "use" se refiere al archivo que contiene la clase que se necesita, en este caso se necesita la clase "Router" que está en el archivo ApiControl/Router.php

require_once 'Autoload/Autoload.php';

//$asa = new Router(array('controller' => 'SessionSecurity', 'methods' => array('validate-session-page-user' => '')));

$fname = explode('/',$_SERVER["SCRIPT_NAME"]);

$hfile = $fname[count($fname) - 1];

if ($hfile === 'header.php')  exit('No direct script access allowed-P0');