<?php



$host = "localhost";
$username = "postgres";
$password = "zeppelin";
$db_name = "nosee";

$db_driver = "pgsql";
	
$dsn = $db_driver . ':host=' . $host . ';dbname=' . $db_name . '';
$options = array(
 	PDO::ATTR_EMULATE_PREPARES => false,
 	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
 	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
);
try {
    $pdo = new PDO($dsn, $username, $password, $options);
    echo "<br>ok";
} catch (PDOException $e){
    echo "Conexión falló: ".$e->getMessage();
}




$sql = 'SELECT 
	*
	FROM ivp.vulnerabilidad_loc_rur_2010 limit 10';
	echo "<br>sql: " . $sql;
$sth = $pdo->prepare($sql);
$sth->execute();
$rows = $sth->rowCount();
if ($rows > 0) {
	$items_arr = array();
	$result = $sth->fetchAll(PDO::FETCH_ASSOC);
	foreach ($result as $row) {
		$items_arr[] = $row;
	}
}else{
	$items_arr['bases'] = array("mensaje" => "Sin coincidencias encontradas.");
}
$sth = null;

echo "<br>resss: <br><br>";
print_r($items_arr);