<?php

namespace ApiControl;//namespace define el nombre de la carpeta "padre" este archivo, en este caso el nombre es: "ApiControl"

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");

header("Access-Control-Allow-Methods: GET");

header("Access-Control-Allow-Credentials: true");

header('Content-Type: application/json');


define('BASEPATH', 'https://superapp1349.herokuapp.com');



use ApiControl\Router;//el "use" se refiere al archivo que contiene la clase que se necesita, en este caso se necesita la clase "Router" que está en el archivo Router.php



require_once '../Autoload/Autoload.php';//



new Router(empty($_GET) ? $_POST['form'] : $_GET);