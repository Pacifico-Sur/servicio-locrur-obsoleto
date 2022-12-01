<?php

namespace ApiControl;

defined('BASEPATH') OR exit('No direct script access allowed');

define('PATH_SECURE', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https:" : "http:") . DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR);
define('SECURE', isset($_SERVER['HTTPS']));
define('NAME_SESSION', 'PHPCONTROLSITIOMEGA');
define('LIMIT_SESSION', 360000);
define('PATH_SESSION', '/');
define('DOMAIN', $_SERVER['SERVER_NAME']);
define('SELF', pathinfo(__FILE__, PATHINFO_BASENAME));
define('KEYSESSION', 'geod');

use PDO;

/**
 * 
 */
class ApiSessionSecurity extends ApiMain {

	//private $conn;
	//private $items_user = array();
	
	function __construct() {
		session_name(NAME_SESSION . '_SessionGeoD');
		session_set_cookie_params(LIMIT_SESSION, PATH_SESSION, DOMAIN, SECURE, true);
		session_start();
		parent::__construct();
		//echo "<br>camara";

		
	}

	public function getValidateLogin($x) {
		if (self::validateSession()) {
			//echo "<br>DEBUG 1";
			if(!self::preventHijacking()) {
				//echo "<br>DEBUG 2 aun no inicia";
				if(!$x['usuario'] || !$x['password'] || !$x['token_control_doc']) {
					/*http_response_code(401);*/
				    //echo json_encode(array("status" => 'empty-post'));
				    $this->items_user['session-user'] = array("status" => FALSE);
					//exit;
				}else{
					if ($_SESSION['token_session_control_doc'] == $x['token_control_doc']) {
						//aquí se define la consulta que hará referencia al usuario que tendrá acceso JFP
						$sql = '
							SELECT
								a.id_usuario,a.id_tipo_usuario,b.tipo_usuario,a.nombre,a.paterno,a.materno, a.correo,a.theme
							FROM
								usuarios a
							INNER JOIN
								cat_tipo_usuario b ON a.id_tipo_usuario = b.id_tipo_usuario
							WHERE
								usuario = :usuario AND a.activo = "S" AND password = :password';
						$sth = $this->conn->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
						$sth->bindValue(':usuario', $x['usuario'], PDO::PARAM_STR);
						$sth->bindValue(':password', sha1($x['password']), PDO::PARAM_STR);//Aqui encripta, cambiar md5() por la funcion de encriptacion 
						$sth->execute();
						if ($sth->rowCount() > 0) {
							unset($_SESSION['token_session_control_doc']);
							$row = $sth->fetch(PDO::FETCH_ASSOC);
							$_SESSION = array();
					        $_SESSION['nom' . KEYSESSION] = utf8_encode($row['nombre'] . " " . $row['paterno'] . " " . $row['materno']);
							$_SESSION['idUser' . KEYSESSION] = $row['id_usuario'];
							$_SESSION['correo' . KEYSESSION] = $row['correo'];
							$_SESSION['idTipUser' . KEYSESSION] = $row['id_tipo_usuario'];
							$_SESSION['tipUser' . KEYSESSION] = $row['tipo_usuario'];
							$_SESSION['foto' . KEYSESSION] = "images/logo.png";
							$_SESSION['theme' . KEYSESSION] = $row['theme'];
							$_SESSION['IPaddress' . KEYSESSION] = $_SERVER['REMOTE_ADDR'];
							$_SESSION['userAgent' . KEYSESSION] = $_SERVER['HTTP_USER_AGENT'];
							$sth = null;

							$_SESSION['getAllTipoUsers' . KEYSESSION] = self::getAllIdTipoUsers();
					        //echo "<br>DEBUG 4 ya inicializó sessiones y regenera sesion";
							self::regenerateSession();
							//header('Location: index.php');
							//http_response_code(200);
							//Registra los logs
							//self::logAccess("Ingresó al sistema");

							$this->items_user['session-user'] = array("status" => TRUE);
						}else{
							$this->items_user['session-user'] = array("status" => FALSE);
						}
					}else{
						//echo json_encode("token no coincide");
						//http_response_code(401);
						//echo json_encode(array("status" => 'no-token'));
						$this->items_user['session-user'] = array("status" => FALSE);
					}
				}
			}else {
				//echo "<br>Si se logea antes y se deja otra pagina en el login si entra aunq no sea usuario yta que no compara token";
				self::regenerateSession();
				//header('Location: index.php');
				//http_response_code(200);
				$this->items_user['session-user'] = array("status" => TRUE);
				//exit;
			}
		}else{
			//echo json_encode("err 4");
			//echo "<br>Murio la sesión";
			$_SESSION = array();
			session_destroy();
			session_start();
			$this->items_user['session-user'] = array("status" => FALSE);
			//exit;
		}
	}

	public function getValidateUser() {
		if (self::validateSession()) {
			//echo "<br>DEBUG 1";
			if(!self::preventHijacking()) {
				//$_SESSION = array();session_destroy();session_start();
				//echo "<br>DEBUG 2 aun no inicia, se deja en login y se crea token";

				//print_r($_SESSION);
				//header('Location: login.php');
				//http_response_code(401);
				//http_response_code(401);
				//echo json_encode(array("status" => 'session-expired'));
				$hora = date('H:i:s');
				$session_id = session_id();
				$token = hash('sha256', $hora.$session_id);
				$_SESSION['token_session_control_doc'] = $token;
				//echo "<br>t: " . $_SESSION['token_session_control_doc'] . "end---";
				$this->items_user['session-user'] = array("status" => FALSE, 'tkn' => $_SESSION['token_session_control_doc']);
			}else {
				//echo "<br>DEBUG 3 ya tiene sessiones y regenera sesion y se envía al menu";
				self::regenerateSession();
				$this->items_user['session-user'] = array("status" => TRUE);
				//exit;
			}
		}else{
			//echo json_encode("err 4");
			//echo "<br>Murio la sesión, se deja en login y se crea token";
			$_SESSION = array();
			session_destroy();
			session_start();

			$hora = date('H:i:s');
			$session_id = session_id();
			$token = hash('sha256', $hora.$session_id);
			$_SESSION['token_session_control_doc'] = $token;
			//echo "<br>t: " . $_SESSION['token_session_control_doc'] . "end---";
			$this->items_user['session-user'] = array("status" => FALSE, 'tkn' => $_SESSION['token_session_control_doc']);
			//exit;
		}
	}

	public function getValidateSessionPageUser() {
		if (self::validateSession()) {
			if(!self::preventHijacking()) {
				self::redirectAppLogin();
			}else {
				self::regenerateSession();
				self::getUserData();
				self::fileUserAccess();
			}
		}else{
			//echo json_encode("err 4");
			//echo "<br>Murio la sesión, se deja en login y se crea token";
			$_SESSION = array();
			session_destroy();
			session_start();

			self::redirectAppLogin();
		}
	}

	public function getUserData() {
		unset($_ENV);
		$_ENV['usuario'] = $_SESSION['nom' . KEYSESSION];
		$_ENV['correo'] = $_SESSION['correo' . KEYSESSION];
		$_ENV['tipo_usuario'] = $_SESSION['tipUser' . KEYSESSION];
		$_ENV['foto'] = $_SESSION['foto' . KEYSESSION] ? $_SESSION['foto' . KEYSESSION] : BASEPATH . "/images/icono_usuario.png";
		$_ENV['theme'] = $_SESSION['theme' . KEYSESSION];
	}

	public function getAllIdTipoUsers() {
		$sql = 'SELECT id_tipo_usuario FROM cat_tipo_usuario WHERE activo = "S"';// AND b.activo = "S"';//' AND usr_personal = :usuario AND pwd2_personal = :password';
		$sth = $this->conn->prepare($sql);
		$sth->execute();
		$result = $sth->fetchAll(PDO::FETCH_ASSOC);
		$idtu = array();
		foreach ($result as $row) {
			$idtu[] = $row['id_tipo_usuario'];
		}
		return $idtu;
	}

	private function redirectAppLogin() {
		header('Location: ' . BASEPATH . '/login.php');
		//echo "<br>xxx redirectAppLogin";
		exit;
	}

	public function getSalir() {
		$_SESSION = array();
		session_destroy();
		session_start();
		echo json_encode(array("none-access" => TRUE));
		exit;
	}

	public function sessionValidator() {
		if (self::validateSession()) {
			if(!self::preventHijacking()) {
				//$this->user_validator['session-validator'] = array("none-access" => TRUE);
				echo json_encode(array("none-access" => TRUE));
				exit;
				//exit;
			}else {
				//$this->user_validator['session-validator'] = array("none-access" => TRUE);
				//exit;
				//return array("none-access" => TRUE);
				self::regenerateSession();
			}
		}else{
			$_SESSION = array();
			session_destroy();
			session_start();
			//$this->user_validator['session-validator'] = array("none-access" => TRUE);
			//exit;
			echo json_encode(array("none-access" => TRUE));
			exit;
		}
	}

	public static function evaluatePrivilege($x) {
		if (!in_array($_SESSION['idTipUser' . KEYSESSION], $x)) {
			echo json_encode(array("none-access" => TRUE, "this-id-tipo-user-none-access" => TRUE));
			exit;
		}else {
			return true;
		}
	}

	public function fileUserAccess() {
		$fname = explode('/',$_SERVER["SCRIPT_NAME"]);
		$hfile = $fname[count($fname) - 1];

		if (!in_array($hfile, self::scriptsUserAccessData())) {
			header('Location: ' . BASEPATH . '/index.php');
			exit('No direct script access allowed-P1');
		}
	}

	public function scriptsUserAccessData() {
		$file_scripts = array('index.php');
		switch ($_SESSION['idTipUser' . KEYSESSION]) {
			case 1://Administrador
				array_push($file_scripts, 'bases.php');
				break;
			case 2://Invitado
				array_push($file_scripts, 'bases.php');
				break;
			default:
				//array_push($file_scripts, 'basic-urls');
				break;
		}
		return $file_scripts;
	}

	private function preventHijacking() {
		//echo "<br>Hijacking";
		if (!isset($_SESSION['IPaddress' . KEYSESSION]) || !isset($_SESSION['userAgent' . KEYSESSION])) {
			/*echo "<br>Hijacking 1***: " . $_SESSION['IPaddress' . KEYSESSION];
			echo "<br>Hijacking 1***: " . $_SESSION['userAgent' . KEYSESSION];*/
			return false;
		}

		if ($_SESSION['IPaddress' . KEYSESSION] != $_SERVER['REMOTE_ADDR']) {
			//echo "<br>Hijacking 2***";
			return false;
		}

		if( $_SESSION['userAgent' . KEYSESSION] != $_SERVER['HTTP_USER_AGENT']) {
			//echo "<br>Hijacking 3***";
			return false;
		}
		//echo "<br>Hijacking 4***";

		return true;
	}

	private function regenerateSession() {
		//Si esta sesión es obsoleta significa que ya hay un nuevo id
		//echo "<br>resg ses***";
		if(isset($_SESSION['OBSOLETE']) && $_SESSION['OBSOLETE'] == true) {
			//echo "<br>Esta obsoleta";
			return;
		}

		//Establecemos la sesión actual a expirar en 10 segundos
		$_SESSION['OBSOLETE'] = true;
		//$_SESSION['EXPIRES'] = time() + 5;
		$_SESSION['EXPIRES'] = time() + 5;

		//echo "<br>SESSION['EXPIRES']: ".$_SESSION['EXPIRES'];

		//Creamos una nueva sesión sin destruir la vieja
		session_regenerate_id(false);

		//Agarramos el ID de sesión actual y cerramos ambas sesiones para permitir que otros scripts las usen
		$newSession = session_id();
		session_write_close();

		//Estabelcemos la sesión ID a la nueva y volvemos a iniciar sesión
		session_id($newSession);
		session_start();

		//Ahora borramos los valoes de OBSOLETE y EXPIRES para la sesión que queremos mantener
		unset($_SESSION['OBSOLETE']);
		unset($_SESSION['EXPIRES']);
	}

	private function validateSession() {
		//echo "<br>val ses";
		if( isset($_SESSION['OBSOLETE']) && !isset($_SESSION['EXPIRES']) ) {
			//echo "<br>val ses 1***";
			return false;
		}

		if(isset($_SESSION['EXPIRES']) && $_SESSION['EXPIRES'] < time()) {
			//echo "<br>val ses 2***";
			return false;
		}

		//echo "<br>val ses true***";
		return true;
	}

	public function encId($id) {
		$word_enc = 'led_zepl1n(' . $_SESSION['idUser' . KEYSESSION] . '/' . $id . ')';
		$token = hash('sha256', $word_enc);
		return $token;
	}

	public function validateToken($id, $token) {
		$id_enc = self::encId($id);
		if ($id_enc != $token) {
			echo json_encode(array("none-access" => TRUE));
			exit;
		}
	}
}