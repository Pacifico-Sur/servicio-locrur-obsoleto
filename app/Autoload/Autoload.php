<?php



//if ( !function_exists("__autoload") ) {

	/*function __autoload($class) {

	    //$filename = '..' . DIRECTORY_SEPARATOR . str_replace("\\", '/', $class) . ".php";

	    $filename = __DIR__  . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . str_replace("\\", '/', $class) . ".php";

	    if (!file_exists($filename)) {

	        throw new Exception("El archivo '$filename' no existe", 1);

	    }

	    require_once $filename;

	    if (!class_exists($class)) {

	        throw new Exception("La clase '$class' no existe", 1);

	    }

	}*/

	spl_autoload_register(function($class) {
	    $filename = __DIR__  . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . str_replace("\\", '/', $class) . ".php";

	    if (!file_exists($filename)) {

	        throw new Exception("El archivo '$filename' no existe", 1);

	    }

	    require_once $filename;

	    if (!class_exists($class)) {

	        throw new Exception("La clase '$class' no existe", 1);

	    }
	});

//}