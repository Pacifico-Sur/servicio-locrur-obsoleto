const cleanFuncName = function (x) { var cfn = x.split('-').join(''); cfn = cfn.charAt(0).toUpperCase() + cfn.slice(1); return cfn; }
const dashLowerText = function (x) {
    return data = RemoveAccents(x.split(' ').join('')).toLowerCase();
    //return x.split(' ').join('').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
const btn = function (x, y, z) {return $('<button/>', { class: x, value: z }).text(y)}
const div = function (x, y) {return $('<div/>', { class: x }).text(y)}
const table = function (x, y) {return $('<table/>', { class: x }).text(y)}
const tr = function (x, y, z) {return $('<tr/>').append($('<td/>').text(x + ':')).append($('<td/>').append(z == null ? y : resLabel(z,y)))}
const forRadio = function (x, y) { var data = softData(x[1]) + x[0] + '-' + softData(y); return data;}
const resAttr = function (a) { return a == null ? {} : a }
const resLabel = function (l,o) { return l == null ? '' : $.map(l ,function (a) { e = o; o = ''; return $('<' + a.label + '>').attr(resAttr(a.attr)).html(e); }) }
const softData = function (x) {
    var data = RemoveAccents(x.split(' ').join('')).toLowerCase().substring(0, 10);
    return data;
}
const RemoveAccents = function(strAccents) 
{
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}
const buildJsonArr = function(data, field) {
    var arr = [];
    $.each(data, function( x, y ) {
        arr.push(y[field]);
    });
    return arr;
}
const capital_letter = function(str) {
    str = str.toLowerCase();
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
}
const meses = {'01':'enero','02':'febrero','03':'marzo','04':'abril','05':'mayo','06':'junio','07':'julio','08':'agosto','09':'septiembre','10':'octubre','11':'noviembre','12': 'diciembre'};
const formato_fecha = function(f) {
    //console.log("camara fechuki");
    if (f) {
        f = f.split('-');
        f = f[2] + ' ' + meses[f[1]] + ' ' + f[0];
        return f;
    }
}