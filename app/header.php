<?php
//include("access-config.php");
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0">-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
        <title>Adesur | GEO</title>
        <link rel="icon" href="images/favicon.ico">
        <link href="css-geo/plugins/font-awesome/css/font-awesome.css" rel="stylesheet">
        <link href="css-geo/plugins/style.css" rel="stylesheet" type="text/css">
        <link href="css-geo/plugins/confirm/jquery-confirm.css" rel="stylesheet" type="text/css">
        <link href="css-geo/plugins/footable/footable.standalone.css" rel="stylesheet" type="text/css">
        <link href="css-geo/plugins/ladda/ladda-themeless.min.css" rel="stylesheet">
        <link href="css-geo/plugins/selectize/selectize.css" rel="stylesheet">
        <link href="css-geo/plugins/template/bootstrap.min.css" rel="stylesheet">
        <link href="css-geo/plugins/template/style-design-darks.css" rel="stylesheet" type="text/css">
        <link href="css-geo/plugins/validations/validations.css" rel="stylesheet">
        <link href="css-geo/plugins/autocomplete/jquery-ui.css" rel="stylesheet">
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.7.0/mapbox-gl.css" rel="stylesheet" />
    </head>
    <body class="fixed-sidebar pace-done mini-navbar" id="app-site-">
        <div id="wrapper">
            <nav class="navbar-default navbar-static-side" role="navigation">
                <div class="sidebar-collapse">
                    <ul class="nav metismenu" id="side-menu">
                        <li class="nav-header">
                            <div class="profile-background"></div>
                            <div class="dropdown profile-element">
                                <img alt="image" class="logo-empress" src=""/>
                                <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                                    <span id="id-user-op" class="block m-t-xs font-bold"></span>
                                    <span class="text-muted text-xs block"></span>
                                </a>
                            </div>
                        </li>
                        <li>
                        </li>

                        <li>
                            <a href="select.php" style=""><i class="fa fa-headphones"></i> <span class="nav-label">SEelect</span></a>
                        </li>

                        
                    </ul>
                </div>
            </nav>
            <div id="page-wrapper" class="gray-bg">
                <div class="row border-bottom">
                    <nav class="navbar navbar-static-top" role="navigation">
                        <div class="navbar-header" style="display: none;">
                            <a class="navbar-minimalize minimalize-styl-2 btn btn-main" href="#"><i class="fa fa-bars"></i> </a>
                        </div>
                        <ul class="nav navbar-top-links navbar-right" style="display: none;">
                            <li>
                                <span class="m-r-sm text-muted welcome-message">#mnb</span>
                            </li>
                            <li>
                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                    <i class="fa fa-question-circle"></i>
                                </a>
                                <ul class="dropdown-menu dropdown-alerts">
                                    <!--<li>
                                        <a href="#" class="dropdown-item">
                                            <div>
                                                <i class="fa fa-book fa-fw"></i>
                                                Manual
                                                <span class="float-right text-muted small"></span>
                                            </div>
                                        </a>
                                    </li>-->
                                    <li class="dropdown-divider"></li>
                                    <li>
                                        <a href="#" class="dropdown-item info-help">
                                            <div>
                                                <i class="fa fa-info-circle fa-fw"></i>
                                                Botones<br>
                                                <div>Buscar</div><div><button class="btn btn-primary"> <i class="fa fa-search"></i></button></div>
                                                <div>Editar</div><div><button class="btn btn-success"> <i class="fa fa-pencil"></i></button></div>
                                                <!--<div>Revisión</div><div><button class="btn btn-danger"> <i class="fa fa-binoculars"></i></button></div>
                                                <div>Botón bloqueado</div><div><button class="btn btn-lock"> <i class="fa fa-lock"></i></button></div>-->
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" class="sign-out">
                                    <i class="fa fa-sign-out"></i> Salir
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>