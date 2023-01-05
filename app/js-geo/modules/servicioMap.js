var servicioMap = (function() {
	"use strict"

	var this_module = "servicioMap",
		module_upper = "ServicioMap",
		module_one = "servicioMap",
		apiDataAll = {
			controller: module_upper,
			methods: {
            	['all_' + this_module]: '',
            	'json': ''
            },
		},
		/*limit_in = 0,
		limit_data = 200,*/
		apiDataAllFilter = {
			controller: module_upper,
			methods: {
            	['all_filter_' + this_module]: { data: ""},
            	'json': ''
            },
		},
		apiDataCoords = {
			controller: module_upper,
			methods: {
            	['coords']: { data: ""},
            	'json': ''
            },
		},
		apiDataLate = {
			controller: module_upper,
			methods: {
				'estados': '',
				'municipios': '',
				//'localidades': '',
				'temas': '',
				'subtemas': '',
				'indicadores': '',
            	'json': ''
            },
		},
		apiDataLateNA = {
			controller: module_upper,
			methods: {
				'na':  { data: ''},
            	'json': ''
            },
		},
		apiDataLateMore = {
			controller: module_upper,
			methods: {
				'some_localidades':  { data: ''},
            	'json': ''
            },
		},
		apiDataInfografia = {
			controller: module_upper,
			methods: {
            	['infografias']: { data: ""},
            	'json': ''
            },
		},
		apiDataLateFormat = {
			controller: module_upper,
			methods: {
				'estados_format': '',
				'municipios_format': '',
            	'json': ''
            },
		},
		apiDataLocalidades = {
			controller: module_upper,
			methods: {
				'localidades': '',
            	'json': ''
            },
		},
		apiDataForm = {
			controller: module_upper,
			methods: {
            	['add-' + module_one]: { data: ''},
            	//'add-animal': 1,
            	'json': ''
            },
		},
		apiDataUp = {
			controller: module_upper,
			methods: {
            	['update-' + module_one]: { data: ''},
            	'json': ''
            },
		},
		apiDataExcel = {
			controller: module_upper,
			methods: {
            	"export-excel":  { data: ""},
            	//'json': ''
            },
		},
		apiDataPdf = {
			controller: module_upper,
			methods: {
            	"export-pdf":  { data: ""},
            	//'json': ''
            },
		},
		apiDataExport = {
			controller: module_upper,
			methods: {
            	"export":  { data: ""},
            	'json': ''
            },
		},
		all_data_tab,
		all_estados,
		all_municipios,
		all_localidades,
		all_temas,
		all_subtemas,
		all_indicadores,
		all_na,
		all_descindicadores,
		all_estados_format,
		all_municipios_format,
		nom_ind = {NOM_LOC : "LOCALIDAD"},
		select_estado = $("#select-estado"),
		select_municipio = $("#select-municipio"),
		select_localidad = $("#select-localidad"),
		select_tema = $("#select-tema"),
		select_descsubtema = $("#select-descsubtema"),
		select_subtema = $("#select-subtema"),
		select_subtema_id = $("#select-subtema-id"),
		select_anio = $("#anio"),
		select_anio_na = $("#anio-na"),
		select_metodo = $("#select-metodo"),
		select_na = $("#select-na"),
		btn_excel = $("#icono-excel"),
		btn_pdf = $("#icono-pdf"),
		btn_export = $("#icono-export"),
		check_all = $("#check-all"),
		loc_pp,
		check_indicadores = $("#check-indicadores");

	var limit_in,
		long_data = 10000,		//set max res for request
		post_resp;

	var limitConfig = function() {
		var jmet = apiDataAllFilter.methods;
		$.each(jmet, function(propName, propVal) {
		  	if (typeof propVal.data != 'undefined') {
		  		propVal.data.limit_in = limit_in;
		  		propVal.data.limit_data = long_data;
		  	}
		});
	}

	var getPostResponse = function(ft) {
		if (!post_resp) return;
		limit_in = limit_in + long_data;
		limitConfig();
		initMod.apiCall(apiDataAllFilter).then(function(res){
			all_data_tab = res.vulnerabilidad;
			if (all_data_tab.length > 0) {
				ft.rows.load(all_data_tab, true);
			}else {
				l.ladda( 'stop' );
				post_resp = false;
				/*btn_excel.show();
				btn_pdf.show();*/
				btn_export.show();
			}
		}, function(reason, json){
			console.log("err post");
			l.ladda( 'stop' );
		 	initMod.debugThemes(reason, json);
		});
	}

	var getInitResponse = function() {
		limit_in = 0;
		post_resp = true;

		limitConfig();

		initMod.apiCall(apiDataAllFilter).then(function(res){
			console.log("res de nuestro nuevo modulo" + module_upper);
			console.log(res);
			$(".res-error").hide();
			$(".res-x").show(500);
			if ($("#debug").val() == 'debug') {
				$(".res-x").html("send: " + JSON.stringify(res.x));
				$(".res-sql").html("sql: " + res.sql);
			}

			var all_data_tab = res.vulnerabilidad, header = [], ii = 0;
			if (all_data_tab.length > 0) {
				$.each(all_data_tab[0], function(i, v) {
					var width = 100; 
					if (i == "ID") {
						width = 20;
						return;
					}
			        var yeison = { "name": i,"title": nom_ind[i], "style":{"width":width,"maxWidth":width} };
					/*if (i == "ID_ENT") yeison.formatter = "select.getEstadoFormat";
					if (i == "ID_MUN") yeison.formatter = "select.getMunicipioFormat";*/
			        if (ii > 4) yeison.breakpoints = "all";
			        header.push(yeison);
			        ii++;
			    });
			}else {
				header = [{ name: "", title: "", "style":{"width":20,"maxWidth":20} }];
			}

			$('#footable-list').empty();
			$('#footable-list-cube').empty();
			
			var ft = FooTable.init('#footable-list', {
				"columns": header,
				"rows": all_data_tab,
				"empty": "La selección no arroja ninguna localidad",
                'on': {
                    'postdraw.ft.table': function(e, ft) {
                    	console.log("kam");
                        getPostResponse(ft);
                    }
                }
			},function(ft){
				console.log("human fates");
		    });
		}, function(reason, json){
			console.log("non");
			l.ladda( 'stop' );
			if ($("#debug").val() == 'debug') {
				$(".res-error").html("Error msg: " + reason.responseText).show(1000);
			}else {
				$(".res-error").html("Error en la consulta").show(1000);
			}
		 	initMod.debugThemes(reason, json);
		});
	}

	var getInitResponseCube = function() {
		limit_in = 0;
		post_resp = true;

		limitConfig();

		initMod.apiCall(apiDataAllFilter).then(function(res){
			console.log("res de nuestro nuevo modulo" + module_upper);
			console.log(res);
			$(".res-error").hide();
			if ($("#debug").val() == 'debug') {
				$(".res-x").html("send: " + JSON.stringify(res.x));
				$(".res-sql").html("sql: " + res.sql);
			}

			var all_data_tab = res.vulnerabilidad, header = [], ii = 0;
			if (all_data_tab.length > 0) {
				$.each(all_data_tab[0], function(i, v) {
					var width = 100; 
					if (i == "ID") {
						width = 20;
					}
			        var yeison = { "name": i,"title": nom_ind[i], "style":{"width":width,"maxWidth":width} };
					/*if (i == "ID_ENT") yeison.formatter = "select.getEstadoFormat";
					if (i == "ID_MUN") yeison.formatter = "select.getMunicipioFormat";*/
			        if (ii > 4) yeison.breakpoints = "all";
			        header.push(yeison);
			        ii++;
			    });
			}else {
				header = [{ name: "id", title: "ID", "style":{"width":20,"maxWidth":20} }];
			}

			$('#footable-list').empty();
			$('#footable-list-cube').empty();
			
			var ft = FooTable.init('#footable-list-cube', {
				"columns": header,
				"rows": all_data_tab,
                'on': {
                    'postdraw.ft.table': function(e, ft) {
                    	console.log("kam");
                        getPostResponse(ft);
                    }
                }
			},function(ft){
				console.log("human fates");
		    });
		}, function(reason, json){
			console.log("non");
			l.ladda( 'stop' );
			if ($("#debug").val() == 'debug') {
				$(".res-error").html("Error msg: " + reason.responseText).show(1000);
			}else {
				$(".res-error").html("Error en la consulta").show(1000);
			}
		 	initMod.debugThemes(reason, json);
		});
	}

	var selectEstado = function(x) {
	    /*$.each(all_estados, function(i, v) {
	        select_estado.append(new Option(v.NOMGEO, v.ID_ENT));
	    });*/

	    var i = 0, len = all_estados.length;
	    while (i < len) {
	    	console.log("esttta oo");
	    	console.log(all_estados[i]);
	       	select_estado.append(new Option(all_estados[i].NOMGEO, all_estados[i].ID_ENT));
	        i++
	    }
    }

    var changeEstado = function() {
    	id_source_collection = "";
    	$(".na").hide(400);
	    $(".mapats").hide(400);
	    select_metodo.val("");
    	var value = $(this).val();
    	console.log("value");
	    console.log(value);
	    select_municipio.val("");
	    /*$("#select-localidad").val("");
	    $("#select-localidad-id").val("");
	    select_localidad.prop("disabled", true);*/
    	if (value != "") {
    		selectMunicipio(value);
    		select_municipio.prop("disabled", false);
    	}else {
    		select_municipio.prop("disabled", true);
    		
    	}
    }

    var selectMunicipio = function(x) {
		var indata = $.map(all_municipios, function( item ) {
			if (x == item.ID_ENT) {
				return {
	             	label: item.NOMGEO,
		            value: item.ID_MUN,
	            }
			}
        });
        select_municipio.autocomplete({
	      	minLength: 0,
	      	source: indata,
	      	select: function( event, ui ) {
	      		if (ui.item.value > 0) {
	      			$(".na").hide(400);
	    			$(".mapats").hide(400);
	    			select_metodo.val("");
	      			console.log("change select");
	      			console.log(ui.item.value);
	      			//selectNa();
	      		}
		        select_municipio.val( ui.item.label );
		        $("#select-municipio-id").val( ui.item.value );
		        return false;
	      	},
	      	change: function( event, ui ) {
	      		if (ui.item == null) {
	      			$("#select-municipio-id").val("");
	      		}
	      	},
	      	close: function( event, ui ) {
	      		if (select_municipio.val() == "") {
	      			$("#select-municipio-id").val("");
	      		}
	      	}
	    }).focus(function () {
		    $(this).autocomplete("search");
		})
	    .autocomplete( "instance" )._renderItem = function( ul, item ) {
	      	return $( "<li>" )
	        //.append( "<div>" + item.label + "<br>" + item.telefono + "</div>" )
	        .append( "<div>" + item.label + "</div>" )
	        .appendTo( ul );
	    };
	    if (typeof x !== 'undefined') {
	    	//select_municipio.data('ui-autocomplete')._trigger('select', 'autocompleteselect', {item:{value:x}});
	    }
    }

    var selectLocalidad_ = function(x) {
    	$("#select-localidad").html("");
		var indata = $.map(all_localidades, function( item ) {
            if (x == item.ID_MUN && select_estado.val() == item.ID_ENT) {
				return {
	             	label: item.NOM_LOC,
		            value: item.CGLOC,
	            }
			}
        });
        $("#select-localidad").on( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).autocomplete( "instance" ).menu.active ) {
					event.preventDefault();
				}
			}).autocomplete({
	      	minLength: 0,
	      	source: function( request, response ) {
					// delegate back to autocomplete, but extract the last term
					response( $.ui.autocomplete.filter(
						indata, extractLast( request.term ) ) );
				},
	      	//source: indata,
	      	select: function( event, ui ) {
	      		if (ui.item.value > 0) {
	      			//selectAutoDirec(x, ui.item.value);
	      		}
	      		console.log("this.valuesss");
	      		console.log(this.value);
	      		var terms = split( this.value );
				// remove the current input
				terms.pop();
				// add the selected item
				terms.push( ui.item.label );
				// add placeholder to get the comma-and-space at the end
				terms.push( "" );
				this.value = terms.join( ", " );
				return false;


		        $("#select-localidad").val( ui.item.label );
		        $("#select-localidad-id").val( ui.item.value );
		        return false;
	      	},
	      	change: function( event, ui ) {
	      		if (ui.item == null) {
	      			$("#select-localidad-id").val("");
	      		}
	      	},
	      	close: function( event, ui ) {
	      		if ($("#select-localidad").val() == "") {
	      			$("#select-localidad-id").val("");
	      		}
	      	}
	    }).focus(function () {
		    $(this).autocomplete("search");
		})
	    .autocomplete( "instance" )._renderItem = function( ul, item ) {
	      	return $( "<li>" )
	        //.append( "<div>" + item.label + "<br>" + item.telefono + "</div>" )
	        .append( "<div>" + item.label + "</div>" )
	        .appendTo( ul );
	    };
	    if (typeof x !== 'undefined') {
	    	//$("#select-localidad").data('ui-autocomplete')._trigger('select', 'autocompleteselect', {item:{value:x}});
	    }
	    $("#select-localidad").prop("disabled", false);
    }

    select_localidad = $('#select-localidad');
    var selectLocalidad = function(x) {
    	var indata = $.map(all_localidades, function( item ) {
            if (x == item.ID_MUN && select_estado.val() == item.ID_ENT) {
				return {
	             	localidad: item.NOM_LOC,
		            id_localidad: item.CGLOC,
	            }
			}
        });
        $("#select-localidad").prop("disabled", false);
        var keys = ['id_localidad', 'localidad', select_localidad,indata];
        var selectForm = resetSelect(keys[2]);
        selectForm.selectize({
            plugins: ["remove_button"],
            delimiter: ",1349,",
            valueField: keys[0],labelField: keys[1],searchField: keys[1], options: keys[3],
            persist: false,
            create: false,
            sortField: "id_localidad",
            render: { option: function(item, escape) { return '<div><span class="name">' + escape(item[keys[1]]) + '</span></div>' } },
            onInitialize: function () {
                var selectize = this;
                selectize.addOption({id_localidad: -1, localidad: 'Todos'});
                callSetTime(selectize, -1);
            },
			onChange: function(value) {
				console.log("valll");
				console.log(value);
				var selectize = this;
				if (value == null) {
					console.log("vacio");
					selectize.addOption({id_localidad: -1, localidad: 'Todos'});
				}else if (value.indexOf(-1) != -1 && value.length == 1) {
					console.log("encontrado");
					/*$('#select-submarca').prop("disabled", false);
					selectSubmarcas(y);*/
				}else if (value.length > 1) {
					console.log("tiene 2");
					selectize.removeItem(-1);
					/*var selectize = this;
	                selectize.addOption({id_localidad: "burzum", localidad: 'Todosss'});*/
				}
          	},
        });
    };

    var split = function( val ) {
		return val.split( /,\s*/ );
	}
	var extractLast = function( term ) {
		return split( term ).pop();
	}

	var resetSelect = function(x) {
        var sf = "";
        $.each(x, function(i) {
            var sel = $(this);
            if(sel[0].selectize) {
                sel[0].selectize.destroy();
            }
            if (i == 0) sf = sel;
        });
        return sf;
    }

    var callSetTime = function(sel, val) {
        setTimeout(function(){
            if (typeof val !== 'undefined') {
                sel.setValue(val);
            }else {
                //sel.setValue();
            }
        },100);
    }

    var changeAnio = function() {
    	selectSubtema(1);
    	//selectSubtema.val(1).trigger('change');
    }

    var changeAnioNA = function() {
    	apiDataLateNA.methods['na']['data'] = {
    		anio: select_anio_na.val(),
			id_estado: select_estado.val(),
			id_municipio: $("#select-municipio-id").val()
		}
		console.log("apiDataLateNA na");
    	console.log(apiDataLateNA);

    	initMod.apiCall(apiDataLateNA).then(function(res){
    		console.log("ressssa na");
    		console.log(res);
    		$(".na").show(500);
    		all_na = res.na;
    		selectNa();
		}, function(reason, json){
		 	initMod.debugThemes(reason, json);
		});
    }

    var id_source_collection;

    var active_map_btns = true;

    var changeMetodo = function() {
    	var id_n = $(this).val();
    	$(".na").hide();
	    $(".mapats").hide();
	    $(".depend-anio").hide();
	    $("figure.depend-content").hide();
	    $('#footable-list').hide();
	    $('.anio-na').hide();
    	if (id_n == 1) {
    		
	    	//selectNa();
	    	$('.anio-na').show(500);
	    	changeAnioNA();

	    	
    	}else if (id_n == 2) {
	    	$(".mapats").show(500, function() {
	    		console.log("bout");
		    	mapProp = {
			      	container: 'poligonos-maps',
			        style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=06zOCKtkxeyIoiFMws3p',
			        center: [-91.97363682, 17.91143118],
					zoom: 5
			    };
		    	map = $("#poligonos-maps").length ?  new maplibregl.Map(mapProp) : false;

		    	var coords_estados;
		    	var coords_municipios;
		    	var coords_pp;
		    	if (1) {
		    		active_map_btns = false;
			    	map.on('mousemove', 'poligonoaaaa', map_mousemove);
			        map.on('mouseleave', 'poligonoaaaa', map_mouseleave);
			        map.on('click', 'poligonoaaaa', map_click);
			    }

		        if ($("#select-municipio-id").val() != "" && select_estado.val() != "") {
		        	apiDataCoords.methods['coords']['data'] = {
						id_municipio: $("#select-municipio-id").val(),
						id_estado: select_estado.val(),
					}
		        	initMod.apiCall(apiDataCoords).then(function(res){
		        		id_source_collection = { type: 'FeatureCollection', features: [] };
						console.log("ress coords");
	    				console.log(res);
	    				coords_estados = res.estados.features;
						id_source_collection.features = id_source_collection.features.concat(coords_estados);

				        getPoligonShapes(id_source_collection);

				        setTimeout(function() {
				        	coords_municipios = res.municipios.features;
							id_source_collection.features = id_source_collection.features.concat(coords_municipios);
				          	getPoligonShapesAddLoop(id_source_collection);
				          	mapFlyTo(res.municipios_center, 9, 0, 0);
				          	//map.setPaintProperty("test", 'fill-color', '#ffffcc');
				          	
				        }, 500);

				        setTimeout(function() {
				        	coords_pp = res.agrupaciones.features;
							id_source_collection.features = id_source_collection.features.concat(coords_pp);
				          	getPoligonShapesAddLoop(id_source_collection);
				          	//map.setPaintProperty("poligonccc", 'fill-color', '#f03b20');
				        }, 3000);
					}, function(reason, json){
					 	initMod.debugThemes(reason, json);
					});
		        	
		        }
	        });

    	}
    }

    var getPoligonShapesAddLoop = function(jsonPol) {
    	map.getSource('diamolical').setData(jsonPol);
    }

    var getPoligonShapesAddLoop2 = function(jsonPol) {
    	map.addSource('dimmu', {
            'type': 'geojson',
            'data': jsonPol,
            'generateId': true
        });

		map.addLayer({
			'id': 'poligonccc',
			'type': 'fill',
			'source': 'dimmu',
			'layout': {},
			'paint': {
				'fill-color': '#bd0026'
			}
		});
    }

    var mapProp;
    var map;
    var hoveredStateId = null;

	var getPoligonShapes = function(jsonPol) {
		map.addSource('diamolical', {
            'type': 'geojson',
            'data': jsonPol,
            'generateId': true
        });
        map.addLayer({
			'id': 'poligonoaaaa',
			'type': 'fill',
			'source': 'diamolical',
			'layout': {},
			//"source-layer": "waterway",
			'paint': {
				'fill-color': [
					'interpolate',
					['linear'],
					['get', 'agalloch'],
					1,
					"#73AF48",
					2,
					"#EDAD08",
					3,
					"#94346E",
					4,
					"#E17C05",
					5,
					"#CC503E",
					6,
					"#0F8554",
					7,
					"#1D6996",
					8,
					"#38A6A5",
					9,
					"#5F4690",
					93,
					'#276252',
					1349,
					'#e24e4d'
				],
				'fill-opacity': 0.5
				}
		});
    }

    var ventana_ancho = $(window).width(), str_len_cin = 90, str_len_ses = 160, str_len_cua = 40;
    var allPage = $('html, body');

    var mapFlyTo = function(center, z, b, p) {

    	//if (ventana_ancho <= 600) {
    		//var winTam = ventana_ancho <= 600 ? 530 : ventana_ancho < 1680 ? 530 : 530;
			allPage.stop().animate({scrollTop: 490}, 1400);
    	//}

    	if (b > 0) {
    		var beari = b,
    			pit = p,
    			offs = [-50, -50];
    		if (ventana_ancho <= 600) {
	    		offs = [120, 50];
	    	}
    	}else {
    		var beari = 0,
    			pit = 0,
    			offs = [0, 0];
    	}
    	map.flyTo({
			// These options control the ending camera position: centered at
			// the target, at zoom level 9, and north up.
			center: center,
			zoom: z,
			bearing: beari,
			pitch: pit,
			offset: offs,
			 
			// These options control the flight curve, making it move
			// slowly and zoom out almost completely before starting
			// to pan.
			speed: 0.9, // make the flying slow
			//curve: 1, // change the speed at which it zooms out
			 
			// This can be any easing function: it takes a number between
			// 0 and 1 and returns another number between 0 and 1.
			easing: function(t) {
				return t;
			},
			 
			// this animation is considered essential with respect to prefers-reduced-motion
			essential: true
		});
    }

    var map_mousemove = function(e) {
    	console.log("moussss");
    	map.getCanvas().style.cursor = 'pointer';
		if (e.features.length > 0) {
			if (hoveredStateId) {
				map.setFeatureState(
					{ source: 'diamolical', id: hoveredStateId },
					{ hover: false }
				);
			}
			hoveredStateId = e.features[0].id;
			map.setFeatureState(
				{ source: 'diamolical', id: hoveredStateId },
				{ hover: true }
			);
		}
	};

	var map_mouseleave =  function() {
		console.log("moussss 2click");
		map.getCanvas().style.cursor = '';
		if (hoveredStateId) {
			map.setFeatureState(
				{ source: 'diamolical', id: hoveredStateId },
				{ hover: false }
			);
		}
		hoveredStateId = null;
	};

	var html_done,
    	listenerValidation = false,
    	center_ring;

	var map_click = function(e) {
		console.log("moussss lclick");

  		/*map.getSource('diamolical').setData({
	      "type": "FeatureCollection",
	      "features": e.features
	    });*/
        var id_ = e.features[0].properties.id_poligono_pp;
        console.log("id_ isengard");
  		console.log(id_);
  		if (typeof id_ === 'undefined') {
  			return;
  		}
  		var label = id_.split("-");
  		$("#res-click-map").html(label[1]);

  		btn_export.hide();
		$('#footable-list').hide(200);
    	if (listenerValidation) {
  			//return;
  		}else {
  			listenerValidation = true;
  		}
  		

		apiDataLateMore.methods['some_localidades']['data'] = {
				id: label[0]
			}

  		initMod.apiCall(apiDataLateMore).then(function(res){
  			console.log("res one norvid");
  			console.log(res);
  			$("figure.depend-content").show(500);
  			loc_pp = res.localidades;
		}, function(reason, json){
		 	initMod.debugThemes(reason, json);
		});
    };

    select_na = $('#select-na');
    var selectNa = function() {
    	var indata = $.map(all_na, function( item ) {
			return {
             	nucleo: item.NOM_NUCLEO,
	            id_nucleo: item.ID,
				tipo: item.TIPO,
            }
        });
        var keys = ['id_nucleo', 'nucleo', 'tipo', select_na, indata];
        var selectForm = resetSelect(keys[3]);
        selectForm.selectize({
            valueField: keys[0],labelField: keys[1],searchField: keys[1], options: keys[4],
            persist: false,
            create: false,
            sortField: "id_localidad",
            render: { option: function(item, escape) { return '<div><span class="name">' + escape(item[keys[1]]) + " (" + escape(item[keys[2]]) + ")" + '</span></div>' } },
            onInitialize: function () {
                var selectize = this;
                //selectize.addOption({id_localidad: -1, localidad: 'Todos'});
                //callSetTime(selectize, -1);
            },
			onChange: function(value) {
				/*console.log("valll");
				console.log(value);
				var selectize = this;
				if (value == null) {
					console.log("vacio");
					selectize.addOption({id_localidad: -1, localidad: 'Todos'});
				}else if (value.indexOf(-1) != -1 && value.length == 1) {
					console.log("encontrado");
				}else if (value.length > 1) {
					console.log("tiene 2");
					selectize.removeItem(-1);
				}*/
				console.log("value");
				console.log(value);
				//return;
				apiDataInfografia.methods['infografias']['data'] = {
					id: value,
					anio: $("#anio").val()
				}
				/*console.log("changueii");
				return;*/
				initMod.apiCall(apiDataInfografia).then(function(res){
      				console.log("res infograf");
					console.log(res);

					var infografia = res.infografia;

      				var html_infog = ``;
      				
      				var color = ["#ff007d","#8800ff","#ff8b00","#930000","#005593","#00936a","#930045","#116469"],i=0;
                    $.each(infografia, function(k, v) {
					  	html_infog+= `
					  	<article class="content-infografia">
	                        <div class="title-infografia" style="background:` + color[i] + `;"><div>` + k + `</div></div>
	                        <div class="content-data-infografia">
	                            <!--<div class="subtitle-infografia">Factor carencia de bienes y medios de comunicación</div>-->`;
	                            console.log("k");
								console.log(k);
	                            console.log("v");
								console.log(v);
                            	$.each(v, function(k_i, v_i) {
                            		console.log("k_i");
									console.log(k_i);
									console.log("v_i");
									console.log(v_i);
	                              	html_infog+= `
	                              	<div><i style="background:` + color[i] + `;"></i>` + v_i.label + `:<span>` + v_i.value + `</span></div>`;
	                            });
	                        html_infog+= `</div>
	                    </article>`;
	                    i++;
					});
      				$("#infografia").html(html_infog);
      				printInfog();
      			}, function(reason, json){
					console.log("non");
				 	initMod.debugThemes(reason, json);
				});
          	},
        });
    };

    var printInfog = function() {
    	setTimeout(function(){
        	var mapsyeahyeahs = $('#infografia');
            html2canvas([mapsyeahyeahs.get(0)], {
            	useCORS: true,
		        optimized: false,
		        allowTaint: false,
		      	onrendered: function (canvas) {
		        	/*document.body.appendChild(canvas);
		        	var a = document.createElement('a');
		        	// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
		        	a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
		        	a.download = 'somefilename.jpg';
		        	a.click();*/

		        	var tempcanvas=document.createElement('canvas');
		            tempcanvas.width=1450;
		            tempcanvas.height=620;
		            var context=tempcanvas.getContext('2d');
		            context.drawImage(canvas,0,0,1350,700,0,0,1350,700);
		            var link=document.createElement("a");
		            link.href=tempcanvas.toDataURL('image/jpg');   //function blocks CORS
		            link.download = 'infografia.jpg';
		            link.click();
		            generateExport();
		      	}
		    });
        },1000);
    }

    var selectTema = function(x) {
    	select_tema.html("");
	    var i = 1, len = all_temas.length;
	    while (i < len) {
	       	select_tema.append(new Option(all_temas[i].tema, all_temas[i].cve_tem));
	        i++
	    }
    }

    var choice_tab = "";
    var changeTema = function(x) {
    	var value = $(this).val();
    	if (value != "") {
    		
    		
    		//if (value == "desarrollo_local") {
    			console.log("choice_tab");
    			choice_tab = value;
    			console.log(choice_tab);
    		//}else {
    			//choice_tab = "";
    		//}
    		selectSubtema(value);
    		select_subtema.prop("disabled", false);
    	}else {
    		select_subtema.prop("disabled", true);
    	}
		select_subtema.val(select_subtema.val()).trigger('change');
    }

    var selectSubtema = function(x) {
    	var anio_selected = select_anio.val();
		select_subtema.html("");
        /*$.each(all_subtemas, function(i, v) {

         	if (v.subtema != null) {
	         	var sub_anio = v.subtema.split(' ');
				var res_anio = sub_anio[sub_anio.length-1];
				/*console.log("res_aniozzzzzzzzz");
				console.log(res_anio);*/

		        //if (v.cve_tem == x && anio_selected == res_anio) {
		        /*if (v.cve_tem == x) {
		        	select_subtema.append(new Option(v.subtema, v.cve_sub));
		        }
		    }
	    });*/

    	var res_subtema = all_subtemas;
    	$(".subtema").show();

        var i = 0, len = res_subtema.length;

        console.log("res_subtema");
        console.log(res_subtema);

	    while (i < len) {
	       	if (res_subtema[i].subtema != null) {
		        if (res_subtema[i].cve_tem == x && anio_selected == res_subtema[i].anio) {
		        	select_subtema.val(res_subtema[i].subtema);
		        	select_subtema_id.val(res_subtema[i].cve_sub);
		        	indicadores(res_subtema[i].cve_sub);
		        	check_all.prop('checked', false);
    				$("#indicadores-0").prop('checked', true);
		        }
		    }
	        i++
	    }
    }

    var changeSubtema = function() {
    	var value = $(this).val();
    	if (value != "") {

    		indicadores(value);
    	}else {
    		//select_subtema.prop("disabled", true);
    	}
    	check_all.prop('checked', false);
    	$("#indicadores-0").prop('checked', true);
    }

    var changeDescSubtema = function() {
    	var value = $(this).val();
    	if (value != "") {
    		console.log("fdsafdsafds");
    		indicadores(value);
    	}else {
    		//select_subtema.prop("disabled", true);
    	}
    	check_all.prop('checked', false);
    	$("#indicadores-0").prop('checked', true);
    }

    var indicadores = function(x ="") {
    	if (choice_tab == "desarrollo_local") {
	    	console.log("des llll");
	    	console.log(x);
	    	var res_indi = all_descindicadores;
	    	console.log(res_indi);
	    }else {
	    	var res_indi = all_indicadores;
	    }
	    var indata = $.map(res_indi, function( item ) {
			if (x == item.cve_sub) {
				return {
	             	label: item.indicadores,
		            value: item.cve_ind,
	            }
			}
        });
        check_indicadores.html("");
        check_indicadores.hide(300, function() {
			if (x != "") {
				$.each(indata, function(i, v) {
					var che = "";
					if (i == 0)	che = "checked"; 
			        check_indicadores.append('<div><input type="checkbox" class="indicadores-check" name="indicadores-' + i + '" id="indicadores-' + i + '" value="' + v.value + '" ' + che + '> ' + v.label + '</div>')
			    });
			    check_indicadores.show(600);
			}
        });
    }

    var checkAllIndicadores = function() {
    	$('input:checkbox').not(this).prop('checked', this.checked);
    }

    var checkVisible = function() {
    	var one_true = false;
    	$('input[type=checkbox]:not(#check-all)').each(function () {
		    if (this.checked) one_true = true;
		});
		if (!one_true) {
			check_all.prop('checked', false);
			$("#indicadores-0").prop('checked', true);
		}
    }

	var initAlterData = function() {
		initMod.apiCall(apiDataLate).then(function(res){
			console.log("res alter a");
			console.log(res);
        	all_municipios = res.municipios;
        	//all_localidades = res.localidades;
        	all_estados = res.estados;
        	all_temas = res.temas;
        	all_subtemas = res.subtemas;
        	all_indicadores = res.indicadores;
        	
        	selectEstado();
        	selectTema();
        	select_tema.val(2).trigger('change');

			for (var i = all_indicadores.length - 1; i >= 0; i--) {
				nom_ind[all_indicadores[i].cve_ind] = all_indicadores[i].indicadores;
			}

        	$(".load-data").hide(300, function() {
				$(".content-filters").show(600, function() {
	      			/*initMod.apiCall(apiDataLocalidades).then(function(res){
	      				console.log("res loccc");
    					console.log(res);
	      				all_localidades = res.localidades;
	      				//selectLocalidad();
	      			}, function(reason, json){
						console.log("non");
					 	initMod.debugThemes(reason, json);
					});*/
				});
			});
        }, function(reason, json){
			console.log("non");
		 	initMod.debugThemes(reason, json);
		});
	}

	var getEstadoFormat = function(x) {
		return all_estados_format[x];
	}

	var getMunicipioFormat = function(x) {
		return all_municipios_format[x];
	}

	var l;

	var buscarRes = function() {
		/*btn_excel.hide();
		btn_pdf.hide();*/
		btn_export.hide();
		$('#footable-list').show(300);
		$('#footable-list').empty();
		l = $(this).ladda();
		l.ladda( 'start' );
		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		var in_end= sList.join(",");

		apiDataAllFilter.methods['all_filter_' + this_module]['data'] = {
			//id_localidad: $("#select-localidad-id").val(),
			anio: $("#anio").val(),
			indicadores: in_end,
			debug: $("#debug").val(),
			tab: "none",
			localidades: loc_pp
		}
		console.log("apiDataAllFilterapiDataAllFilter");
		console.log(apiDataAllFilter);
		if (choice_tab == "desarrollo_local") {
			getInitResponseCube();//
		}else {
			getInitResponse();//
		}
	}

	var generateExcel = function() {

		console.log("apiDataExcel");
		console.log(apiDataExcel);

		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		var in_end= sList.join(",");

		apiDataExcel.methods['export-excel']['data'] = {id_localidad: $("#select-localidad-id").val(), anio: $("#anio").val(), indicadores: in_end, debug: $("#debug").val()}

		
		
		initMod.apiCall(apiDataExcel).then(function(res, status, xhr){
			console.log("res de nuestro nuevo modulo" + module_upper);
			console.log(res);

			window.open('temp-excel/' + res.file_name, '_blank');

		}, function(reason, json){
			console.log("non hgdf");
			l.ladda( 'stop' );
			if ($("#debug").val() == 'debug') {
				$(".res-error-2").html("Error-2 msg: " + reason.responseText).show(1000);
			}else {
				//$(".res-error-2").html("Error en la consulta").show(1000);
			}
		 	initMod.debugThemes(reason, json);


		});
	}

	var generatePdf = function() {

		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		var in_end= sList.join(",");

		apiDataPdf.methods['export-pdf']['data'] = {id_localidad: $("#select-localidad-id").val(), anio: $("#anio").val(), indicadores: in_end, debug: $("#debug").val()}

		
		
		initMod.apiCall(apiDataPdf).then(function(res, status, xhr){
			console.log("res de nuestro nuevo modulo" + module_upper);
			console.log(res);

			window.open('temp-pdf/' + res.file_name, '_blank');

		}, function(reason, json){
			console.log("non hgdf");
			l.ladda( 'stop' );
			if ($("#debug").val() == 'debug') {
				$(".res-error-2").html("Error-2 msg: " + reason.responseText).show(1000);
			}else {
				//$(".res-error-2").html("Error en la consulta").show(1000);
			}
		 	initMod.debugThemes(reason, json);


		});
	}

	var generateExport = function() {
		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		var in_end= sList.join(",");
		apiDataExport.methods['export']['data'] = {
			//id_localidad: $("#select-localidad-id").val(),
			anio: $("#anio").val(),
			indicadores: in_end,
			debug: $("#debug").val(),
			tab: "none",
			localidades: loc_pp
		}
		var l = $(this).ladda();
		l.ladda( 'start' );
		initMod.apiCall(apiDataExport).then(function(res, status, xhr){
			console.log("res de nuestro nuevo modulo" + module_upper);
			console.log(res);
			//return;

			window.open('temp-excel/' + res.excel.file_name, '_blank');
			window.open('temp-pdf/' + res.pdf.file_name, '_blank');
			l.ladda( 'stop' )

		}, function(reason, json){
			console.log("non hgdf");
			l.ladda( 'stop' );
			if ($("#debug").val() == 'debug') {
				$(".res-error-2").html("Error-2 msg: " + reason.responseText).show(1000);
			}else {
				//$(".res-error-2").html("Error en la consulta").show(1000);
			}
		 	initMod.debugThemes(reason, json);


		});
	}

	var bindFilters = function() {
        $("#btn-buscar").on("click", buscarRes);
        select_estado.on("change", changeEstado);
        select_anio.on("change", changeAnio);
        select_anio_na.on("change", changeAnioNA);
        select_metodo.on("change", changeMetodo);
        select_tema.on("change", changeTema);
        select_subtema.on("change", changeSubtema);
        select_descsubtema.on("change", changeDescSubtema);
        check_all.on("click", checkAllIndicadores);
        $(document).on('click','.indicadores-check', checkVisible);
        /*btn_excel.on('click', generateExcel);
        btn_pdf.on('click', generatePdf);*/
        btn_export.on('click', generateExport);

        $(document).on('mousemove', 'poligonoaaaa', map_mousemove);
        $(document).on('mouseleave', 'poligonoaaaa', map_mouseleave);
        $(document).on('click', 'poligonoaaaa', map_click);
    };

	var init = function () {
		console.log("opeth");
        initAlterData();
        bindFilters();
    };

	return {
	    init : init,
	    this_module: this_module,
	    getEstadoFormat: getEstadoFormat,
	    getMunicipioFormat: getMunicipioFormat
	}
})();