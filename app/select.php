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
                <strong>SERVICIO DE INFORMACIÓN Y CONOCIMIENTO DE LOCALIDADES RURALES</strong>
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
                        <div>
                            <h5></h5>
                        </div>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="load-data">Cargando información.....</div>
                    <div class="content-filters">
                        <input type="hidden" name="debug" id="debug" value="<?php echo $hidden ?>">
                        <div>
                            <div class="head-filter">Estado</div>
                            <select name="id_estado" id="select-estado" placeholder="Estado">
                                <option value="">Seleccione una opción</option>
                            </select>
                        </div>
                        <div>
                            <div class="head-filter">Municipio</div>
                            <input name="municipio" id="select-municipio" disabled
                                placeholder=" Seleccione un municipio">
                            <input type="hidden" name="id_municipio" id="select-municipio-id"
                                placeholder=" Seleccione un municipio">
                        </div>
                        <!--<div>
                            <div class="head-filter">Seleccione el Localidad</div>
                            <input name="localidad" id="select-localidad" disabled>
                            <input type="hidden" name="id_localidad" id="select-localidad-id">
                        </div>-->
                        <div>
                            <div class="head-filter">Localidad</div>
                            <select name="id_localidad" id="select-localidad" placeholder="Localidad" multiple></select>
                        </div>
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
                                <!--<option value="20102020">2010-2020</option>-->
                            </select>
                        </div>
                        <div class="subtema">
                            <div class="head-filter">Subtema</div>
                            <!--<select name="id_subtema" id="select-subtema1" disabled>
                            </select>-->
                            <input name="subtema" id="select-subtema" readonly="readonly">
                            <input type="hidden" name="id_subtema" id="select-subtema-id">
                        </div>
                        <div class="descsubtema">
                            <div class="head-filter">Subtema</div>
                            <select name="id_descsubtema" id="select-descsubtema">
                            </select>
                        </div>
                        <div>
                            <div class="head-filter head-indicadores">Indicadores</div>
                            <div class="content-indicadores">
                                <div id="check-ind-var">
                                    <div><input type="checkbox" class="indicadores-check-var"
                                            id="check-all-var">Seleccionar todos</div>
                                    <div id="check-indicadores-var"></div>
                                </div>
                                <div id="check-ind-none">
                                    <div><input type="checkbox" class="indicadores-check" id="check-all">Seleccionar
                                        todos</div>
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

                    <div class="content-tab-problemas">
                        <div class="tab-prob-title">Posibles problemas principales declarados por el informante</div>
                        <div>1.CARENCIA DE AGUA Y MALA CALIDAD</div>
                        <div>2.CARENCIA O MAL ESTADO DE CAMINOS</div>
                        <div>3.FALTA DE RECURSOS PARA LA PRODUCCIÓN</div>
                        <div>4.DESEMPLEO, EMPLEO DEFICIENTE</div>
                        <div>5.CARENCIA O FALLAS DE ENERGÍA ELÉCTRICA Y ALUMBRADO PÚBLICO</div>
                        <div>6.OTRO PROBLEMA</div>
                        <div>7.SIN INFORMACIÓN</div>
                    </div>

                    <button id="icono-export"> Exportar <img src="images/export.png"></button>

                    <!--<font>NOTA:</font> Si no se encuentra el n&uacute;mero de expediente, cerci&oacute;rese de haberlo subido antes.-->
                    <table id="footable-list" class="tab-list get-module" data-module="select" data-paging="true"
                        data-filtering="true" data-sorting="true" data-filter-placeholder="Buscar"></table>

                    <table id="footable-list-cube" class="tab-lis" data-paging="true" data-filtering="true"
                        data-sorting="true" data-filter-placeholder="Buscar"></table>

                    <div class="hide-for-screenshot">
                        <div id="poligonos-maps">
                            <div class="title-map-edo">Estado de <span></span></div>
                            <div class="title-map-mun">Municipio de <span></span></div>
                            <div class="title-map-carto"><img src="images/brujula.jpg"></div>
                            <div class="title-map-fuente"></div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    </div>
</div>
<?php
include("footer.php");
?>