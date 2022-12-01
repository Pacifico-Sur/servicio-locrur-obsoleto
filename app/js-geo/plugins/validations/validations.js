function isset(variable) {
    return typeof variable !== 'undefined' ? true : false;
}
function empty(variable){
    if (Array.isArray(variable)) {
        return variable.length > 0 ? false: true;
    }else {
        return variable == '' || variable == null || variable.trim().length == 0 ? true: false;
    }
}
(function($) {
    // Declaración del plugin.
    $.fn.validations = function(options) {
        var cont_errores = 0;
        var cont_regla = 0;
        var validations = {
            /**
            *Return: 
            **   true: El campo cumple con la regla de validacion
            **   false: El campo no cumple con la regla de validacion
            **   -1: No exite el tipo de validacion definida en el campo
            **/
            tipoValidacion : function(value,tipo){
                switch(tipo) {
                    case "older":
                        return {
                            valido : function() { return res = (value >= 0 && value < 10000) ? true : false; },
                            message: function() { return 'El campo debe contener un número entre 0 y 9999.'; }
                        }
                        break;
                    case "olderHundred":
                        return {
                            valido : function() { return res = (value >= 0 && value <= 100) ? true : false; },
                            message: function() { return 'El campo debe contener un número entre 0 y 100.'; }
                        }
                        break;
                    case "caracteres":
                        return {
                            valido : function() { return /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$/.test(value); },
                            message: function() { return 'El campo solo debe contener caracteres.'; }
                        }
                        break;
                    case "email":
                        return {
                            valido : function() { return /\S+@\S+/.test(value); },
                            message: function() { return  'El campo debe contener una direccion de email válida.'; }
                        }
                        break;
                    case "no-numeric":
                        return {
                            valido : function() { return /^[^0-9]+$/.test(value); },
                            message: function() { return 'El campo no debe contener solo numeros.'; }
                        }
                        break;
                    case "phone":
                        return {
                            valido : function() { return /^[0-9a-zA-Z óÓ.]+$/.test(value); },
                            message: function() { return 'El campo debe contener un formato de telefono válido.'; }
                        }
                        break;
                    case "alpha_numeric":
                        return {
                            valido : function() { return /^[0-9a-zA-Z .]+$/.test(value); },
                            message: function() { return 'El campo debe contener solo caracteres alfanuméricos.'; }
                        }
                        break;
                    case "time":
                        return {
                            valido : function() {
                                var tets = value.split(':');
                                /*console.log("tets aa");
                                console.log(tets.length);
                                console.log("tets[0].length");
                                console.log(tets[0].length);
                                console.log("tets[1].length");
                                console.log(tets[1].length);*/
                                if (tets.length == 2 && tets[0].length == 2 && tets[1].length == 2) {
                                    return true;
                                }else {
                                    return false;
                                }
                            },
                            message: function() { return 'El campo debe contener una hora (HH:MM).'; }
                        }
                        break;
                    default:
                        return {
                            valido : function() { return -1; },
                            message: function() { return 'No se ha agregado la regla de validación:'+tipo; }
                        }
                        
                }
            },
            addError : function(el, message) {
                if (el.hasClass( "selectized" )) {
                    el.next('div').find('input').addClass('error-form');
                    el.next('div').children('.selectize-input').addClass('tooltip');
                    el.next('div').children('.selectize-input').append('<span class="tooltiptext">'+message+'</span>');
                }else if (el.hasClass( "fecha-cal" )) {
                    el.prev('span').children('input').addClass('error-form');
                    el.prev('span').addClass('tooltip');
                    el.prev('span').children('input').after('<span class="tooltiptext">'+message+'</span>');
                }else if (el.hasClass( "up-file" )) {
                    el.next('span').addClass('error-form');
                    el.parent('div').addClass('tooltip');
                    el.next('div').siblings().remove();
                    el.parent().append('<span class="tooltiptext">'+message+'</span>');
                }else{
                    el.siblings().remove();
                    el.addClass('error-form');
                    el.parent().addClass('tooltip');
                    el.parent().append('<span class="tooltiptext">'+message+'</span>');
                }
            },
            removeError : function(el) {
                if (el.hasClass( "selectized" )) {
                    el.next('div').find('input').removeClass('error-form');
                    el.next('div').children('div').removeClass('tooltip');
                    el.next('div').find('.tooltiptext').remove();
                }else if (el.hasClass( "fecha-cal" )) {
                    el.prev('span').children('input').removeClass('error-form');
                    el.prev('span').removeClass('tooltip');
                    el.prev('span').find('.tooltiptext').remove();
                }else if (el.hasClass( "up-file" )) {
                    el.next('span').removeClass('error-form');
                    el.parent().removeClass('tooltip');
                    el.parent().find('.tooltiptext').remove();
                    //el.next('.up-file').addClass('error-form');
                    /*el.next('div').children('div').addClass('tooltip');
                    el.next('div').children('div').append('<span class="tooltiptext">'+message+'</span>');*/
                }else{
                    el.removeClass('error-form');
                    el.parent().removeClass('tooltip');
                    el.siblings().remove();
                }
            },
            addSucces : function(el) {
                if (el.hasClass( "selectized" )) {
                    el.next('div').find('input').addClass('succes-form');
                }else if (el.hasClass( "fecha-cal" )) {
                    el.prev('span').children('input').addClass('succes-form');
                }else if (el.hasClass( "up-file" )) {
                    el.next('span').addClass('succes-form');
                    //el.next('.up-file').addClass('error-form');
                    /*el.next('div').children('div').addClass('tooltip');
                    el.next('div').children('div').append('<span class="tooltiptext">'+message+'</span>');*/
                }else{
                    el.addClass('succes-form');
                }
            },
            removeSucces : function(el) {
                if (el.hasClass( "selectized" )) {
                    el.next('div').find('input').removeClass('succes-form');
                }else if (el.hasClass( "fecha-cal" )) {
                    el.prev('span').children('input').removeClass('succes-form');
                }else if (el.hasClass( "up-file" )) {
                    el.next('span').removeClass('succes-form');
                }else{
                    el.removeClass('succes-form');
                }
            },
        };        
        this.each(function() { //bucle para recorrer cada elemento al invocar el plugin
            var element = $(this);
            var contenido = element.val();
            var id_elem = element.attr("id");
            var tip_val = element.attr("data-valid");
            var required = isset(element.attr("required")) ? true : false;
            var visible = element.is(':visible');
            var tipo = element.prop("type");
            if(visible || tipo != 'hidden'){
                if(isset(tip_val)){
                    if(empty(contenido)){
                        validations.removeSucces(element);
                        validations.addError(element,"El campo es obligatorio");
                        cont_errores++;
                    }else{
                        var res = validations.tipoValidacion(contenido,tip_val);
                        if(res.valido() == true){
                            validations.removeError(element);
                            validations.addSucces(element);
                        }else if(res.valido() == false){
                            validations.removeSucces(element);
                            validations.addError(element,res.message());
                            cont_errores++;
                        }else if(res.valido() == -1){
                            cont_errores++;
                            validations.removeError(element);
                            validations.removeSucces(element);
                        }
                    }
                }else if(required == true){
                    if(empty(contenido)){
                        validations.removeSucces(element);
                        validations.removeError(element);
                        validations.addError(element,"El campo es obligatorio");
                        cont_errores++;
                    }else{
                        validations.removeError(element);
                        validations.addSucces(element);
                    }
                }
            }
        });
        return {
            errors : function() {
                return cont_errores;
            }
        }
    }
})(jQuery);