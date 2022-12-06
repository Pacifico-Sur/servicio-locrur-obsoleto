<?php

namespace ApiControl;

defined('BASEPATH') OR exit('No direct script access allowed');

use Database\Database;
use Helpers\Funciones;
use PDO;

/**
 * 
 */
class ApiMain {

	protected $conn;
	protected $items_arr = array();
	protected $items_user = array();

	function __construct() {
		$db = new Database();
		$this->conn = $db->pdo;
		$this->conn->beginTransaction();
	}

	public function getJson() {
		if (!isset($this->items_arr['security_data_apply'])) {
			$this->items_arr['security_data_apply'] = "Sin validaciones en API, todos pueden acceder";
			
		}else {
			unset($this->items_arr['security_data_apply']);
		}
		if (isset($this->items_user['session-user'])) {
			echo json_encode($this->items_user);
		}else {
			array_walk_recursive($this->items_arr, function(&$item, $key){
		        //if(!mb_detect_encoding($item, 'utf-8', true)){
		                //$item = utf8_encode($item);
		        //}
		    });
			echo json_encode($this->items_arr);
		}
	}

	public function getOneTableCat($tab) {
		self::evaluateTable('SELECT * FROM cat_' . strtolower($tab), strtolower($tab));
	}

	public function getOneTableCat_est($tab) {
		$field = substr_replace($tab ,"",-1);
		self::evaluateTable('SELECT * FROM cat_' . strtolower($tab) . ' WHERE activo = "S" ORDER BY ' . $field, strtolower($tab));
	}

	public function getOneTableAux($tab) {
		self::evaluateTable('SELECT * FROM ' . strtolower($tab), strtolower($tab));
	}

	public function getAuxTwoTable($tab, $tab2, $id_inner) {
		$column = $tab2;
		//$column = substr(strtolower($tab2), 0, -1);
		//return 'SELECT a.*, b.* FROM aux_' . strtolower($tab) . ' a INNER JOIN cat_' . $tab2 . ' b ON a.' . $id_inner . ' = b.' . $id_inner;
		self::evaluateTable('SELECT a.*, b.* FROM aux_' . strtolower($tab) . ' a INNER JOIN cat_' . $tab2 . ' b ON a.' . $id_inner . ' = b.' . $id_inner, strtolower($tab));
	}

	public function getTwoTable($tab, $tab2) {
		$column = $tab2;
		//$column = substr(strtolower($tab2), 0, -1);
		return 'SELECT a.*, b.' . $column . ' FROM cat_' . strtolower($tab) . ' a INNER JOIN cat_' . $tab2 . ' b ON a.id_' . $column . ' = b.id_' . $column . ' WHERE a.activo = "S"';
	}

	private function evaluateTable($sql, $val) {
		$sth = $this->conn->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$sth->execute();
		if ($sth->rowCount() > 0) {
			$this->items_arr[$val]=array();
			while ($row = $sth->fetch(PDO::FETCH_BOTH)){
				//$this->items_arr[$val][$row[0]] = $row;
				array_push($this->items_arr[$val], $row);
		    }
		}else{
			$this->items_arr[$val] = array("mensaje" => "Sin coincidencias encontradas.");
		}
		$sth = null;
	}

	public function showDebug($x, $y) {
		echo "<br><b>" . $x . "</b> showDebug:<br> ";
		if (is_array($y)) {
			//echo json_encode($a);
			echo "&nbsp;&nbsp; Es array: ";
			print_r($y);
		}else {
			//echo json_encode($a);
			echo "&nbsp;&nbsp; Es string: ";
			echo $y;
		}
		echo "<br>End debug<br>";
		//exit;
	}

	public function getOnlyDate($x) {
		$f_full = explode("-", $x);
		$f = $f_full[2] . '/' . $f_full[1] . '/' . $f_full[0];
		return $f;
	}

	public function logAccess($accion, $id = 0) {
		$sql = "
		INSERT INTO
			logs (
				id_personal,
				id_tipo_usuario,
				accion,
				id_registro
			)
		VALUES
			(?, ?, ?, ?)";
		$sth1 = $this->conn->prepare($sql);
		$sth1->execute(array(
			$_SESSION['idUser' . KEYSESSION],
			$_SESSION['idTipUser' . KEYSESSION],
			$accion,
			$id

		));
		$sth1 = null;
	}
}







