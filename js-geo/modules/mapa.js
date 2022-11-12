var mapa = (function() {
	"use strict"

	var this_module = "mapa",
		module_upper = "Mapa",
		module_one = "mapa",
		apiDataAll = {
			controller: module_upper,
			methods: {
            	['all_' + this_module]: '',
            	'json': ''
            },
		},
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
            	'coords': { data: ""},
            	'json': ''
            },
		},
		apiDataLate = {
			controller: module_upper,
			methods: {
				'estados': '',
				'municipios': '',
				'localidades': '',
				'temas': '',
				'subtemas': '',
				'indicadores': '',
				'desc_subtemas': '',
				'desc_indicadores': '',
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
		all_descsubtemas,
		all_descindicadores,
		all_estados_format,
		all_municipios_format,
		//nom_ind = {ID: "ID", CGLOC: "CGLOC", NOM_LOC : "LOCALIDAD", CVE_ENT : "estado", clave_estado : "clave estado", CVE_MUN : "municipio", clave_municipio : "clave municipio"},
		nom_ind = {ID: "ID", NOM_LOC : "LOCALIDAD"},
		select_estado = $("#select-estado"),
		select_municipio = $("#select-municipio"),
		select_tema = $("#select-tema"),
		select_descsubtema = $("#select-descsubtema"),
		select_subtema = $("#select-subtema"),
		select_subtema_id = $("#select-subtema-id"),
		select_anio = $("#anio"),
		select_metodo = $("#select-metodo"),
		select_na = $("#select-na"),
		btn_excel = $("#icono-excel"),
		btn_pdf = $("#icono-pdf"),
		btn_export = $("#icono-export"),
		check_ind_var = $("#check-ind-var"),
		check_ind_none = $("#check-ind-none"),
		check_all = $("#check-all"),
		check_all_var = $("#check-all-var"),
		check_indicadores = $("#check-indicadores"),
		check_indicadores_var = $("#check-indicadores-var");

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
					/*if (i == "CVE_ENT") yeison.formatter = "select.getEstadoFormat";
					if (i == "CVE_MUN") yeison.formatter = "select.getMunicipioFormat";*/
			        if (ii > 4) yeison.breakpoints = "all";
			        header.push(yeison);
			        ii++;
			    });
			}else {
				header = [{ name: "id", title: "ID", "style":{"width":20,"maxWidth":20} }];
			}

			$('#footable-list').empty();
			$('#footable-list-cube').empty();
			
			var ft = FooTable.init('#footable-list', {
				"columns": header,
				"rows": all_data_tab,
                'on': {
                    'postdraw.ft.table': function(e, ft) {
                        getPostResponse(ft);
                    }
                }
			},function(ft){
		    });
		}, function(reason, json){
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
					/*if (i == "CVE_ENT") yeison.formatter = "select.getEstadoFormat";
					if (i == "CVE_MUN") yeison.formatter = "select.getMunicipioFormat";*/
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
                        getPostResponse(ft);
                    }
                }
			},function(ft){
		    });
		}, function(reason, json){
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
	        select_estado.append(new Option(v.NOMGEO, v.CVE_ENT));
	    });*/

	    var i = 0, len = all_estados.length;
	    while (i < len) {
	       	select_estado.append(new Option(all_estados[i].NOMGEO, all_estados[i].CVE_ENT));
	        i++
	    }
    }

    var changeEstado = function() {
    	var value = $(this).val();
	    $("#select-municipio").val("");
    	if (value != "") {
    		selectMunicipio(value);
    		select_municipio.prop("disabled", false);
    	}else {
    		select_municipio.prop("disabled", true);
    		
    	}
    }

    var selectMunicipio = function(x) {
		var indata = $.map(all_municipios, function( item ) {
			if (x == item.CVE_ENT) {
				return {
	             	label: item.NOMGEO,
		            value: item.CVE_MUN,
	            }
			}
        });
        $("#select-municipio").autocomplete({
	      	minLength: 0,
	      	source: indata,
	      	select: function( event, ui ) {
	      		if (ui.item.value > 0) {
	      		}
		        $("#select-municipio").val( ui.item.label );
		        $("#select-municipio-id").val( ui.item.value );
		        return false;
	      	},
	      	change: function( event, ui ) {
	      		if (ui.item == null) {
	      			$("#select-municipio-id").val("");
	      		}
	      	},
	      	close: function( event, ui ) {
	      		if ($("#select-municipio").val() == "") {
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
	    	//$("#select-municipio").data('ui-autocomplete')._trigger('select', 'autocompleteselect', {item:{value:x}});
	    }
    }

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

    var changeMetodo = function() {
    	//selectTema();
    	//select_tema.val(1).trigger('change');
    	var id_n = $(this).val(); // optiene la opción seleccionada;
    	console.log({id_n})
    	if (id_n == 1) {
    		$(".na").show();
	    	$(".mapats").hide();
	    	selectNa();
    	}else if (id_n == 2) { // la opción 2 es la que despliega el mapa;
    		$(".na").hide();
	    	$(".mapats").show();
	    	mapProp = {
	    		container: 'poligonos-maps',
		        //style: 'mapbox://styles/mapbox/streets-v10',
		        style: 'mapbox://styles/mapbox/outdoors-v11',
		        //center: [-99.1344835, 19.4288867],
		        //center: [-68.137343, 45.137451],
		        //center: [-71.177684852, 42.390289651],
		        //center: [-91.97363682, 17.91143118],
		        center: [-89.7808483,21.1309389],
				zoom: 5
		    };
	    	map = $("#poligonos-maps").length ?  new mapboxgl.Map(mapProp) : false;

	        if ($("#select-municipio-id").val() != "" && select_estado.val() != "") {
	        	apiDataCoords.methods['coords']['data'] = {
					id_municipio: $("#select-municipio-id").val(),
					id_estado: select_estado.val(),
				}
	        	initMod.apiCall(apiDataCoords).then(function(res){
					console.log("ress coords");
    				console.log(res);
    				var est_coords = res.estados[0].COORDS.coordinates[0];
    				/*var g_coords = res.estados_add[0].COORDS.coordinates[0];
    				var mun_coords = res.municipios[0].COORDS.coordinates[0];*/
    				console.log("est_coords");
    				console.log(est_coords);
    				setTimeout(function() {
    					var apiJsonAllPol = res.test_coords;
						id_source_collection.features = id_source_collection.features.concat(apiJsonAllPol);
			          	getPoligonShapes(est_coords);
			        }, 500);

			        setTimeout(function() {
			        	
			        	var apiJsonAllPol = res.municipios_coords.features;
						id_source_collection.features = id_source_collection.features.concat(apiJsonAllPol);

			          	map.getSource('diamolical-pal').setData(id_source_collection);
			        }, 4000);
				}, function(reason, json){
				 	initMod.debugThemes(reason, json);
				});
	        	
	        }
	        
    	}
    }

    var id_source_collection = { type: 'FeatureCollection', features: [] }

    select_na = $('#select-na');
    var selectNa = function() {
    	var indata = $.map(all_na, function( item ) {
            if ($("#select-municipio-id").val() == item.cve_mun && select_estado.val() == item.cve_ent) {
				return {
	             	nucleo: item.nom_nucleo,
		            id_nucleo: item.cve_nucleo,
	            }
			}
        });
        select_na.prop("disabled", false);
        var keys = ['id_nucleo', 'nucleo', select_na,indata];
        var selectForm = resetSelect(keys[2]);
        selectForm.selectize({
            valueField: keys[0],labelField: keys[1],searchField: keys[1], options: keys[3],
            persist: false,
            create: false,
            sortField: "id_localidad",
            render: { option: function(item, escape) { return '<div><span class="name">' + escape(item[keys[1]]) + '</span></div>' } },
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
          	},
        });
    };

    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVhbm9ycmFuZ2VsIiwiYSI6ImNrNnIxYzVmdzAwdWszaHFpcndyandwbmcifQ.0yZCD9xMEiLEAzeut0pzuw';

	var mapProp; /*= {
      	container: 'poligonos-maps',
        style: 'mapbox://styles/mapbox/streets-v10',
        //center: [-99.1344835, 19.4288867],
        //center: [-68.137343, 45.137451],
        //center: [-71.177684852, 42.390289651],
        center: [-91.97363682, 17.91143118],
		zoom: 5
    };*/

    var map;// = $("#poligonos-maps").length ?  new mapboxgl.Map(mapProp) : false;



    var getPoligonShapes = function(est_coords,mun_coords) {
		console.log("enter dheippp");
		map.addSource('diamolical-pal', {
            'type': 'geojson',
            'data': {
				'type': 'Feature',
				'geometry': {
					'type': 'Polygon',
					// These coordinates outline Maine.
					"coordinates": 
						est_coords
				}
			}
            //'generateId': true
        });

        map.addLayer({
			'id': 'poligono-patrimonial',
			'type': 'fill',
			'source': 'diamolical-pal',
			'layout': {},
			'paint': {
				'fill-color': '#e22624',
				'fill-opacity': [
					'case',
					['boolean', ['feature-state', 'hover'], false],
					0.9,
					0.6
				]
			}
		});

	  	map.addSource('bbb', {
	    	type: 'geojson',
		    data: {
		      "type": "FeatureCollection",
		      "features": []
		    }
	  	});
        map.addLayer({
			/*'id': 'poligono-borders',
			'type': 'line',
			'source': 'diamolical-pal',
			'layout': {},
			'paint': {
				'line-color': '#ec4242',
				'line-width': 0.1,
			}*/
			"id": "poligono-borders",
		    "source": "bbb",
		    'type': 'line',
		    'paint': {
		    	'line-color': '#4924dc',
		      'line-width': 2
		    }
		});
    }

	var l;

    var changeAnio = function() {
    	selectSubtema(1);
    	//selectSubtema.val(1).trigger('change');
    }

    var selectTema = function(x) {
    	select_tema.html("");
	    var i = 0, len = all_temas.length;
	    while (i < len) {
	       	select_tema.append(new Option(all_temas[i].tema, all_temas[i].cve_tem));
	        i++
	    }
	    /*if ($("#anio").val() == 2020) {
	    	select_tema.append(new Option("Desarrollo local", "desarrollo_local"));
	    }*/
	    select_tema.append(new Option("Desarrollo local", "desarrollo_local"));
    }

    var choice_tab = "";
    var changeTema = function(x) {
    	var value = $(this).val();
    	if (value != "") {
    		
    		
    		//if (value == "desarrollo_local") {

    			choice_tab = value;

    		//}else {
    			//choice_tab = "";
    		//}
    		selectSubtema(value);
    		select_subtema.prop("disabled", false);
    	}else {
    		select_subtema.prop("disabled", true);
    	}
    	if (value != "desarrollo_local") {
    		$(".anio").show();
			select_subtema.val(select_subtema.val()).trigger('change');
		}else {
			$(".anio").hide();
			select_descsubtema.val(select_descsubtema.val()).trigger('change');
		}
    }

    var selectSubtema = function(x) {

    	var anio_selected = select_anio.val();

		select_subtema.val("");
		select_subtema_id.val("");
		select_descsubtema.html("");
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

	    if (choice_tab == "desarrollo_local") {

	    	var res_subtema = all_descsubtemas;
	    	$(".subtema").hide();
	    	$(".descsubtema").show();
	    }else {
	    	var res_subtema = all_subtemas;
	    	$(".subtema").show();
	    	$(".descsubtema").hide();
	    }

        var i = 0, len = res_subtema.length;

	    while (i < len) {
	    	if (choice_tab == "desarrollo_local") {
	    		/*select_descsubtema.val(res_subtema[i].subtema);
	        	indicadores(res_subtema[i].cve_sub);
	        	check_all.prop('checked', false);
				$("#indicadores-0").prop('checked', true);*/

			    select_descsubtema.append(new Option(res_subtema[i].subtema, res_subtema[i].cve_sub));
			    //indicadores(res_subtema[i].cve_sub);
	        	/*check_all.prop('checked', false);
				$("#indicadores-0").prop('checked', true);*/
	    	}else {
		       	if (res_subtema[i].subtema != null) {
			        if (res_subtema[i].cve_tem == x && anio_selected == res_subtema[i].anio) {

			        	select_subtema.val(res_subtema[i].subtema);
			        	select_subtema_id.val(res_subtema[i].cve_sub);
			        	indicadores(res_subtema[i].cve_sub);
			        	check_all.prop('checked', false);
	    				$("#indicadores-0").prop('checked', true);
			        }
			    }
			}
	        i++
	    }
    }

    var changeSubtema = function() {
    	var value = $(this).val();
    	if (value != "") {

    		//indicadores(value);
    	}else {
    		//select_subtema.prop("disabled", true);
    	}
    	check_all.prop('checked', false);
    	check_all_var.prop('checked', false);
    	$("#indicadores-0").prop('checked', true);
    }

    var changeDescSubtema = function() {
    	var value = $(this).val();
    	if (value != "") {
    		indicadores(value);
    	}else {
    		//select_subtema.prop("disabled", true);
    	}
    	check_all.prop('checked', false);
    	$("#indicadores-0").prop('checked', true);
    }

    var indicadores = function(x ="") {
    	if (choice_tab == "desarrollo_local") {
	    	var res_indi = all_descindicadores;
	    }else {
	    	var res_indi = all_indicadores;
	    }
	    var indata = $.map(res_indi, function( item ) {
			if (x == item.cve_sub) {
				return {
	             	label: item.indicadores,
		            value: item.cve_ind,
		            type: item.type,
	            }
			}
        });
        check_indicadores.html("");
        check_indicadores_var.html("");

        check_ind_var.hide(300);
        check_ind_none.hide(300, function() {
			if (x != "") {
				$.each(indata, function(i, v) {
					var che = "";
					if (i == 0)	che = "checked";

					if (v.type == "var") {
						check_indicadores_var.append('<div><input type="checkbox" class="indicadores-check-var" name="indicadores-' + i + '" id="indicadores-' + i + '" value="' + v.value + '" ' + che + '> ' + v.label + '</div>')
					}else {
						check_indicadores.append('<div><input type="checkbox" class="indicadores-check" name="indicadores-' + i + '" id="indicadores-' + i + '" value="' + v.value + '" ' + che + '> ' + v.label + '</div>')
					}
			        
			    });
			    if ($(".indicadores-check").length > 1) check_ind_none.show(600);
			    if ($(".indicadores-check-var").length > 1) check_ind_var.show(600);
			    
			}
        });
    }

    var checkAllIndicadores = function() {
    	$('#check-ind-none input:checkbox').not(this).prop('checked', this.checked);
    	$('#check-ind-var input:checkbox').prop('checked', false);
    }

    var checkAllIndicadoresVar = function() {
    	$('#check-ind-var input:checkbox').not(this).prop('checked', this.checked);
    	$('#check-ind-none input:checkbox').prop('checked', false);
    }

    var checkVisible = function() {
    	$('#check-ind-var input:checkbox').prop('checked', false);
    	var one_true = false;
    	$('input[type=checkbox]:not(#check-all)').each(function () {
		    if (this.checked) one_true = true;
		});
		if (!one_true) {
			check_all.prop('checked', false);
			$("#indicadores-0").prop('checked', true);
		}

    }

    var checkVisibleVar = function() {
    	$('#check-ind-none input:checkbox').prop('checked', false);
    	var one_true = false;
    	$('input[type=checkbox]:not(#check-all-var)').each(function () {
		    if (this.checked) one_true = true;
		});
		if (!one_true) {
			check_all_var.prop('checked', false);
			$("#indicadores-0").prop('checked', true);
		}
    }

    var checkOne = function() {
    	
    }

    var checkOneVar = function() {
    	
    }

	var initAlterData = function() {
		initMod.apiCall(apiDataLate).then(function(res){
        	all_municipios = res.municipios;
        	all_localidades = res.localidades;
        	all_estados = res.estados;
        	all_temas = res.temas;
        	all_subtemas = res.subtemas;
        	all_indicadores = res.indicadores;
        	all_descsubtemas = res.descsubtemas;
        	all_descindicadores = res.descindicadores;
        	selectEstado();
        	selectTema();
        	select_tema.val(1).trigger('change');

			for (var i = all_indicadores.length - 1; i >= 0; i--) {
				nom_ind[all_indicadores[i].cve_ind] = all_indicadores[i].indicadores;
			}

			for (var i = all_descindicadores.length - 1; i >= 0; i--) {
				nom_ind[all_descindicadores[i].cve_ind] = all_descindicadores[i].indicadores;
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
			/*initMod.apiCall(apiDataLateFormat).then(function(res){
				console.log("res alter 222");
				console.log(res);
				all_municipios_format = res.municipios_format;
	        	all_estados_format = res.estados_format;
			}, function(reason, json){
				console.log("non");
			 	initMod.debugThemes(reason, json);
			});*/
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
		l = $(this).ladda();
		l.ladda( 'start' );
		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		$('#check-indicadores-var input').each(function () {
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
			tab: choice_tab,
			id_estado: $("#select-estado").val(),
			id_municipio: $("#select-municipio-id").val()
		}
		if (choice_tab == "desarrollo_local") {
			getInitResponseCube();//
		}else {
			getInitResponse();//
		}
	}

	var generateExport = function() {
		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		$('#check-indicadores-var input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		var in_end= sList.join(",");
		apiDataExport.methods['export']['data'] = {
			anio: $("#anio").val(),
			indicadores: in_end,
			debug: $("#debug").val(),
			tab: choice_tab,
			localidades: $("#select-localidad").val(),
			id_estado: $("#select-estado").val(),
			id_municipio: $("#select-municipio-id").val()
		}
		var l = $(this).ladda();
		l.ladda( 'start' );
		initMod.apiCall(apiDataExport).then(function(res, status, xhr){
			//return;

			window.open('temp-excel/' + res.excel.file_name, '_blank');
			window.open('temp-pdf/' + res.pdf.file_name, '_blank');
			l.ladda( 'stop' )

		}, function(reason, json){
			l.ladda( 'stop' );
			if ($("#debug").val() == 'debug') {
				$(".res-error-2").html("Error-2 msg: " + reason.responseText).show(1000);
			}else {
				$(".res-error-2").html("Error en la consulta").show(1000);
			}
		 	initMod.debugThemes(reason, json);


		});
	}

	var bindFilters = function() {
        $("#btn-buscar").on("click", buscarRes);
        select_estado.on("change", changeEstado);
        select_anio.on("change", changeAnio);
        select_tema.on("change", changeTema);
        select_subtema.on("change", changeSubtema);
        select_descsubtema.on("change", changeDescSubtema);
        select_metodo.on("change", changeMetodo);
        check_all.on("click", checkAllIndicadores);
        check_all_var.on("click", checkAllIndicadoresVar);
        $(document).on('click','.indicadores-check', checkVisible);
        $(document).on('click','.indicadores-check-var', checkVisibleVar);

        $(document).on('click','#check-ind-none input:checkbox', checkOne);
        $(document).on('click','#check-ind-var input:checkbox', checkOneVar);
        btn_export.on('click', generateExport);
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