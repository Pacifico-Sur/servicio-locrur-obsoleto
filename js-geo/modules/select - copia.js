var select = (function() {
	"use strict"

	var this_module = "select",
		module_upper = "Select",
		module_one = "select",
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
		all_data_tab,
		all_estados,
		all_municipios,
		all_localidades,
		all_temas,
		all_subtemas,
		all_indicadores,
		select_estado = $("#select-estado"),
		select_municipio = $("#select-municipio"),
		select_localidad = $("#select-localidad"),
		select_tema = $("#select-tema"),
		select_subtema = $("#select-subtema"),
		select_anio = $("#anio"),
		check_all = $("#check-all"),
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
			if ($("#debug").val() == 'debug') {
				$(".res-x").html("send: " + JSON.stringify(res.x));
				$(".res-sql").html("sql: " + res.sql);
			}
			var all_data_tab = res.vulnerabilidad, header = [], ii = 0;
			$.each(all_data_tab[0], function(i, v) {
		        var yeison = { "name": i,"title": i, "style":{"width":150,"maxWidth":150} };
		        if (ii > 10) yeison.breakpoints = "all";
		        header.push(yeison);
		        ii++;
		    });

			$('#footable-list').empty();    
			
			var ft = FooTable.init('#footable-list', {
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
		 	initMod.debugThemes(reason, json);
		});
	}

	var selectEstado = function(x) {
	    /*$.each(all_estados, function(i, v) {
	        select_estado.append(new Option(v.NOMGEO, v.CVE_ENT));
	    });*/

	    var i = 0, len = all_estados.length;
	    while (i < len) {
	    	console.log("esttta oo");
	    	console.log(all_estados[i]);
	       	select_estado.append(new Option(all_estados[i].NOMGEO, all_estados[i].CVE_ENT));
	        i++
	    }
    }

    var changeEstado = function() {
    	var value = $(this).val();
    	console.log("value");
	    console.log(value);
	    $("#select-municipio").val("");
	    $("#select-localidad").val("");
	    $("#select-localidad-id").val("");
	    select_localidad.prop("disabled", true);
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
	      			
	      			selectLocalidad(ui.item.value);
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

    var selectLocalidad = function(x) {
    	$("#select-localidad").html("");
		var indata = $.map(all_localidades, function( item ) {
            if (x == item.CVE_MUN) {
				return {
	             	label: item.NOM_LOC,
		            value: item.CGLOC,
	            }
			}
        });
        $("#select-localidad").autocomplete({
	      	minLength: 0,
	      	source: indata,
	      	select: function( event, ui ) {
	      		if (ui.item.value > 0) {
	      			//selectAutoDirec(x, ui.item.value);
	      		}
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

    var changeAnio = function() {
    	//selectSubtema(select_tema.val());
    }

    var selectTema = function(x) {
    	select_tema.html("");
	    var i = 0, len = all_temas.length;
	    while (i < len) {
	       	select_tema.append(new Option(all_temas[i].tema, all_temas[i].cve_tem));
	        i++
	    }
    }

    var changeTema = function(x) {
    	var value = $(this).val();
    	if (value != "") {
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
        var i = 0, len = all_subtemas.length;
	    while (i < len) {
	       	if (all_subtemas[i].subtema != null) {
	         	var sub_anio = all_subtemas[i].subtema.split(' ');
				var res_anio = sub_anio[sub_anio.length-1];
				/*console.log("res_aniozzzzzzzzz");
				console.log(res_anio);*/

		        //if (all_subtemas[i].cve_tem == x && anio_selected == res_anio) {
		        if (all_subtemas[i].cve_tem == x) {
		        	select_subtema.append(new Option(all_subtemas[i].subtema, all_subtemas[i].cve_sub));
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
    }

    var indicadores = function(x ="") {
	    var indata = $.map(all_indicadores, function( item ) {
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
			        check_indicadores.append('<div><input type="checkbox" class="indicadores-check" name="indicadores-' + i + '" id="indicadores-' + i + '" value="' + v.value + '""> ' + v.label + '</div>')
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
		if (!one_true) check_all.prop('checked', false);
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
        	select_tema.val(1).trigger('change');
        	
        	$(".load-data").hide(300, function() {
				$(".content-filters").show(600, function() {
	      			initMod.apiCall(apiDataLocalidades).then(function(res){
	      				console.log("res loccc");
    					console.log(res);
	      				all_localidades = res.localidades;
	      				//selectLocalidad();
	      			}, function(reason, json){
						console.log("non");
					 	initMod.debugThemes(reason, json);
					});
				});
			});
        }, function(reason, json){
			console.log("non");
		 	initMod.debugThemes(reason, json);
		});
	}

	var l;

	var buscarRes = function() {
		l = $(this).ladda();
		l.ladda( 'start' );
		var sList = [];
		$('#check-indicadores input').each(function () {
		    if (this.checked) {
		    	sList.push('"' + $(this).val() + '"');
		    }
		});
		var in_end= sList.join(",");

		apiDataAllFilter.methods['all_filter_' + this_module]['data'] = {id_localidad: $("#select-localidad-id").val(), anio: $("#anio").val(), indicadores: in_end, debug: $("#debug").val()}
		getInitResponse();//
	}

	var bindFilters = function() {
        $("#btn-buscar").on("click", buscarRes);
        select_estado.on("change", changeEstado);
        select_anio.on("change", changeAnio);
        select_tema.on("change", changeTema);
        select_subtema.on("change", changeSubtema);
        check_all.on("click", checkAllIndicadores);
        $(document).on('click','.indicadores-check', checkVisible);
    };

	var init = function () {
		console.log("opeth");
        initAlterData();
        bindFilters();
    };

	return {
	    init : init,
	    this_module: this_module
	}
})();