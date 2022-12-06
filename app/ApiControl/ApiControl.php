<?php

namespace ApiControl;//namespace define el nombre de la carpeta "padre" este archivo, en este caso el nombre es: "ApiControl"

defined('BASEPATH') OR exit('No direct script access allowed');

use PDO;//inicializa clase PDO para usar funciones PDO
use ApiControl\ApiSessionSecurity;//el "use" se refiere al archivo que contiene la clase que se necesita, en este caso se necesita la clase "ApiSessionSecurity" que está en el archivo ApiSessionSecurity.php

/**
 * 
 */
class ApiControl extends ApiMain {

	//private $conn;
	private $asa;
	
	function __construct() {
		$this->asa = new ApiSessionSecurity();
		$this->asa->sessionValidator();
		$this->items_arr['security_data_apply'] = $this->asa->evaluatePrivilege(array(1,2,3,4,5,6));
		//$this->items_user['validate-user'] = array("status" => FALSE);
		parent::__construct();
	}

	public function getTheme($x) {
		try {
			$sql = "
			UPDATE
				usuarios
			SET
				theme = ?
			WHERE
				id_usuario = ?";

			$sth1 = $this->conn->prepare($sql);
			//$inst_data = $this->asa->adminPrivilege() ? $data['id_institucion'] : $_SESSION['idUserAdoptInst'];
			$sth1->execute(	array(
				$x['theme'],
				$_SESSION['idUser' . KEYSESSION],
			));

			$sth1 = null;

			$_SESSION['theme' . KEYSESSION] = $x['theme'];

			//self::logAccess("Agregó cat_marcas", $id_insert);

			$this->conn->commit();


			$this->items_arr['data-success'] = 'Done';
			
		} catch (PDOException $e) {
			$this->conn->rollback();
			$this->items_arr['data-success'] = array("mensaje" => 'err');
		}
	}

	public function getSitesAccess() {
		$this->items_arr['sites_access'] = $this->asa->scriptsUserAccessData();
	}
}