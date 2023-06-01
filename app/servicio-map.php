<?php
include("header.php");
$hidden = "";
if (isset($_GET["x"])) {
    $hidden = $_GET["x"];
}
?>
<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-10">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
            </li>
            <li class="breadcrumb-item active">
                <strong>SERVICIO MAPA</strong>
            </li>
        </ol>
    </div>
</div>

<div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox ">
                <div class="ibox-title">
                    <div class="search-field">
                        <div><h5></h5></div>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="load-data">Cargando información.....</div>
                    <div class="content-filters">
                        <input type="hidden" name="debug" id="debug" value="<?php echo $hidden ?>">
                        <div>
                            <div class="head-filter">Estado</div>
                            <select name="id_estado" id=select-estado placeholder=" Municipio">
                                <option value="">Seleccione una opción</option>
                            </select>
                        </div>
                        <div>
                            <div class="head-filter">Municipio</div>
                            <input name="municipio" id="select-municipio" disabled placeholder=" Seleccione un municipio">
                            <input type="hidden" name="id_municipio" id="select-municipio-id" placeholder=" Seleccione un municipio">
                        </div>
                        <div>
                            <div class="head-filter">Territorio o tenencia y su contorno</div>
                            <select name="id_metodo" id="select-metodo" placeholder="metodo">
                                <option value="">Seleccione una opción</option>
                                <option value="1">Propiedad social</option>
                                <option value="2">Propiedad privada</option>
                                <option value="3">Municipio</option>
                            </select>
                        </div>
                        <div class="anio-na">
                            <div class="head-filter">Año de consulta</div>
                            <select name="anio_na" id="anio-na">
                                <option value="2010">2010</option>
                                <option value="2020">2020</option>
                                <!--<option value="20102020">2010-2020</option>-->
                            </select>
                        </div>
                        <div class="na hide-depend-nucleo">
                            <div class="head-filter">Ejido o comunidad</div>
                            <select name="id_na" id=select-na placeholder="Núcleo agrario">
                                <option value="">Seleccione una opción</option>
                            </select>
                        </div>
                        <div class="anio-municipio">
                            <div class="head-filter">Año de consulta</div>
                            <select name="anio_municipio" id="anio-municipio">
                                <option value="2010">2010</option>
                                <option value="2020">2020</option>
                                <!--<option value="20102020">2010-2020</option>-->
                            </select>
                        </div>

                        <div class="mapats hide-depend-nucleo">
                            <div id="poligonos-maps"> meipin</div>
                            <div class="conentent-click-map">
                                <div id="res-click-map">
                                    Results
                                </div>
                            </div>
                        </div>
                        
                        
                        <figure class="depend-content">
                            <div>
                                <div class="head-filter">Tema</div>
                                <select name="id_tema" id="select-tema">
                                </select>
                            </div>
                            <div class="anio">
                                <div class="head-filter">Año de consulta</div>
                                <select name="anio" id=anio>
                                    <option value="2010">2010</option>
                                    <option value="2020">2020</option>
                                </select>
                            </div>
                            <div class="subtema">
                                <div class="head-filter">Subtema</div>
                                <!--<select name="id_subtema" id="select-subtema1" disabled>
                                </select>-->
                                <input name="subtema" id="select-subtema"  readonly="readonly">
                                <input type="hidden" name="id_subtema" id="select-subtema-id">
                            </div>
                            <div>
                                <div class="head-filter head-indicadores">Indicadores</div>
                                <div class="content-indicadores">
                                    <div><input type="checkbox" class="indicadores-check" id="check-all">Seleccionar todos</div>
                                    <div id="check-indicadores"></div>
                                </div>
                            </div>
                            <div class="btn-indicadores">
                                <button id="btn-buscar">Ver indicadores</button>
                            </div>
                        </figure>
                    </div>

                    <div class="res-x"></div>
                    <div class="res-sql"></div>
                    <div class="res-error"></div>
                    <div class="res-error-2"></div>

                    <!--<div id="icono-excel"><img src="images/excel.png"> Exportar a excel</div>
                    <div id="icono-pdf"><img src="images/pdf.png"> Exportar a pdf</div>-->

                    <button id="icono-export"> Exportar  <img src="images/export.png"></button>

                    <!--<font>NOTA:</font> Si no se encuentra el n&uacute;mero de expediente, cerci&oacute;rese de haberlo subido antes.-->
                    <table id="footable-list" class="tab-list get-module" data-module="servicioMap" data-paging="true" data-filtering="true" data-sorting="true" data-filter-placeholder="Buscar"></table>

<style type="text/css">
    .content-data-infografia {
        border-radius: 0px 10px 10px 0px;
        box-shadow: inset 2px 2px 0px 0px white, inset -1px -1px 10px 0px rgb(0 0 0 / 25%);
        color: #585858;
        display: grid;
        font-size: 12px;
        height: 140px;
        line-height: 17px;
        float: left;
        padding: 1% 1% 1% 5px;
        width: 74%;
    }
    #infografia article {
        display: inline-block;
        width: 620px;
    }
    #infografia_muni article {
        display: inline-block;
        width: 620px;
    }
    .title-infografia {
        border-radius: 85px 0px 0px 85px;
        color: white;
        display: grid;
        float: left;
        font-size: 13px;
        font-family: "San Francisco Display Medium";
        height: 140px;
        padding: 2% 2% 2% 5%;
        text-align: center;
        width: 24%;
    }
    .title-infografia>div {
        margin: auto;
        text-transform: uppercase;
    }
    .content-data-infografia span {
        font-weight: 700;
        margin-left: 5px;
    }
    .content-data-infografia i {
        border-radius: 2px;
        height: 5px;
        width: 5px !important;
        display: inline-block;
        margin: 0px 5px 2px 0px;
    }
</style>
                    <div class="hide-infog-for-screenshot">
                        <div id="infografia"></div>
                    </div>
                    <div class="hide-infog-for-screenshot">
                        <div id="infografia_muni"></div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
<?php
include("footer.php");
?>