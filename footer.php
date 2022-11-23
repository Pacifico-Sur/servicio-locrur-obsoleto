				<?php

				//defined('BASEPATH') OR exit('No direct script access allowed');

				?>
      			<div class="footer">
                    <div class="float-right">
                        <!--<strong>Servicio de Transportes Electricos de la</strong>.-->
                    </div>
                    <div>
                    	CENTRO GEO
                    </div>
                </div>
        <script src="js-geo/jquery-3.6.0.min.js"></script>
        <script src="js-geo/jquery.min.js"></script>
		<script src="js-geo/plugins/footable/footable.js"></script>
		<script src="js-geo/plugins/swiper/swiper.js"></script>
        <script src="js-geo/plugins/popper/popper.min.js"></script>
        <script src="js-geo/bootstrap.js"></script>
        <script src="js-geo/plugins/metisMenu/jquery.metisMenu.js"></script>
        <script src="js-geo/plugins/slimscroll/jquery.slimscroll.min.js"></script>
        <script src="js-geo/inspinia.js"></script>
        <script src='js-geo/jquery-ui.min.js'></script>
		<script src="js-geo/plugins/confirm/jquery-confirm.js"></script>
		<script src="js-geo/plugins/selectize/selectize.js"></script>
		<script src="js-geo/plugins/validations/validations.js"></script>
		<script src="js-geo/jquery.cookie.js"></script>
		<script src="js-geo/plugins/ladda/spin.min.js"></script>
	    <script src="js-geo/plugins/ladda/ladda.min.js"></script>
	    <script src="js-geo/plugins/ladda/ladda.jquery.min.js"></script>
	    <script src="https://cdn.maptiler.com/maplibre-gl-js/v2.4.0/maplibre-gl.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
	 	<script type="text/javascript">
	 		var initMod = (function() {
				"use strict"

				var apiJson = {
						controller: 'Control',
						methods: {
							//'modelo' : '',
			            	'sites_access': '',
			            	'json': ''
			            },
					},
					apiJsonLogOut = {
						controller: 'SessionSecurity',
						methods: {
			            	'salir': '',
			            	'json': ''
			            },
					},
					apiSetTheme = {
						controller: 'Control',
						methods: {
			            	'theme': { data: ''},
			            	'json': ''
			            },
					},
					apiJsonRealTimeReq = {
						controller: '',
						methods: {
			            	'real-time-request': { data: ''},
			            	'json': ''
			            },
					},
					currentModule,
					dataSitesAccess,
					currentSetTime,
					def = $.Deferred(),
					p = def.promise();

				var callSetTime = function(sel, val) {
					setTimeout(function(){
	            		if (typeof val !== 'undefined') {
			            	sel.setValue(val);
						}else {
							//sel.setValue();
						}
	            	},100);
				}

				var imgFormat = function(x) {
					return "<div class='content-image'><img src='images/" + x + "'></div>";
				}

				var affirmFormat = function(x) {
					return x == 'S' ? 'Sí' : 'No';
				}

				var breakField = function(x) {
					return "<div class='obs-field'>" + x + "</div>";
				}

				var months = {'01':'enero','02':'febrero','03':'marzo','04':'abril','05':'mayo','06':'junio','07':'julio','08':'agosto','09':'septiembre','10':'octubre','11':'noviembre','12':'diciembre'};
				
				var dateFormat = function(x) {
					var f = x.split("-");
					return f[2] + " " + months[f[1]] + " " + f[0];
				}

				var dateTimeFormatDiv = function(x) {
					var fecha = x.fecha_hora_servicio,
						t = fecha.split(" "),
						f = t[0].split("-"),
						fecha_reg = x.fecha_registro,
						r = fecha_reg.split(" "),
						check_edit = currentDate() > fecha ? 'disabled-edit-date' :'',
						date_estatus = t[0] > r[0] ? 'is-apartado' :'not-apartado';
					//return "<div class='check-time' data-time='" + fecha + "' data-added='" + fecha_reg + "'>" + f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1] + "</div>";
					return "<div class='" + check_edit + " " + date_estatus + "' data-fecha='" + f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1] + "'>" + f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1] + "</div>";
				}

				var dateTimeFormatHis = function(x) {
					var t = x.split(" ");
					var f = t[0].split("-");
					//return "<div class='check-time' data-time='" + fecha + "' data-added='" + fecha_reg + "'>" + f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1] + "</div>";
					return "<div>" + f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1] + "</div>";
				}

				var justFormat = function(x) {
					var t = x.split(" ");
					var f = t[0].split("-");
					//return "<div class='check-time' data-time='" + fecha + "' data-added='" + fecha_reg + "'>" + f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1] + "</div>";
					return f[2] + " " + months[f[1]] + " " + f[0] + " " + t[1];
				}

				var dateFormatMXNoTime = function(x) {
					var t = x.split(" ");
					var f = t[0].split("-");
					return f[2] + "-" + months[f[1]] + "-" + f[0];
				}

				var dateNoDate = function(x) {
					var t = x.split(" ");
					var f = t[1].split(":");
					return f[0] + ":" + f[1];
				}

				var dateNoTime = function(x) {
					var t = x.split(" ");
					var f = t[0].split("-");
					return f[2] + "-" + f[1] + "-" + f[0];
				}

				var canceledRow = function(x) {
					if (x == 'CANCELADO') {
						return "<div class='canceled-row'>" + x +  "</div>";
					}else {
						return "<div class='not-canceled-row'>" + x +  "</div>";
					}
				}

				var markText = function(x) {
					if (x != null) {
						return "<div class='mark-text show-conductor'>" + x +  "</div>";
					}else {
						return "<div>" + x +  "</div>";
					}
					
				}

				var normalFormat = function(x) {
					return "<div class='normal-format'>" + x +  "</div>";
				}

				var currentDate = function() {
					var dt = new Date();
					var time = ((dt.getHours() + 1)< 10 ? '0' : '') + (dt.getHours()) + ":" + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes() + ":00";
					return dt.getFullYear() + "-" + ((dt.getMonth() + 1)< 10 ? '0' : '') + (dt.getMonth() + 1) + '-' + ((dt.getDate() + 1)< 10 ? '0' : '') + (dt.getDate()) + ' ' + time;
				}

				var currentDateNoTime = function() {
					var dt = new Date();
					return dt.getFullYear() + "-" + ((dt.getMonth() + 1)< 10 ? '0' : '') + (dt.getMonth() + 1) + '-' + ((dt.getDate() + 1)< 10 ? '0' : '') + (dt.getDate());
				}

	            var getFormData = function(form_data, values, name) {
				  	if(!values && name)
				        form_data.append(name, '');
				    else{
				        if(typeof values == 'object'){
				        	var key;
				            for(key in values){
				                if(typeof values[key] == 'object')
				                    getFormData(form_data, values[key], name + '[' + key + ']');
				                else {
				                	if (typeof name !== 'undefined')
				                    form_data.append(name + '[' + key + ']', values[key]);
				                }
				            }
				        }else
				            form_data.append(name, values);
				    }
				    return form_data;
				}

				var objectifyForm = function(formArray) {//serialize data function
				  var returnArray = {};
				  for (var i = 0; i < formArray.length; i++){
				    returnArray[formArray[i]['name']] = formArray[i]['value'];
				  }
				  return returnArray;
				}

				var getInitResponse = function() {
					
					initMod.apiCall(apiJson).then(function(res){
						/*console.log("res iiiii");
						console.log(res);*/
						//dataSitesAccess = res.sites_access;
						
						applyAccessRestrictions();
					}, function(reason, json){
					 	debugThemes(reason, json);
					});
				}

				var applyAccessRestrictions = function() {
					return;
					var current_path = document.location.pathname.match(/[^\/]+$/);
					if (current_path == null) {
						current_path = ["index.php"];
					}

					$("[href$='index.php']").parent("li").addClass('access-section');

					var curr_href = $( "a[href='" + current_path[0] + "']" ).parent();

					curr_href.addClass('active');

					var parent_curr = curr_href.closest(".cont-second-level");


					if (parent_curr.length > 0) {
						parent_curr.addClass('active');
						parent_curr.children("a").attr({ 'aria-expanded': true })
						parent_curr.children("ul").attr({ 'aria-expanded': true }).addClass('in');
					}

					console.log("dataSitesAccess");
					console.log(dataSitesAccess);
					jQuery.each(dataSitesAccess, function(i, value) {
						$("[href$='" + value + "']").parent("li").addClass('access-section');
						$("[href$='" + value + "']").closest(".cont-second-level").addClass('access-section');
					});
					//$(".nav.metismenu>li:not(.nav-header):not(.access-section)").html('');
					$(".nav.metismenu li:not(.nav-header):not(.access-section)").html('');
				}

				var validateNoAccessUser = function(x) {
					if (x['none-access']) {
						location.href = "login.php";
						return true;
					}
				}

				var initModule = function() {
					var this_module = $(".get-module").attr('data-module');
					var script = document.createElement("script");
				    script.type = "text/javascript";
				    script.src = 'js-geo/modules/' + this_module + '.js';
				    script.onload = function(){
				        currentModule = window[this_module];
						if (typeof currentModule === "") {console.log("no existe funcion " + this_module)}
						currentModule.init();
				    };
				    document.body.appendChild(script);
				}

				var apiCall = function(data) {
			        return $.ajax({
			            url: 'ApiControl/index.php',
			            type: 'GET',
			            dataType: 'json',
						data: data
			        });
			    };

			    var apiCallExcel = function(data) {
			        return $.ajax({
			            url: 'ApiControl/index.php',
			            type: 'GET',
			            contentType: "application/vnd.ms-excel",
						data: data
			        });
			    };

			    var apiCallAlter = function(data) {
			        return $.ajax({
			            url: 'ApiControl/index.php',
			            type: 'POST',
			            dataType: 'json',
						data: data,
						processData: false,
        				contentType: false,
        				cache: false,
			        });
			    };

			    var jsonRealData = function() {
					return rtrJson;			    	
			    }

			    var rtrJson;

			    var ring_draw = false;

			    var r_draw = function() {
			    	return ring_draw;
			    }

			    var setRealTimeReq = function(section, lastUpdate, numberRecords, lastId, ft, apart = "") {
			    	rtrJson = {
			    		'last_id': lastId,
			    		'last_update': lastUpdate,
			    		'number_records': numberRecords,
			    	}
			    	/*console.log("rtrJson set ");
			    	console.log(rtrJson);*/
			    	setTimeout(function(){
						currentSetTime = setInterval(function() {
							apiJsonRealTimeReq.controller = section;
							apiJsonRealTimeReq.methods['real-time-request']['data'] = jsonRealData();

							var date_end = initMod.currentDateNoTime() + " " + "23:59:59";

							initMod.apiCall(apiJsonRealTimeReq).then(function(res){

								/*console.log("res settime");
								console.log(res);*/
								
								if (res['none-last'] == "none") {
									ring_draw = false;
									return
								}

								if (typeof res['servicio-add'] !== 'undefined' && apart == "") {
									$.each(res['servicio-add'], function( i, v ) {
										if (v.fecha_hora_servicio <= date_end) {
											ft.rows.add(v, false);
										}
									});
									//ft.draw(true);
									ring_draw = true;
								}

								if (typeof res['servicio-up'] !== 'undefined') {
									var id_arr = [], a = 0, l = res['servicio-up'].length;
									while( a < l ) {
									    id_arr.push(res['servicio-up'][a].id_servicio);
									    ++a;
									}
									var all = ft.rows.all;
									var a = 0, l = all.length;
									while( a < l ) {
									    if (id_arr.indexOf(parseInt(ft.rows.all[a].value.id_servicio)) !== -1) {
											$.each( res['servicio-up'], function( key, value ) {
											  	ft.rows.all[a].val(value, false);
											  	if (value.fecha_hora_servicio > date_end) {
													ft.rows.all[a].delete();
												}
											});
									    }
									    ++a;
									}
									ring_draw = true;
								}
								rtrJson.last_update = res['last-update'];
								rtrJson.last_id = res['last-id'];
							}, function(reason, json){
								console.log("non");
							 	initMod.debugThemes(reason, json);
							});
				    	}, 3000);
				    },1500);
			    };

			    var stopCurrentSetTime = function() {
			    	clearInterval(currentSetTime);
			    };

			    var btnSalir = function() {
			        apiCall(apiJsonLogOut).then(function(res){
						location.href = "login.php";
					}, function(reason, json){
					 	//debugThemes(reason, json);
					 	location.href = "login.php";
					});
	      		};

			    var btnThemes = function() {
			    	if (this.id == 'b-theme') {
			    		$("body").addClass("b-theme");
			    	}else {
			    		$("body").removeClass("b-theme");
			    	}
			    };

			    var debugThemes = function(x, y) {
			    	console.log("Error en la peticion", x);
					console.log("Json enviado", y);
			    };

				var miCalendar = function(x, y, z){
					var json_cal = {
				        input: "f-servicio-" + x,
				        date_format:"d M Y"
					}
					if (typeof y === 'undefined') {
						json_cal.selected_date = "today";
					}
					if (typeof z !== 'undefined') {
						json_cal.start_date = 'today + 1';
					}
					
					new ng.Calendar(json_cal);
				};

				var themeSelect = function() {
					var id_theme = $(this).attr('data-theme');
					apiSetTheme.methods['theme']['data'] = {theme: id_theme};
					apiCall(apiSetTheme).then(function(res){
						$("body").attr("id", "app-site-" + id_theme);
					}, function(reason, json){
						debugThemes(reason, json);
					});
				}

			    var bindTheme = function() {
			        $(".btn-themes").on("click", btnThemes);
			        $('.sign-out').on("click", btnSalir);
			        $('.btn-theme').on("click", themeSelect);
			        
			    };

				var init = function () {
					initModule();
					console.log("kalmah")
					//getInitResponse();
					bindTheme();
					//initModule();
			    };

				return {
				    init : init,
				    affirmFormat: affirmFormat,
				    apiCall : apiCall,
				    apiCallAlter: apiCallAlter,
				    apiCallExcel: apiCallExcel,
				    breakField: breakField,
				    callSetTime: callSetTime,
				    canceledRow: canceledRow,
				    currentDate: currentDate,
				    currentDateNoTime: currentDateNoTime,
				    debugThemes: debugThemes,
				    dateNoDate: dateNoDate,
				    dateNoTime: dateNoTime,
				    dateTimeFormatDiv: dateTimeFormatDiv,
				    dateTimeFormatHis: dateTimeFormatHis,
				    justFormat: justFormat,
				    markText: markText,
				    miCalendar:miCalendar,
				    normalFormat: normalFormat,
				    objectifyForm: objectifyForm,
				    getFormData: getFormData,
				    r_draw: r_draw,
				    setRealTimeReq: setRealTimeReq,
				    validateNoAccessUser: validateNoAccessUser,
				    jsonRealData: jsonRealData
				}
			})();

			//$(document).ready(initMod.init);//este siempre se ejecuta debido a que está en el footer
			initMod.init();

	  	</script>
	  	<script src="js-geo/plugins/lineUp/pace.min.js"></script>
    </body>
</html>