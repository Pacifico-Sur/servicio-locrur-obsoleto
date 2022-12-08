<?php

namespace ApiControl;

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 
 */
class Router extends ApiMain
{
	private $uri;
	private $controller;
	private $methods;
	private $params;
	private $ApiRouter;
	
	function __construct($uri)
	{
		self::checkUri($uri);
		
		//Obtenemos el controller, al ser dinamico es necesario concatenar con el string el namcespace tambien
		$controller_class = "ApiControl\Api" . $this->controller;//hace que se dirijan todos los archivos a esta carpeta
		//Obtenemos el metodo
		$methods_name = $this->methods;
		//Obtenemos los params
		$params = $this->params;

		/*echo "----controller_class:  ".$controller_class;
		echo "----method:  "; print_r($methods_name);
		echo "----param:  " . $params;
		echo "----end<br>";*/

		$this->ApiRouter = new $controller_class();
		self::evaluateMethods($methods_name);
		//self::getJson();
	}

	private function checkUri($uri) {
		$this->controller = isset($uri['controller']) ? self::cleanUri($uri['controller']) : self::errorRouter('controller');
		$this->methods = isset($uri['methods']) ? self::filterMethods($uri['methods']) : self::errorRouter('methods');
	}

	private function filterMethods($methods) {
		if (is_array($methods)) {
			foreach ($methods as $key => $value) {
				//$res["get" . self::cleanUri($key)] = self::filterMethods($value);
				$res[self::cleanUri($key)] = self::filterMethods($value);
			}
		}else {
			$res = $methods;
		}
		return $res;
	}

	private function evaluateMethods($methods) {
		//self::showDebug(__FUNCTION__, $methods);
		if (is_array($methods)) {
			foreach ($methods as $key => $value) {
				if (is_array($value) && isset($value['Data'])) {
					$new_val = self::toLowerKey($value['Data']);
				}elseif (is_array($value) && !isset($value['Data'])) {
					self::evaluateMethods($value);
					$new_val = $value;
				}elseif (empty($value)) {
					$new_val = $key;
				}else{
					$new_val = $value;
				}
				self::existMethod($key, $new_val);
			}
		}
	}
	
	private function existMethod($method, $val) {
		$content_method = self::cleanMethod("get" . $method);
		if (method_exists($this->ApiRouter, $content_method)) {
			$this->ApiRouter->$content_method($val);
		}else{
			//http_response_code(405);
			echo json_encode(array('Error de methodo, line: ' . __LINE__ => $content_method . ' no existe en ' . $this->controller));
			exit;
		}
	}

	public function cleanUri($string) {
		return ucfirst(preg_replace("/[^A-Za-z0-9_]/", "", $string));
	}

	private function cleanMethod($string) {
		return ucfirst(preg_replace("/[^A-Za-z0-9]/", "", $string));
	}

	private function errorRouter($x) {
		echo json_encode(array($x => 'Error en uri, line: ' . __LINE__ . ' in Router'));
		exit;
	}

	private function toLowerKey($str) {
		$arr = array();
		foreach ($str as $key => $value) {
			$arr[strtolower($key)] = $value;
		}
		return $arr;
	}
}