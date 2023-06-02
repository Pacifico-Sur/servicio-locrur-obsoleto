<html>
  <head>
    <title>PHP and R Integration Sample</title>
  </head>
  <body>
  <div id=r-output id=width: 100%; padding: 25px;?>
    <form action="#" method="get">
      ¿Qué id de municipio quieres?: <input type="numeric" name="id_mun"><br>
      <input type="submit">
    </form>
    <?php
    if(isset($_GET['id_mun'])) {
      $id_municipio = $_GET['id_mun'];
      // execute R script from shell
      // this will save a plot at temp.png to the filesystem
      exec("Rscript www/scripts/grafica_municipio_localidades.R $id_municipio");
    }
    echo "</br>";  
    echo("<img src='www/imgs/mi_mapa.png?v=2' width='50%'>");
    ?>
    <br>
    </div>
  </body>
</html>
