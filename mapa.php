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
                <strong>MAPA</strong>
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
                            <div class="head-filter">Seleccione el Estado</div>
                            <select name="id_estado" id="select-estado" placeholder="Estado">
                                <option value="">Seleccione una opción</option>
                            </select>
                        </div>
                        <div>
                            <div class="head-filter">Seleccione el Municipio</div>
                            <input name="municipio" id="select-municipio" disabled placeholder=" Municipio">
                            <input type="hidden" name="id_municipio" id="select-municipio-id" placeholder=" Municipio">
                        </div>
                        <div>
                            <div class="head-filter">Seleccione el método de consulta</div>
                            <select name="id_metodo" id="select-metodo" placeholder="metodo">
                                <option value="">Seleccione una opción</option>
                                <option value="1">Por núcleo agrario</option>
                                <option value="2">Por área de control</option>
                            </select>
                        </div>
                        <div class="na hide-depend-nucleo">
                            <div class="head-filter">Seleccione el Núcleo agrario</div>
                            <select name="id_na" id=select-na placeholder=" Municipio">
                                <option value="">Seleccione una opción</option>
                            </select>
                        </div>
                        <div class="mapats hide-depend-nucleo">
                            <div id="poligonos-maps"> meipin</div>
                        </div>
                        <div>
                            <div class="head-filter">Seleccione un tema</div>
                            <select name="id_tema" id="select-tema">
                            </select>
                        </div>
                        <div class="anio">
                            <div class="head-filter">Seleccione el año de consulta</div>
                            <select name="anio" id=anio>
                                <option value="2010">2010</option>
                                <option value="2020">2020</option>
                                <!--<option value="20102020">2010-2020</option>-->
                            </select>
                        </div>
                        <div class="subtema">
                            <div class="head-filter">Subtema</div>
                            <!--<select name="id_subtema" id="select-subtema1" disabled>
                            </select>-->
                            <input name="subtema" id="select-subtema"  readonly="readonly">
                            <input type="hidden" name="id_subtema" id="select-subtema-id">
                        </div>
                        <div class="descsubtema">
                            <div class="head-filter">Seleccione un subtema</div>
                            <select name="id_descsubtema" id="select-descsubtema">
                            </select>
                        </div>
                        <div>
                            <div class="head-filter head-indicadores">Seleccione los indicadores a consultar</div>
                            <div class="content-indicadores">
                                <div id="check-ind-var">
                                    <div><input type="checkbox" class="indicadores-check-var" id="check-all-var">Seleccionar todos</div>
                                    <div id="check-indicadores-var"></div>
                                </div>
                                <div id="check-ind-none">
                                    <div><input type="checkbox" class="indicadores-check" id="check-all">Seleccionar todos</div>
                                    <div id="check-indicadores"></div>
                                </div>
                            </div>
                        </div>
                        <div class="btn-indicadores">
                            <button id="btn-buscar">Ver indicadores</button>
                        </div>
                    </div>

                    <div class="res-x"></div>
                    <div class="res-sql"></div>
                    <div class="res-error"></div>
                    <div class="res-error-2"></div>

                    <!--<div id="icono-excel"><img src="images/excel.png"> Exportar a excel</div>
                    <div id="icono-pdf"><img src="images/pdf.png"> Exportar a pdf</div>-->

                    <button id="icono-export"> Exportar  <img src="images/export.png"></button>

                    <!--<font>NOTA:</font> Si no se encuentra el n&uacute;mero de expediente, cerci&oacute;rese de haberlo subido antes.-->
                    <table id="footable-list" class="tab-list get-module" data-module="mapa" data-paging="true" data-filtering="true" data-sorting="true" data-filter-placeholder="Buscar"></table>

                    <table id="footable-list-cube" class="tab-lis" data-paging="true" data-filtering="true" data-sorting="true" data-filter-placeholder="Buscar"></table>




                </div>
            </div>
        </div>
    </div>
</div>
<?php
include("footer.php");
?>
