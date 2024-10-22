/*
 * NoGray JavaScript Library
 *
 * Copyright (c), All right reserved
 * Gazing Design - http://www.NoGray.com
 * http://www.nogray.com/license.php
 */

var ng_config_defaults = {
	assets_dir: null, // null will default to the ng_all.js folder,

	css_skin_prefix: 'dark_',

	use_ui: true, // use UI features from version 1.2.0
	load_icons: false, // load the icons CSS file (vs 1.2.0)

	language: 'en',

	animation_time: 500,
	animation_easing: 'quad_in_out',
	animation_FPS: 60,

	button_color: 'transparent', // deprecated and will be removed in vs 1.2.5
	button_over_color: '#ffd06e', // deprecated and will be removed in vs 1.2.5
	button_disable_color: null, // deprecated and will be removed in vs 1.2.5
	button_down_color: null, // deprecated and will be removed in vs 1.2.5
	button_text_color: null, // deprecated and will be removed in vs 1.2.5
	button_checked_color: '#f5be5b', // deprecated and will be removed in vs 1.2.5
	button_gloss: false, // deprecated and will be removed in vs 1.2.5
	button_light_border: false, // deprecated and will be removed in vs 1.2.5

	xhr_timeout_length: 10,
	xhr_encoding: 'utf-8'
};

var ng = {
	version: "1.2.1",
	is_lite: false,
	start_ini_time: new Date().getTime(),
	browser: {
		ie: !!((window.attachEvent && !window.opera) || (navigator.userAgent.indexOf("Trident") > -1)),
		ie6: !!(document.attachEvent && !window.opera && !window.XMLHttpRequest),
		opera: !!(window.opera),
		webkit: (navigator.userAgent.indexOf("AppleWebKit/") > -1),
		chrome: (navigator.userAgent.indexOf("Chrome/") > -1),
		gecko: (navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML") == -1 && navigator.userAgent.indexOf("Trident") == -1),
		mobile_safari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
		get_ie_version: function () {
			if (!ng.browser.ie) {
				return -1
			}
			if (ng.defined(ng.browser.cached_ie_version)) {
				return ng.browser.cached_ie_version
			}
			var d = navigator.userAgent.indexOf("MSIE");
			var c = -1;
			var a = navigator.userAgent;
			if (d == -1) {
				d = a.indexOf("Trident");
				d = a.indexOf(":", d) + 1;
				c = parseFloat(a.substr(d))
			} else {
				var b = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
				if (b.exec(a) != null) {
					c = parseFloat(RegExp.$1)
				}
			}
			ng.browser.cached_ie_version = c;
			return c
		},
		cached_ie_version: null,
		supported_input: null,
		support_input: function (b) {
			var b = b.toLowerCase();
			if (!ng.defined(ng.browser.supported_input)) {
				ng.browser.supported_input = {}
			}
			if (!ng.defined(ng.browser.supported_input[b])) {
				var a = document.createElement("input");
				a.setAttribute("type", b);
				ng.browser.supported_input[b] = (a.type.toLowerCase() == b)
			}
			return ng.browser.supported_input[b]
		},
		loaded: false
	},
	defined: function (a) {
		return (a != undefined)
	},
	type: function (a) {
		if (!ng.defined(a)) {
			return "undefined"
		}
		if (a.has_type) {
			return a.has_type
		} else {
			if (a.callee) {
				return "arguments"
			} else {
				if (a.tagName) {
					return "html_element"
				} else {
					return typeof a
				}
			}
		}
	},
	random: function (b, a, d) {
		if (!ng.defined(d)) {
			d = []
		}
		if (ng.type(d) != "array") {
			d = [d]
		}
		var c = 0;
		while (1) {
			c = Math.floor(Math.random() * (a - b + 1) + b);
			if (!d.has(c)) {
				return c
			}
		}
	},
	random_id: function (a) {
		if (!ng.defined(a)) {
			a = "random"
		}
		return "ng_" + a + "_" + ng.random(0, 9999) + "_" + ng.random(0, 9999)
	},
	extend: function (c, a) {
		for (var b in a) {
			if (ng.type(a[b]) == "array") {
				if (ng.defined(a[b].clone)) {
					c[b] = a[b].clone()
				} else {
					c[b] = a[b]
				}
			} else {
				if (ng.type(a[b]) == "object") {
					c[b] = ng.obj_clone(a[b])
				} else {
					c[b] = a[b]
				}
			}
		}
		return c
	},
	extend_proto: function (b, a) {
		ng.extend(b.prototype, a)
	},
	extend_event: function (a) {
		if (ng.defined(a.ng_extended)) {
			return a
		}
		a.ng_extended = true;
		if ((ng.defined(a.targetTouches)) && (ng.defined(a.targetTouches[0])) && (ng.defined(a.targetTouches[0].pageX))) {
			a.pointerId = a.targetTouches[0].identifier;
			a.top = a.targetTouches[0].pageY;
			a.left = a.targetTouches[0].pageX
		} else {
			if (a.pageX) {
				a.top = a.pageY;
				a.left = a.pageX
			} else {
				a.top = (a.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop));
				a.left = (a.clientX + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft))
			}
		}
		if (a.wheelDelta) {
			a.wheel = (a.wheelDelta / 120)
		}
		a.stop_bubble = function () {
			this.is_stopped = true;
			if (this.stopPropagation) {
				this.stopPropagation()
			} else {
				this.cancelBubble = true
			}
			return this
		}.bind(a);
		a.stop_default = function () {
			this.is_stopped = true;
			if (this.preventDefault) {
				this.preventDefault()
			} else {
				this.returnValue = false
			}
			return this
		}.bind(a);
		a.is_stopped = false;
		a.stop = function () {
			this.stop_bubble();
			this.stop_default();
			return this
		}.bind(a);
		if (!a.target) {
			a.src_element = ng.get(a.srcElement)
		} else {
			a.src_element = ng.get(a.target)
		}
		a.code = (a.keyCode || a.which);
		if (!ng.defined(a.key)) {
			if ((a.type.toLowerCase() == "keydown") || (a.type.toLowerCase() == "keyup")) {
				var c = [];
				c[27] = "esc";
				c[8] = "backspace";
				for (var b = 112; b <= 123; b++) {
					c[b] = "f" + (a.code - 111)
				}
				c[19] = "pause break";
				c[45] = "ins";
				c[46] = "del";
				c[144] = "num lock";
				c[9] = "tab";
				c[20] = "caps lock";
				c[16] = "shift";
				c[17] = "ctrl";
				c[91] = "windows";
				c[18] = "alt";
				c[93] = "context";
				c[38] = "up";
				c[39] = "right";
				c[40] = "down";
				c[37] = "left";
				c[36] = "home";
				c[33] = "pg up";
				c[34] = "pg dn";
				c[35] = "end";
				c[32] = "space";
				c[13] = "enter";
				if (ng.defined(c[a.code])) {
					a.key = c[a.code]
				} else {
					a.key = String.fromCharCode(a.code).toLowerCase()
				}
			} else {
				a.key = String.fromCharCode(a.code)
			}
		}
		a.get_key = function () {
			var d = this.key;
			if (d.length > 1) {
				d = d.toLowerCase()
			}
			var e = {
				pageup: "pg up",
				pagedown: "pg dn",
				insert: "ins",
				capslock: "caps lock",
				control: "ctrl",
				win: "windows",
				apps: "context",
				spacebar: "space"
			};
			if (ng.defined(e[d])) {
				d = e[d]
			}
			return d
		};
		return a
	},
	eval: function (b) {
		if (!ng.defined(b)) {
			return
		}
		if (b == "") {
			return
		}
		if (ng.browser.loaded) {
			var a = document.createElement("script");
			a.type = "text/javascript";
			a.text = b;
			document.body.appendChild(a);
			(function () {
				document.body.removeChild(a)
			}.delay(500))
		}
	},
	include_script: function (b) {
		var a = document.createElement("script");
		a.type = "text/javascript";
		a.src = b;
		document.getElementsByTagName("head")[0].appendChild(a);
		return a
	},
	get_xhr: function () {
		if ((location.protocol == "file:") && (window.ActiveXObject)) {
			return ng.get_activex_xhr()
		}
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest()
		} else {
			if (window.ActiveXObject) {
				return ng.get_activex_xhr()
			} else {
				return false
			}
		}
	},
	get_activex_xhr: function () {
		try {
			return new ActiveXObject("MSXML2.XMLHTTP")
		} catch (a) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP")
			} catch (a) {
				return false
			}
		}
	},
	eval_json: function (json, secure) {
		if (ng.defined(window.JSON)) {
			return JSON.parse(json)
		}
		var cx = new RegExp("[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]", "g");
		if (cx.test(json)) {
			json = json.replace(cx, function (a) {
				return "\\u" + ("0000" + (+(a.charCodeAt(0))).toString(16)).slice(-4)
			})
		}
		if (!ng.defined(secure)) {
			secure = false
		}
		if (secure) {
			return ng.eval(json)
		}
		if (/^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
			return ng.eval(json)
		}
		return {}
	},
	make_query: function (b) {
		if (!ng.defined(b)) {
			return ""
		}
		if (b.to_query) {
			return b.to_query()
		}
		if (ng.type(b) == "object") {
			var a = [];
			ng.obj_each(b, function (e, c) {
				var d = ng.make_query(e);
				if (d != "") {
					a.push(c.to_query() + "=" + d)
				}
			});
			return a.join("&")
		}
		return b.toString().to_query()
	},
	make_json: function (b) {
		if (ng.defined(window.JSON)) {
			return JSON.stringify(b)
		}
		if (!ng.defined(b)) {
			return "null"
		}
		if (b.to_json) {
			return b.to_json()
		}
		if (ng.type(b) == "object") {
			var a = [];
			ng.obj_each(b, function (e, c) {
				var d = ng.make_json(e);
				if (d != "") {
					a.push(c.to_json() + ":" + d)
				}
			});
			return "{" + a.join(",") + "}"
		} else {
			if (ng.type(b) == "boolean") {
				if (b) {
					return "true"
				} else {
					return "false"
				}
			}
		}
		return b.toString().to_json()
	},
	array: function (e, c) {
		if (ng.type(e) == "array") {
			return e
		} else {
			if (ng.type(e) == "string") {
				if (!ng.defined(c)) {
					c = ","
				}
				return e.split(c)
			} else {
				if (ng.type(e) == "arguments") {
					return Array.prototype.slice.call(e, 0)
				} else {
					if (ng.defined(e.length)) {
						var a = [];
						for (var d = 0, b = e.length; d < b; d++) {
							a.push(e[d])
						}
						return a
					}
				}
			}
		}
		return []
	},
	ready: function (a) {
		if (ng.browser.loaded) {
			a.defer()
		} else {
			ng.ready_funcs_arr.push(a)
		}
	},
	on_ready_arr: {},
	on_ready_timer: 0,
	on_ready: function (b, a) {
		if (ng.defined(b)) {
			if (ng.defined(document.getElementById(b))) {
				a.defer(ng.get(b));
				if (ng.defined(ng.on_ready_arr[b])) {
					delete ng.on_ready_arr[b]
				}
			} else {
				if (!ng.defined(ng.on_ready_arr[b])) {
					ng.on_ready_arr[b] = a
				}
			}
		} else {
			ng.obj_each(ng.on_ready_arr, function (d, c) {
				ng.on_ready(c, d)
			})
		}
		if (!ng.browser.loaded) {
			clearTimeout(ng.on_ready_timer);
			ng.on_ready_timer = ng.on_ready.delay(50)
		}
	},
	hold_html: function (a) {
		if (!ng.defined(ng.dump_div)) {
			try {
				ng.dump_div = document.createElement("div");
				document.body.insertBefore(ng.dump_div, document.body.firstChild);
				ng.dump_div.style.display = "none";
				ng.dump_div.style.position = "absolute";
				(function () {
					try {
						ng.dump_div.style.top = "-500px;"
					} catch (d) {}
				}.defer())
			} catch (b) {
				var c = ng.random_id("ng_dump_div");
				document.write('<div id="' + c + '" style="display:none; position:absolute; top:-500px;"></div>');
				ng.dump_div = document.getElementById(c)
			}
		}
		ng.dump_div.innerHTML = a
	},
	ready_func: function () {
		if (ng.browser.loaded) {
			return
		}
		ng.browser.loaded = true;
		ng.load_time = new Date().getTime() - ng.start_ini_time;
		for (var a = 0; a < ng.ready_funcs_arr.length; a++) {
			ng.ready_funcs_arr[a].defer()
		}
		ng.on_ready();
		delete ng.ready_funcs_arr, ng.on_ready_arr, ng.on_ready_timer
	},
	ready_funcs_arr: [],
	deselect_text: function () {
		if (window.getSelection) {
			window.getSelection().removeAllRanges()
		} else {
			if (document.selection) {
				document.selection.empty()
			}
		}
	},
	obj_each: function (f, d, g, c) {
		if (ng.defined(f.each)) {
			return f.each(d, g, c)
		}
		var a = true;
		if (!c) {
			c = []
		}
		if (!ng.defined(ng.current_object_properties)) {
			var b = {};
			ng.current_object_properties = ",";
			for (var e in b) {
				ng.current_object_properties += e + ","
			}
		}
		for (var e in f) {
			if (ng.current_object_properties.indexOf("," + e + ",") == -1) {
				a = d.apply(g, [f[e], e].concat(c));
				if (!ng.defined(a)) {
					a = true
				}
				if (!a) {
					break
				}
			}
		}
		return f
	},
	obj_merge: function (a, b) {
		if (ng.defined(a.merge)) {
			return a.merge(b)
		}
		ng.obj_each(b, function (d, c) {
			a[c] = d
		});
		return a
	},
	obj_clone: function (a) {
		if (ng.defined(a.clone)) {
			return a.clone()
		}
		return ng.extend({}, a)
	},
	html5_options: function (obj) {
		var obj = ng.get(obj);
		var tg = obj.get("tag");
		var obj_type = "object";
		if (((tg == "input") && (obj.type.toLowerCase() != "submit") && (obj.type.toLowerCase() != "button")) || (tg == "textarea") || (tg == "select")) {
			obj_type = "input"
		}
		var re = {};
		if ((ng.defined(obj.lang)) && (obj.lang != "")) {
			re.language = obj.lang
		}
		var html5_process_val = function (val) {
			if ((val.substr(0, 4) == "new ") || ((val.substr(0, 1) == "[") && (val.substr(val.length - 1) == "]")) || ((val.substr(0, 1) == "{") && (val.substr(val.length - 1) == "}"))) {
				val = eval("(" + val + ")")
			} else {
				if (val.is_numeric()) {
					val = val.to_float()
				}
			}
			return val
		};
		if (ng.defined(obj.dataset)) {
			ng.obj_each(obj.dataset, function (val, k) {
				re[k] = html5_process_val(val)
			})
		} else {
			var loop = obj.attributes.length;
			for (var i = 0; i < loop; i++) {
				var nm = obj.attributes[i].nodeName;
				if (nm.indexOf("data-") != -1) {
					nm = nm.replace("data-", "");
					re[nm] = html5_process_val(obj.attributes[i].nodeValue)
				}
			}
		}
		re[obj_type] = obj;
		var typ = obj.getAttribute("type");
		if ((ng.defined(typ)) && (typ != "") && (ng.defined(ng.mapped_html5_prop[typ]))) {
			ng.obj_each(ng.mapped_html5_prop[typ], function (v, k) {
				var prop = obj.getAttribute(k);
				if ((ng.defined(prop)) && (prop != "")) {
					if (ng.type(v) == "function") {
						var re_obj = v(prop);
						if (ng.defined(re_obj)) {
							ng.obj_merge(re, re_obj)
						}
					} else {
						re[v] = html5_process_val(prop)
					}
				}
			})
		}
		return re
	},
	mapped_html5_prop: {},
	map_html5_prop: function (a, b) {
		var a = a.toLowerCase();
		if (!ng.defined(ng.mapped_html5_prop[a])) {
			ng.mapped_html5_prop[a] = {}
		}
		ng.obj_merge(ng.mapped_html5_prop[a], b)
	}
};
if (!ng.defined(ng_config)) {
	var ng_config = {}
}
if (ng.defined(ng_config.assests_dir)) {
	ng_config.assets_dir = ng_config.assests_dir
}
ng.obj_merge(ng_config_defaults, ng_config);
ng_config = ng_config_defaults;
ng_config.assests_dir = ng_config.assets_dir;
ng_config_defaults = null;
if (!ng.defined(ng_config.assets_dir)) {
	(function () {
		var b = document.getElementsByTagName("script");
		for (var a = 0; a < b.length; a++) {
			var c = b[a].getAttribute("src");
			if ((ng.defined(c)) && (c.indexOf("ng_all.js") != -1)) {
				ng_config.assets_dir = c.replace("ng_all.js", "assets/");
				break
			}
		}
	})()
}
ng.num_of_extra_delay_arguments = 0;
setTimeout(function () {
	ng.num_of_extra_delay_arguments = arguments.length
}, 0);
ng.extend_proto(Function, {
	set: function (f, d, c, b) {
		if (!d) {
			var d = []
		}
		if ((ng.type(d) != "array") && (ng.type(d) != "arguments")) {
			d = [d]
		}
		if (!ng.defined(c)) {
			var c = -1
		} else {
			c = c.to_int()
		}
		var a = this;
		var e = function () {
			var h = ng.array(arguments);
			if (c > -1) {
				for (var g = 0; g < ng.num_of_extra_delay_arguments; g++) {
					h.remove_key(0)
				}
			}
			return a.apply(f, h.concat(d))
		};
		if (c <= -1) {
			return e
		} else {
			if (b) {
				return setInterval(e, c)
			} else {
				return setTimeout(e, c)
			}
		}
	},
	bind: function (b, a) {
		return this.set(b, a)
	},
	delay: function (b, c, a) {
		return this.set(c, a, b)
	},
	repeat: function (b, c, a) {
		return this.set(c, a, b, true)
	},
	defer: function (b, a) {
		return this.set(b, a, 0)
	},
	inherit: function (a) {
		this.prototype = new a;
		this.prototype.constructor = this
	},
	rename_method: function (b, a) {
		this.prototype[a] = this.prototype[b];
		delete this.prototype[b]
	}
});
ng.extend_proto(RegExp, {
	has_type: "regexp"
});
ng.extend_proto(Array, {
	has_type: "array",
	clone: function () {
		var b = [];
		for (var a = 0; a < this.length; a++) {
			b[a] = this[a]
		}
		return b
	},
	each: function (e, f, c) {
		var a = true;
		if (!c) {
			c = []
		}
		for (var d = 0, b = this.length; d < b; d++) {
			a = e.apply(f, [this[d], d].concat(c));
			if (!ng.defined(a)) {
				a = true
			}
			if (!a) {
				break
			}
		}
		return this
	},
	r_each: function (b, c, a) {
		this.reverse().each(b, c, a);
		return this.reverse()
	},
	get_key: function (c, b) {
		if ((!ng.defined(b)) && (this.indexOf)) {
			var a = this.indexOf(c);
			if (a != -1) {
				return a
			}
			return null
		} else {
			if (!ng.defined(b)) {
				var b = function (d) {
					return d
				}
			}
			for (var a = 0; a < this.length; a++) {
				if (b(this[a]) == b(c)) {
					return a
				}
			}
		}
		return null
	},
	has: function (b, a) {
		return (ng.defined(this.get_key(b, a)))
	},
	unique: function () {
		var b = [];
		for (var a = 0; a < this.length; a++) {
			if (!b.has(this[a])) {
				b.push(this[a])
			}
		}
		return b
	},
	remove_value: function (c, b) {
		while (true) {
			var a = this.get_key(c, b);
			if (!ng.defined(a)) {
				break
			}
			this.remove_key(a)
		}
		return this
	},
	remove_key: function (a) {
		if (!ng.defined(a)) {
			return this
		}
		this.splice(a, 1);
		return this
	},
	empty: function () {
		this.length = 0;
		return this
	},
	to_query: function () {
		var a = [];
		for (var b = 0; b < this.length; b++) {
			a.push(ng.make_query(this[b]))
		}
		return a.join()
	},
	to_json: function () {
		if (ng.defined(window.JSON)) {
			return JSON.stringify(this)
		}
		var a = [];
		for (var b = 0; b < this.length; b++) {
			a.push(ng.make_json(this[b]))
		}
		return "[" + a.join() + "]"
	}
});
ng.extend_proto(String, {
	each: function (e, f, c) {
		var a = true;
		if (!c) {
			c = []
		}
		for (var d = 0, b = this.length; d < b; d++) {
			a = e.apply(f, [this.charAt(d), d].concat(c));
			if (!ng.defined(a)) {
				a = true
			}
			if (!a) {
				break
			}
		}
		return this
	},
	r_each: function (b, c, a) {
		return this.reverse().each(b, c, a)
	},
	reverse: function () {
		var a = "";
		this.each(function (b) {
			a = b + a
		});
		return a
	},
	cap_first_letter: function () {
		return this.substr(0, 1).toUpperCase() + this.substr(1).toLowerCase()
	},
	cap_first: function () {
		var a = this.split(" ");
		a.each(function (c, b) {
			a[b] = c.cap_first_letter()
		});
		return a.join(" ")
	},
	reverse_caps: function () {
		var a = "";
		this.each(function (b) {
			if (b.is_upper()) {
				a += b.toLowerCase()
			} else {
				a += b.toUpperCase()
			}
		});
		return a
	},
	css_camel_case: function () {
		var a = this.split("-");
		a.each(function (c, b) {
			if (b > 0) {
				a[b] = c.cap_first_letter()
			} else {
				a[b] = a[b]
			}
		});
		return a.join("")
	},
	css_hyphenate: function () {
		return this.replace(/([A-Z])/g, "-$1").toLowerCase()
	},
	shuffle: function () {
		var e = [],
			d;
		for (var c = 0, a = this.length; c < a; c++) {
			d = ng.random(0, a - 1, e);
			e.push(d)
		}
		var b = "";
		for (var c = 0; c < e.length; c++) {
			b += this.charAt(e[c])
		}
		return b
	},
	substr_count: function (b, d, a) {
		if (!ng.defined(d)) {
			d = 0
		}
		if (!ng.defined(a)) {
			a = this.length
		}
		var c = this.substr(d, a);
		return c.split(b).length - 1
	},
	is_upper: function () {
		return (this.toUpperCase() == this)
	},
	is_lower: function () {
		return (this.toLowerCase() == this)
	},
	is_numeric: function () {
		if (this == "") {
			return false
		}
		return (this.match(/^([-|+]?\s?\d*\.?\d*)$/) != null)
	},
	to_int: function () {
		return parseInt(this, 10)
	},
	to_float: function () {
		return parseFloat(this)
	},
	to_query: function () {
		return escape(this)
	},
	to_json: function () {
		if (ng.defined(window.JSON)) {
			return JSON.stringify(this)
		}
		var a = new RegExp("[\\\\'\\x00-\\x1f\\x7f-\\x9f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", "g"),
			b = {
				"\b": "\\b",
				"\t": "\\t",
				"\n": "\\n",
				"\f": "\\f",
				"\r": "\\r",
				'"': "'",
				"\\": "\\\\"
			};
		if (a.test(this)) {
			return '"' + this.replace(a, function (d) {
				var e = b[d];
				if (typeof e === "string") {
					return e
				}
				return "\\u" + ("0000" + (+(d.charCodeAt(0))).toString(16)).slice(-4)
			}) + '"'
		}
		return '"' + this + '"'
	},
	strip_tags: function () {
		return this.replace(/<\/?[^>]+>/gi, "")
	},
	trim: function () {
		return this.replace(/^\s+|\s+$/g, "")
	},
	ltrim: function () {
		return this.replace(/^\s+/, "")
	},
	rtrim: function () {
		return this.replace(/\s+$/, "")
	},
	get_tags: function (a) {
		var b = [];
		a = a.toLowerCase();
		var c = new RegExp("(<" + a + "\\b[^>]*((>([\\s\\S.]*?)</" + a + ">)|(/>)))", "gi");
		var d;
		while (d = c.exec(this)) {
			b.push(d[0])
		}
		return b
	},
	eval_script: function () {
		var regexp = new RegExp("<script\\b[^>]*>([\\s\\S.]*?)<\\/script>", "i");
		var scrpts = this.get_tags("script");
		for (var i = 0; i < scrpts.length; i++) {
			ng.eval(regexp.exec(scrpts[i])[1].trim())
		}
	},
	shorten: function (a, b) {
		if (!ng.defined(b)) {
			b = "..."
		}
		if (this.length > a) {
			return this.substr(0, a) + b
		} else {
			return this
		}
	},
	escape_regex: function () {
		var a = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
		var b = new RegExp("(\\" + a.join("|\\") + ")", "g");
		return this.replace(b, "\\$1")
	}
});
ng.extend_proto(Number, {
	to_int: function () {
		return parseInt(this, 10)
	},
	to_float: function () {
		return parseFloat(this)
	},
	round: function (a) {
		a = Math.pow(10, a || 0);
		return Math.round(this * a) / a
	},
	is_numeric: function () {
		if (isNaN(this)) {
			return false
		}
		return true
	},
	percent: function (a) {
		return (this / 100 * a)
	},
	to_json: function () {
		if (ng.defined(window.JSON)) {
			return JSON.stringify(this)
		}
		if (isFinite(this)) {
			return this.toString()
		}
		return null
	}
});
ng.extend(Math, {
	factorial: function (a) {
		if (a <= 0) {
			return 1
		}
		if (a > 170) {
			return Infinity
		}
		var c = 1;
		for (var b = a; b > 0; b--) {
			c *= b
		}
		return c
	},
	choose: function (d, c) {
		return (Math.factorial(d)) / (Math.factorial(c) * Math.factorial(d - c))
	},
	sum: function (b, a, d) {
		if (!ng.defined(d)) {
			d = function (f) {
				return f
			}
		}
		var e = 0;
		for (var c = b; c <= a; c++) {
			e += d.apply(null, [c, a])
		}
		return e
	}
});
ng.extend_proto(Date, {
	has_type: "date",
	clone: function () {
		return new Date(this.getTime())
	},
	days_in_month: function () {
		var a = new Date(this.getFullYear(), this.getMonth() + 1, 0);
		return a.getDate()
	},
	is_leap_year: function () {
		var a = new Date(this.getFullYear(), 1, 29);
		return (a.getMonth() == 1)
	},
	from_string: function (g) {
		var c = g.toLowerCase().replace(/(\s)*([\+|-])(\s)*/g, "$2");
		var b = false;
		if ((c.indexOf("+") != -1) || (c.indexOf("today-") != -1) || (c.indexOf("month-") != -1) || (c.indexOf("year-") != -1)) {
			b = true
		}
		if (!b) {
			g = g.replace("1st", "1").replace("2nd", "2").replace("3rd", "3");
			var f = Date.parse(g.replace(/[-|\\]/g, "/"))
		} else {
			var f = g.to_int()
		}
		if (isNaN(f)) {
			var i = this.getFullYear(),
				a = this.getMonth(),
				e = this.getDate();
			g = g.toLowerCase().replace(/(\s)*([\+|-])(\s)*/g, "$2");
			g = g.replace("yesterday", "today-1").replace("tomorrow", "today+1").replace("last month", "month-1").replace("next month", "month+1").replace("last year", "year-1").replace("next year", "year+1");
			if (g.indexOf("today+") >= 0) {
				e = e + g.replace("today+", "").to_int()
			} else {
				if (g.indexOf("today-") >= 0) {
					e = e - g.replace("today-", "").to_int()
				} else {
					if (g.indexOf("month+") >= 0) {
						a = a + g.replace("month+", "").to_int();
						var h = new Date(i, a, 1).days_in_month();
						if (e > h) {
							e = h
						}
					} else {
						if (g.indexOf("month-") >= 0) {
							a = this.getMonth() - g.replace("month-", "").to_int();
							var h = new Date(i, a, 1).days_in_month();
							if (e > h) {
								e = h
							}
						} else {
							if (g.indexOf("year+") >= 0) {
								i = i + g.replace("year+", "").to_int();
								var h = new Date(i, a, 1).days_in_month();
								if (e > h) {
									e = h
								}
							} else {
								if (g.indexOf("year-") >= 0) {
									i = this.getFullYear() - g.replace("year-", "").to_int();
									var h = new Date(i, a, 1).days_in_month();
									if (e > h) {
										e = h
									}
								}
							}
						}
					}
				}
			}
			this.setFullYear(i);
			this.setMonth(a);
			this.setDate(e)
		} else {
			this.setTime(f)
		}
		return this
	},
	from_object: function (a) {
		var g = {};
		var d;
		for (d in a) {
			g[d] = a[d]
		}
		var k = ng.defined;
		if (!k(g.date)) {
			g.date = this.getDate()
		}
		if (!k(g.month)) {
			g.month = this.getMonth()
		}
		if (!k(g.year)) {
			g.year = this.getFullYear()
		}
		if (!k(g.hour)) {
			g.hour = this.getHours()
		}
		if (!k(g.minute)) {
			g.minute = this.getMinutes()
		}
		if (!k(g.second)) {
			g.second = this.getSeconds()
		}
		if (!k(g.millisecond)) {
			g.millisecond = this.getMilliseconds()
		}
		if (ng.type(g.date) != "string") {
			this.setTime(new Date(g.year, g.month, g.date, g.hour, g.minute, g.second, g.millisecond).getTime());
			return this
		}
		g.date = g.date.toLowerCase();
		var f = new Date(g.year, g.month, 1);
		var b;
		if (g.date.indexOf("sunday") != -1) {
			b = 0
		} else {
			if (g.date.indexOf("monday") != -1) {
				b = 1
			} else {
				if (g.date.indexOf("tuesday") != -1) {
					b = 2
				} else {
					if (g.date.indexOf("wednesday") != -1) {
						b = 3
					} else {
						if (g.date.indexOf("thursday") != -1) {
							b = 4
						} else {
							if (g.date.indexOf("friday") != -1) {
								b = 5
							} else {
								if (g.date.indexOf("saturday") != -1) {
									b = 6
								}
							}
						}
					}
				}
			}
		}
		if (f.getDay() > b) {
			var e = (7 - f.getDay()) + b + 1
		} else {
			if (f.getDay() < b) {
				var e = b - f.getDay() + 1
			} else {
				var e = 1
			}
		}
		var l = ["1st", "2nd", "3rd", "4th", "5th"];
		var i = 5;
		var j = f.days_in_month();
		while (g.date.indexOf("last") != -1) {
			if ((e + (i * 7)) <= j) {
				g.date = g.date.replace("last", l[i])
			}
			i--;
			if (i < 0) {
				g.date = g.date.replace("last", "1st")
			}
		}
		var h;
		if (g.date.indexOf("1st") != -1) {
			h = 0
		} else {
			if (g.date.indexOf("2nd") != -1) {
				h = 1
			} else {
				if (g.date.indexOf("3rd") != -1) {
					h = 2
				} else {
					if (g.date.indexOf("4th") != -1) {
						h = 3
					} else {
						if (g.date.indexOf("5th") != -1) {
							h = 4
						}
					}
				}
			}
		}
		this.setTime(new Date(g.year, g.month, e + (h * 7), g.hour, g.minute, g.second, g.millisecond).getTime());
		return this
	},
	print: function (o, n) {
		var a = ng.Language.get_language(n).date;
		if (!ng.defined(o)) {
			var o = a.date.date_format + " " + a.date.time_format
		}
		var k = this.getDate();
		var r = this.getDay();
		var c = this.getMonth();
		var l = this.getFullYear();
		var j = this.getHours();
		var q = "";
		if (!ng.defined(a.numbers_ordinal)) {
			if (n == "en") {
				a.numbers_ordinal = ["st", "nd", "rd", "th"]
			} else {
				a.numbers_ordinal = ["", "", "", ""]
			}
		}
		o = o.replace(/c/g, "Y-m-dTH:i:sP");
		o = o.replace(/r/g, "D, d M Y H:i:s O");
		for (var f = 0; f < o.length; f++) {
			var b = o.charAt(f);
			if (b == "d") {
				if (k < 10) {
					q += "0"
				}
				q += k
			} else {
				if (b == "D") {
					q += a.days["mid"][r]
				} else {
					if (b == "j") {
						q += k
					} else {
						if (b == "l") {
							q += a.days["long"][r]
						} else {
							if (b == "N") {
								var g = r;
								if (g == 0) {
									g = 7
								}
								q += g
							} else {
								if (b == "S") {
									if ((k == 1) || (k == 21) || (k == 31)) {
										q += a.numbers_ordinal[0]
									} else {
										if ((k == 2) || (k == 22)) {
											q += a.numbers_ordinal[1]
										} else {
											if ((k == 3) || (k == 23)) {
												q += a.numbers_ordinal[2]
											} else {
												q += a.numbers_ordinal[3]
											}
										}
									}
								} else {
									if (b == "w") {
										q += r
									} else {
										if (b == "z") {
											q += this.get_day_in_year()
										} else {
											if (b == "F") {
												q += a.months["long"][c]
											} else {
												if (b == "M") {
													q += a.months["short"][c]
												} else {
													if (b == "m") {
														if (c + 1 < 10) {
															q += 0
														}
														q += c + 1
													} else {
														if (b == "n") {
															q += c + 1
														} else {
															if (b == "t") {
																q += this.days_in_month()
															} else {
																if (b == "L") {
																	if (this.is_leap_year()) {
																		q += 1
																	} else {
																		q += 0
																	}
																} else {
																	if ((b == "Y") || (b == "o")) {
																		q += l
																	} else {
																		if (b == "y") {
																			q += l.toString().substr(2, 2)
																		} else {
																			if (b == "a") {
																				if (j < 12) {
																					q += a.am_pm.lowercase[0]
																				} else {
																					q += a.am_pm.lowercase[1]
																				}
																			} else {
																				if (b == "A") {
																					if (j < 12) {
																						q += a.am_pm.uppercase[0]
																					} else {
																						q += a.am_pm.uppercase[1]
																					}
																				} else {
																					if (b == "B") {
																						q += this.to_swatch_internet_time()
																					} else {
																						if (b == "g") {
																							var p = (j % 12);
																							if (p == 0) {
																								p = 12
																							}
																							q += p
																						} else {
																							if (b == "G") {
																								q += j
																							} else {
																								if (b == "h") {
																									var p = (j % 12);
																									if (p == 0) {
																										p = 12
																									}
																									if (p < 10) {
																										q += 0
																									}
																									q += p
																								} else {
																									if (b == "H") {
																										if (j < 10) {
																											q += 0
																										}
																										q += j
																									} else {
																										if (b == "i") {
																											if (this.getMinutes() < 10) {
																												q += 0
																											}
																											q += this.getMinutes()
																										} else {
																											if (b == "s") {
																												if (this.getSeconds() < 10) {
																													q += 0
																												}
																												q += this.getSeconds()
																											} else {
																												if (b == "u") {
																													q += this.getMilliseconds()
																												} else {
																													if ((b == "O") || (b == "P")) {
																														var p = -1 * (this.getTimezoneOffset()) / 60;
																														var e = p - Math.floor(p);
																														e = e * 60;
																														p = Math.floor(p);
																														e = Math.floor(e);
																														if (p == 0) {
																															p = "00"
																														} else {
																															if ((p > -10) && (p < 0)) {
																																p = "-0" + Math.abs(p)
																															} else {
																																if ((p < 10) && (p > 0)) {
																																	p = "0" + p
																																} else {
																																	p = p.toString()
																																}
																															}
																														}
																														if (p > 0) {
																															q += "+"
																														}
																														if (e < 10) {
																															e = "0" + e
																														} else {
																															e = e.toString()
																														}
																														if (b == "P") {
																															var s = ":"
																														} else {
																															var s = ""
																														}
																														q += p + s + e
																													} else {
																														if (b == "Z") {
																															q += this.getTimezoneOffset()
																														} else {
																															if (b == "U") {
																																q += Math.floor(this.time_difference(new Date(1970, 0, 1)) / 1000)
																															} else {
																																q += b
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return ng.Language.translate_numbers(q, n)
	},
	get_week_in_year: function () {
		return Math.floor(this.get_day_in_year() / 7)
	},
	get_day_in_year: function () {
		return Math.floor(this.get_hour_in_year() / 24)
	},
	get_hour_in_year: function () {
		return Math.floor(this.get_minute_in_year() / 60)
	},
	get_minute_in_year: function () {
		return Math.floor(this.get_second_in_year() / 60)
	},
	get_second_in_year: function () {
		return Math.floor(this.get_millisecond_in_year() / 1000)
	},
	get_millisecond_in_year: function () {
		return this.time_difference(new Date(this.getFullYear(), 0, 1))
	},
	get_week_since: function (a) {
		return Math.floor(this.get_day_since(a) / 7)
	},
	get_day_since: function (a) {
		return Math.floor(this.get_hour_since(a) / 24)
	},
	get_hour_since: function (a) {
		return Math.floor(this.get_minute_since(a) / 60)
	},
	get_minute_since: function (a) {
		return Math.floor(this.get_second_since(a) / 60)
	},
	get_second_since: function (a) {
		return Math.floor(this.get_millisecond_since(a) / 1000)
	},
	get_millisecond_since: function (a) {
		return this.time_difference(a)
	},
	time_difference: function (a) {
		return this.getTime() - a.getTime()
	},
	to_swatch_internet_time: function () {
		var a = (this.getHours() * 3600) + (this.getMinutes() * 60) + this.getSeconds() + ((this.getTimezoneOffset() + 60) * 60);
		var b = Math.floor(a / 86.4);
		return ("@" + b)
	},
	from_swatch_internet_time: function (b) {
		if (ng.type(b) == "string") {
			b = b.replace("@", "").to_int()
		}
		var a = Math.floor(b * 86.4) - ((this.getTimezoneOffset() + 60) * 60);
		this.setTime(new Date(this.getFullYear(), this.getMonth(), this.getDate()).getTime() + (a * 1000));
		return this
	},
	to_query: function () {
		return this.print("c").to_query()
	},
	to_json: function () {
		if (ng.defined(window.JSON)) {
			return JSON.stringify(this)
		}
		return this.print("c").to_json()
	}
});

//Warning on web INI
var passiveEvent = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function () {
            passiveEvent = true;
        }
    });
    window.addEventListener("test", null, opts);
} catch (e) { }

// in my case I need both passive and capture set to true, change as you need it.
passiveEvent = passiveEvent ? { capture: true, passive: true } : true;

//if you need to handle mouse wheel scroll
//var supportedWheelEvent: string = "onwheel" in HTMLDivElement.prototype ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
//End

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", ng.ready_func, false );
	window.addEventListener("load", ng.ready_func, false )
} else {
	document.attachEvent("onreadystatechange", function () {
		var a = document.createElement("script");
		a.type = "text/jscript";
		a.defer = true;
		a.text = "ng.ready_func();";
		document.getElementsByTagName("head")[0].appendChild(a)
	});
	window.attachEvent("onload", ng.ready_func)
}
ng.Events = function () {
	this.p = {
		events: null,
		has_event: null,
		func: null
	}
};
ng._custom_events = {};
ng.extend_proto(ng.Events, {
	has_type: "event",
	add_event: function (b, c) {
		b = this.fix_event_name(b);
		if ((this.p.is_html) && (this.is_unsupported_event(b))) {
			var a = this.get_unsupported_event(b, c);
			b = a[0];
			c = a[1];
			a = null
		}
		if (!ng.defined(this.p.events)) {
			this.p.events = {}
		}
		if (!ng.defined(this.p.events[b])) {
			this.p.events[b] = []
		}
		this.p.events[b].push(c);
		if (this.p.is_html) {
			if (!ng.defined(this.p.has_event)) {
				this.p.has_event = []
			}
			if (!this.p.has_event.has(b)) {
				if (!ng.defined(this.p.func)) {
					this.p.func = {}
				}
				this.p.has_event.push(b);
				if (document.addEventListener) {
					this.p.func[b + "_add"] = function (f) {
						this.fire_event(f.type, null, f)
					}.bind(this);
					if (b == "onDommousescroll") {
						var d = "DOMMouseScroll"
					} else {
						var d = b.substr(2);
						if (d.substr(0, 2) != "MS") {
							d = d.toLowerCase()
						}
					}
					this.addEventListener(d, this.p.func[b + "_add"], false )
				} else {
					this.p.func[b + "_attach"] = function () {
						this.fire_event(event.type, null, event)
					}.bind(this);
					this.attachEvent(b.toLowerCase(), this.p.func[b + "_attach"])
				}
			}
		}
		return this
	},
	add_events: function (a) {
		ng.obj_each(a, function (c, b) {
			this.add_event(b, c)
		}, this);
		return this
	},
	is_unsupported_event: function (a) {
		var b = [];
		if (!ng.browser.ie) {
			b.push("mouseenter", "mouseleave");
			if (ng.browser.gecko) {
				b.push("mousewheel")
			}
		}
		if (b.length > 0) {
			var c = new RegExp("(" + b.join("|") + ")", "gi");
			return c.test(a)
		}
		return false
	},
	get_unsupported_event: function (a, c) {
		if (!ng.defined(c)) {
			c = ""
		}
		if (!ng.defined(this.id)) {
			this.id = ng.random_id("event")
		}
		if (this.id == "") {
			this.id = ng.random_id("event")
		}
		var b = this.id + "_" + a + "_" + c.toString().replace(/[\s|\n]/g, "");
		if ((a == "onMouseenter") || (a == "onMouseleave")) {
			if ((ng.defined(c)) && (!ng.defined(ng._custom_events[b]))) {
				ng._custom_events[b] = function (d) {
					var e = d.relatedTarget;
					if (!ng.defined(e)) {
						return
					}
					var f = ng.get(e);
					if ((this !== f) && (f.is_child_of(this))) {
						return
					}
					c.apply(this, arguments)
				}.bind(this)
			}
		}
		if (a == "onMousewheel") {
			if ((ng.defined(c)) && (!ng.defined(ng._custom_events[b]))) {
				ng._custom_events[b] = function (d) {
					if (d.detail) {
						d.wheel = -1 * d.detail / 3
					} else {
						d.wheel = 0
					}
					c.apply(this, arguments)
				}.bind(this)
			}
			return ["onDommousescroll", ng._custom_events[b]]
		} else {
			if (a == "onMouseenter") {
				return ["onMouseover", ng._custom_events[b]]
			} else {
				if (a == "onMouseleave") {
					return ["onMouseout", ng._custom_events[b]]
				}
			}
		}
	},
	remove_event: function (b, d) {
		if (!ng.defined(this.p.events)) {
			return
		}
		b = this.fix_event_name(b);
		if ((this.p.is_html) && (this.is_unsupported_event(b))) {
			var a = this.get_unsupported_event(b, d);
			var c = b + "_" + d.toString().replace(/[\s|\n]/g, "");
			delete ng._custom_events[c];
			b = a[0];
			d = a[1];
			a = null
		}
		if (!ng.defined(this.p.events[b])) {
			return
		} else {
			this.p.events[b].remove_value(d)
		}
		if (this.p.events[b].length == 0) {
			this.clear_events(b)
		}
		return this
	},
	remove_events: function (a) {
		ng.obj_each(a, function (c, b) {
			this.remove_event(b, c)
		}, this);
		return this
	},
	clear_events: function (b) {
		if (!ng.defined(this.p.events)) {
			return
		}
		b = this.fix_event_name(b);
		if ((this.p.is_html) && (this.is_unsupported_event(b))) {
			ng.obj_each(ng._custom_events, function (e, d) {
				if (d.indexOf(b + "_") === 0) {
					delete ng._custom_events[d]
				}
			});
			var a = this.get_unsupported_event(b);
			b = a[0];
			a = null
		}
		this.p.events[b] = [];
		if (ng.defined(this.p.has_event)) {
			this.p.has_event.remove_value(b)
		}
		if (this.p.is_html) {
			if (document.detachEvent) {
				this.detachEvent(b.toLowerCase(), this.p.func[b + "_attach"])
			} else {
				if (b == "onDommousescroll") {
					var c = "DOMMouseScroll"
				} else {
					var c = b.substr(2).toLowerCase()
				}
				this.removeEventListener(c, this.p.func[b + "_add"], false)
			}
		}
		return this
	},
	clear_all_events: function () {
		if (!ng.defined(this.p.events)) {
			return
		}
		ng.obj_each(this.p.events, function (b, a) {
			this.clear_events(a)
		}.bind(this))
	},
	fire_event: function (e, c, b) {
		e = this.fix_event_name(e);
		var d = false;
		if ((this.p.is_html) && (this.is_unsupported_event(e))) {
			var a = this.get_unsupported_event(e);
			e = a[0];
			a = null;
			if (window.event) {
				d = true
			}
		}
		if ((ng.defined(this.p.events)) && (ng.defined(this.p.events[e]))) {
			if ((!ng.defined(b)) && (window.event)) {
				b = event
			}
			if (ng.defined(b)) {
				b = ng.extend_event(b)
			} else {
				b = {}
			}
			if (d) {
				b.altRelatedTarget = this
			}
			b.continue_stack = true;
			b.stop = function () {
				if (this.stop_bubble) {
					this.stop_bubble().stop_default()
				}
				if (this.stop_stack) {
					this.stop_stack()
				}
				return this
			}.bind(b);
			b.stop_stack = function () {
				this.continue_stack = false;
				return this
			}.bind(b);
			if (!ng.defined(c)) {
				c = []
			}
			if (ng.type(c) != "array") {
				c = [c]
			}
			c.push(b);
			this.p.events[e].r_each(function (f) {
				if (ng.defined(f)) {
					f.apply(this, c)
				}
				return b.continue_stack
			}, this)
		}
		return this
	},
	fix_event_name: function (a) {
		if (a.substr(0, 2) == "on") {
			a = a.substr(2)
		}
		if (a.substr(0, 2) != "MS") {
			a = a.cap_first_letter()
		}
		return "on" + a
	}
});
ng.Color = function (c, b) {
	this.p = {
		hex: "000000",
		rgb: null,
		hsl: null,
		alpha: 1
	};
	this.p.rgb = [0, 0, 0];
	this.p.hsl = [0, 0, 0];
	if (ng.type(c) == "array") {
		if (!ng.defined(b)) {
			b = "rgb"
		}
		b = b.toLowerCase();
		if (b == "hsl") {
			this.set_hsl(c)
		} else {
			this.set_rgb(c)
		}
	} else {
		if (ng.type(c) == "string") {
			if (c.indexOf("rgb") != -1) {
				c = c.replace(/[rgb(a)?|\(|\)|\s]/g, "");
				this.set_rgb(c.split(","))
			} else {
				if (c.indexOf("hsl") != -1) {
					c = c.replace(/[rgb(a)?|\(|\)|\s]/g, "");
					this.set_hsl(c.split(","))
				} else {
					var a = c.toLowerCase();
					if (a == "aqua") {
						c = "00FFFF"
					} else {
						if (a == "black") {
							c = "000000"
						} else {
							if (a == "blue") {
								c = "0000FF"
							} else {
								if (a == "fuchsia") {
									c = "FF00FF"
								} else {
									if (a == "gray") {
										c = "808080"
									} else {
										if (a == "green") {
											c = "008000"
										} else {
											if (a == "lime") {
												c = "00FF00"
											} else {
												if (a == "maroon") {
													c = "800000"
												} else {
													if (a == "navy") {
														c = "000080"
													} else {
														if (a == "olive") {
															c = "808000"
														} else {
															if (a == "purple") {
																c = "800080"
															} else {
																if (a == "red") {
																	c = "FF0000"
																} else {
																	if (a == "silver") {
																		c = "C0C0C0"
																	} else {
																		if (a == "teal") {
																			c = "008080"
																		} else {
																			if (a == "white") {
																				c = "FFFFFF"
																			} else {
																				if (a == "yellow") {
																					c = "FFFF00"
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
					this.set_hex(c)
				}
			}
		}
	}
};
ng.extend_proto(ng.Color, {
	has_type: "color",
	set_alpha: function (a) {
		a = a.to_float();
		if (a > 1) {
			a = 1
		}
		if (a < 0) {
			a = 0
		}
		this.p.alpha = a;
		return this
	},
	get_alpha: function () {
		return this.p.alpha
	},
	hsl_to_rgb: function () {
		var c = Math.round((this.p.hsl[2] * 255) / 100);
		var e = Math.round((this.p.hsl[1] * 255) / 100);
		if (e == 0) {
			this.p.rgb = [c, c, c]
		} else {
			var j = c,
				f = (255 - e) * c / 255,
				d = this.p.hsl[0] % 60;
			d = (j - f) * d / 60;
			var i, h, a;
			if (this.p.hsl[0] < 60) {
				i = j;
				a = f;
				h = f + d
			} else {
				if (this.p.hsl[0] < 120) {
					h = j;
					a = f;
					i = j - d
				} else {
					if (this.p.hsl[0] < 180) {
						h = j;
						i = f;
						a = f + d
					} else {
						if (this.p.hsl[0] < 240) {
							a = j;
							i = f;
							h = j - d
						} else {
							if (this.p.hsl[0] < 300) {
								a = j;
								h = f;
								i = f + d
							} else {
								if (this.p.hsl[0] < 360) {
									i = j;
									h = f;
									a = j - d
								} else {
									i = h = a = 0
								}
							}
						}
					}
				}
			}
			this.p.rgb = [Math.round(i), Math.round(h), Math.round(a)]
		}
	},
	rgb_to_hsl: function () {
		var a = this.p.rgb[0] / 255,
			i = this.p.rgb[1] / 255,
			j = this.p.rgb[2] / 255,
			m = 0;
		var d = Math.min(a, i, j),
			k = Math.max(a, i, j);
		var c = k - d;
		var e = Math.round(k * 100),
			n, f;
		if (c == 0) {
			this.p.hsl = [0, 0, e]
		} else {
			n = Math.round((c / k) * 100);
			del_R = (((k - a) / 6) + (c / 2)) / c;
			del_G = (((k - i) / 6) + (c / 2)) / c;
			del_B = (((k - j) / 6) + (c / 2)) / c;
			if (a == k) {
				f = del_B - del_G
			} else {
				if (i == k) {
					f = (1 / 3) + del_R - del_B
				} else {
					if (j == k) {
						f = (2 / 3) + del_G - del_R
					}
				}
			}
			if (f < 0) {
				f += 1
			}
			if (f > 1) {
				f -= 1
			}
			f = Math.round(360 * f);
			this.p.hsl = [f, n, e]
		}
	},
	hex_to_rgb: function () {
		this.p.rgb = [parseInt(this.p.hex.substr(0, 2), 16), parseInt(this.p.hex.substr(2, 2), 16), parseInt(this.p.hex.substr(4, 2), 16)]
	},
	rgb_to_hex: function () {
		this.p.hex = "";
		for (var a = 0; a < this.p.rgb.length; a++) {
			var b = this.p.rgb[a].toString(16);
			if (b.length < 2) {
				b = "0" + b
			}
			this.p.hex += b
		}
	},
	set_hsl: function (a) {
		this.p.hsl = [a[0].to_int(), a[1].to_int(), a[2].to_int()];
		if (a.length > 3) {
			this.set_alpha(a[3])
		}
		this.hsl_to_rgb();
		this.rgb_to_hex();
		return this
	},
	get_hsl: function (b) {
		var a = [this.p.hsl[0], this.p.hsl[1], this.p.hsl[2]];
		if ((ng.defined(b)) && (b)) {
			a.push(this.p.alpha)
		}
		return a
	},
	set_rgb: function (a) {
		this.p.rgb = [a[0].to_int(), a[1].to_int(), a[2].to_int()];
		if (a.length > 3) {
			this.set_alpha(a[3])
		}
		this.rgb_to_hsl();
		this.rgb_to_hex();
		return this
	},
	get_rgb: function (b) {
		var a = [this.p.rgb[0], this.p.rgb[1], this.p.rgb[2]];
		if ((ng.defined(b)) && (b)) {
			a.push(this.p.alpha)
		}
		return a
	},
	set_hex: function (b) {
		b = b.replace("#", "").toUpperCase();
		if ((b.length == 3) || (b.length == 4)) {
			var a = "";
			b.each(function (c) {
				a = c + c
			});
			b = a;
			a = null
		}
		this.p.hex = b.substr(0, 6);
		if (b.length > 6) {
			this.set_alpha(Math.round((parseInt(b.substr(6), 16) / 255) * 100) / 100)
		}
		this.hex_to_rgb();
		this.rgb_to_hsl();
		return this
	},
	get_hex: function (b) {
		var a = "#" + this.p.hex.toUpperCase();
		if ((ng.defined(b)) && (b)) {
			a += ((this.p.alpha * 100).to_int() / 100 * 255).toString(16)
		}
		return a
	},
	invert: function () {
		return this.set_rgb([255 - this.p.rgb[0], 255 - this.p.rgb[1], 255 - this.p.rgb[2]])
	},
	desaturate: function () {
		return this.set_hsl([this.p.hsl[0], 0, Math.round(this.p.hsl[2] - ((this.p.hsl[1] / 200) * this.p.hsl[2]))])
	},
	web_safe: function () {
		for (var a = 0; a < 3; a++) {
			if (this.p.rgb[a] > 230) {
				this.p.rgb[a] = 255
			} else {
				if (this.p.rgb[a] > 179) {
					this.p.rgb[a] = 204
				} else {
					if (this.p.rgb[a] > 128) {
						this.p.rgb[a] = 153
					} else {
						if (this.p.rgb[a] > 77) {
							this.p.rgb[a] = 102
						} else {
							if (this.p.rgb[a] > 25) {
								this.p.rgb[a] = 51
							} else {
								this.p.rgb[a] = 0
							}
						}
					}
				}
			}
		}
		return this.set_rgb(this.p.rgb)
	},
	to_query: function () {
		return this.get_hex().to_query()
	},
	to_json: function () {
		return this.get_hex().to_json()
	},
	mix: function (a, d) {
		if (!ng.defined(d)) {
			d = 50
		}
		d = d.to_int();
		var b = 100 - d;
		if (ng.type(a) != "color") {
			a = new ng.Color(a)
		}
		var f = this.get_rgb(true);
		var e = a.get_rgb(true);
		for (var c = 0; c < f.length; c++) {
			f[c] = f[c].percent(b);
			e[c] = e[c].percent(d)
		}
		this.set_rgb([f[0] + e[0], f[1] + e[1], f[2] + e[2], f[3] + e[3]]);
		return this
	},
	get_luminance: function () {
		return (((0.3 * this.get_rgb()[0]) + (0.59 * this.get_rgb()[1]) + (0.11 * this.get_rgb()[2])) / 255 * 100)
	},
	toString: function () {
		return this.get_hex()
	}
});
ng.Animation = function (a, e, d, c, f, b) {
	this.p = {
		timeline: null,
		current: 0,
		func: null,
		start: null,
		end: null,
		duration: null,
		easing: null,
		easing_str: "",
		delay: 0,
		timeout_key: 0,
		last_run: 0,
		status: "stopped",
		fps: ng_config.animation_FPS
	};
	this.ini(a, e, d, c, f, b);
	return this
};
ng.extend_proto(ng.Animation, ng.Events.prototype);
ng.extend_proto(ng.Animation, {
	has_type: "animation",
	ini: function (a, e, d, c, f, b) {
		this.set_func(a);
		this.set_start(e);
		this.set_end(d);
		this.set_duration(c);
		this.set_easing(f);
		this.set_fps(b);
		this.set_timeline()
	},
	reverse: function () {
		return this.ini(this.p.func, this.p.end, this.p.start, this.p.duration, this.p.easing_str)
	},
	set_timeline: function () {
		this.p.timeline = [];
		for (var a = 0, b = Math.round((this.p.duration / 1000) * this.p.fps); a < b; a++) {
			if (a == b - 1) {
				this.p.timeline.push(this.p.end)
			} else {
				if (a == 0) {
					this.p.timeline.push(this.p.start)
				} else {
					var c = {};
					ng.obj_each(this.p.start, function (e, d) {
						if (ng.type(e) == "color") {
							c[d] = new ng.Color([this.p.easing(a, e.get_rgb()[0], this.p.end[d].get_rgb()[0] - e.get_rgb()[0], b), this.p.easing(a, e.get_rgb()[1], this.p.end[d].get_rgb()[1] - e.get_rgb()[1], b), this.p.easing(a, e.get_rgb()[2], this.p.end[d].get_rgb()[2] - e.get_rgb()[2], b)])
						} else {
							c[d] = this.p.easing(a, e, this.p.end[d] - e, b)
						}
					}, this);
					this.p.timeline.push(c)
				}
			}
		}
		this.p.delay = Math.round(this.p.duration / b);
		this.p.last_run = 0;
		this.p.current = 0;
		return this
	},
	play: function () {
		this.p.status = "playing";
		this.fire_event("play");
		this.step();
		return this
	},
	go_to: function (a) {
		if (a < this.p.timeline.length) {
			this.p.func.defer(null, [this.p.timeline[a], a]);
			this.p.current = a
		}
		return this
	},
	step: function () {
		this.go_to(this.p.current);
		this.p.current++;
		this.p.last_run = new Date().getTime();
		if (this.p.current < this.p.timeline.length) {
			this.p.timeout_key = (function () {
				this.step()
			}.delay(this.p.delay, this))
		} else {
			(function () {
				this.p.status = "stopped";
				this.fire_event("finish")
			}.delay(this.p.delay, this))
		}
		return this
	},
	pause: function () {
		clearTimeout(this.p.timeout_key);
		this.p.status = "paused";
		this.fire_event("pause");
		return this
	},
	stop: function () {
		clearTimeout(this.p.timeout_key);
		this.p.timeline.empty();
		this.p.status = "stopped";
		this.fire_event("stop");
		return this
	},
	get_frame: function () {
		return this.p.current
	},
	set_func: function (a) {
		this.p.func = a;
		return this
	},
	get_func: function () {
		return this.p.func
	},
	set_start: function (a) {
		this.p.start = a;
		return this
	},
	get_start: function () {
		return this.p.start
	},
	set_end: function (a) {
		this.p.end = a;
		return this
	},
	get_end: function (a) {
		return this.p.end
	},
	set_duration: function (a) {
		if (!ng.defined(a)) {
			a = ng_config.animation_time
		}
		this.p.duration = a;
		return this
	},
	get_duration: function () {
		return this.p.duration
	},
	set_easing: function (a) {
		if (!ng.defined(a)) {
			a = ng_config.animation_easing
		}
		if (ng.type(a) == "string") {
			this.p.easing = ng.AnimationEasing[a];
			this.p.easing_str = a
		} else {
			this.p.easing = a;
			this.p.easing_str = ""
		}
		return this
	},
	get_easing: function () {
		return this.p.easing
	},
	set_fps: function (a) {
		if (!ng.defined(a)) {
			a = ng_config.animation_FPS
		}
		this.p.fps = a;
		return this
	},
	get_fps: function () {
		return this.p.fps
	},
	get_status: function () {
		return this.p.status
	}
});
ng.AnimationEasing = {
	has_type: "animationeasing",
	linear: function (e, a, g, f) {
		return g * e / f + a
	},
	quad_in: function (e, a, g, f) {
		return g * (e /= f) * e + a
	},
	quad_out: function (e, a, g, f) {
		return -g * (e /= f) * (e - 2) + a
	},
	quad_in_out: function (e, a, g, f) {
		if ((e /= f / 2) < 1) {
			return g / 2 * e * e + a
		}
		return -g / 2 * ((--e) * (e - 2) - 1) + a
	},
	cubic_in: function (e, a, g, f) {
		return g * (e /= f) * e * e + a
	},
	cubic_out: function (e, a, g, f) {
		return g * ((e = e / f - 1) * e * e + 1) + a
	},
	cubic_in_out: function (e, a, g, f) {
		if ((e /= f / 2) < 1) {
			return g / 2 * e * e * e + a
		}
		return g / 2 * ((e -= 2) * e * e + 2) + a
	},
	quart_in: function (e, a, g, f) {
		return g * (e /= f) * e * e * e + a
	},
	quart_out: function (e, a, g, f) {
		return -g * ((e = e / f - 1) * e * e * e - 1) + a
	},
	quart_in_out: function (e, a, g, f) {
		if ((e /= f / 2) < 1) {
			return g / 2 * e * e * e * e + a
		}
		return -g / 2 * ((e -= 2) * e * e * e - 2) + a
	},
	quint_in: function (e, a, g, f) {
		return g * (e /= f) * e * e * e * e + a
	},
	quint_out: function (e, a, g, f) {
		return g * ((e = e / f - 1) * e * e * e * e + 1) + a
	},
	quint_in_out: function (e, a, g, f) {
		if ((e /= f / 2) < 1) {
			return g / 2 * e * e * e * e * e + a
		}
		return g / 2 * ((e -= 2) * e * e * e * e + 2) + a
	},
	sine_in: function (e, a, g, f) {
		return -g * Math.cos(e / f * (Math.PI / 2)) + g + a
	},
	sine_out: function (e, a, g, f) {
		return g * Math.sin(e / f * (Math.PI / 2)) + a
	},
	sine_in_out: function (e, a, g, f) {
		return -g / 2 * (Math.cos(Math.PI * e / f) - 1) + a
	},
	expo_in: function (e, a, g, f) {
		return (e == 0) ? a : g * Math.pow(2, 10 * (e / f - 1)) + a
	},
	expo_out: function (e, a, g, f) {
		return (e == f) ? a + g : g * (-Math.pow(2, -10 * e / f) + 1) + a
	},
	expo_in_out: function (e, a, g, f) {
		if (e == 0) {
			return a
		}
		if (e == f) {
			return a + g
		}
		if ((e /= f / 2) < 1) {
			return g / 2 * Math.pow(2, 10 * (e - 1)) + a
		}
		return g / 2 * (-Math.pow(2, -10 * --e) + 2) + a
	},
	circ_in: function (e, a, g, f) {
		return -g * (Math.sqrt(1 - (e /= f) * e) - 1) + a
	},
	circ_out: function (e, a, g, f) {
		return g * Math.sqrt(1 - (e = e / f - 1) * e) + a
	},
	circ_in_out: function (e, a, g, f) {
		if ((e /= f / 2) < 1) {
			return -g / 2 * (Math.sqrt(1 - e * e) - 1) + a
		}
		return g / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + a
	},
	elastic_in: function (g, e, k, j) {
		if (g == 0) {
			return e
		}
		if ((g /= j) == 1) {
			return e + k
		}
		var i = j * 0.3,
			f = 1;
		if (f < Math.abs(k)) {
			f = k;
			var h = i / 4
		} else {
			var h = i / (2 * Math.PI) * Math.asin(k / f)
		}
		return -(f * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i)) + e
	},
	elastic_out: function (g, e, k, j) {
		if (g == 0) {
			return e
		}
		if ((g /= j) == 1) {
			return e + k
		}
		var i = j * 0.3,
			f = 1;
		if (f < Math.abs(k)) {
			f = k;
			var h = i / 4
		} else {
			var h = i / (2 * Math.PI) * Math.asin(k / f)
		}
		return f * Math.pow(2, -10 * g) * Math.sin((g * j - h) * (2 * Math.PI) / i) + k + e
	},
	elastic_in_out: function (g, e, k, j) {
		if (g == 0) {
			return e
		}
		if ((g /= j / 2) == 2) {
			return e + k
		}
		var i = j * 0.45,
			f = 1;
		if (f < Math.abs(k)) {
			f = k;
			var h = i / 4
		} else {
			var h = i / (2 * Math.PI) * Math.asin(k / f)
		}
		if (g < 1) {
			return -0.5 * (f * Math.pow(2, 10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i)) + e
		}
		return f * Math.pow(2, -10 * (g -= 1)) * Math.sin((g * j - h) * (2 * Math.PI) / i) * 0.5 + k + e
	},
	back_in: function (e, a, h, g) {
		var f = 1.70158;
		return h * (e /= g) * e * ((f + 1) * e - f) + a
	},
	back_out: function (e, a, h, g) {
		var f = 1.70158;
		return h * ((e = e / g - 1) * e * ((f + 1) * e + f) + 1) + a
	},
	back_in_out: function (e, a, h, g) {
		var f = 1.70158;
		if ((e /= g / 2) < 1) {
			return h / 2 * (e * e * (((f *= (1.525)) + 1) * e - f)) + a
		}
		return h / 2 * ((e -= 2) * e * (((f *= (1.525)) + 1) * e + f) + 2) + a
	},
	bounce_in: function (e, a, g, f) {
		return g - ng.AnimationEasing.bounce_out(f - e, 0, g, f) + a
	},
	bounce_out: function (e, a, g, f) {
		if ((e /= f) < (1 / 2.75)) {
			return g * (7.5625 * e * e) + a
		} else {
			if (e < (2 / 2.75)) {
				return g * (7.5625 * (e -= (1.5 / 2.75)) * e + 0.75) + a
			} else {
				if (e < (2.5 / 2.75)) {
					return g * (7.5625 * (e -= (2.25 / 2.75)) * e + 0.9375) + a
				} else {
					return g * (7.5625 * (e -= (2.625 / 2.75)) * e + 0.984375) + a
				}
			}
		}
	},
	bounce_in_out: function (e, a, g, f) {
		if (e < f / 2) {
			return ng.AnimationEasing.bounce_in(e * 2, 0, g, f) * 0.5 + a
		}
		return ng.AnimationEasing.bounce_out(e * 2 - f, 0, g, f) * 0.5 + g * 0.5 + a
	}
};
ng.Element = function (a) {
	if (ng.type(a) == "string") {
		a = document.getElementById(a)
	}
	if (!ng.defined(a)) {
		return null
	}
	if (ng.defined(a.is_ng_element)) {
		return a
	}
	a.p = {
		has_event: [],
		element: null,
		is_html: true,
		opacity: null,
		zoom: null,
		original_zoom_obj: {},
		animation: null,
		animation_arr: [],
		ajax: {
			object: null,
			append: "overwrite",
			script: false,
			every: 0,
			current_every: 0,
			timeout: 0,
			delay_empty: false
		},
		drag: {
			object: false,
			handle: null,
			grid: 1,
			top: "top",
			left: "left",
			style: "proxy",
			opacity: 50,
			zoom: null,
			on_top: false,
			container: null,
			offset: {
				top: 0,
				left: 0
			},
			targets: [],
			drag_delay: 50
		},
		did_set_drag: false,
		is_dragging: false,
		transform: {
			ow: null,
			oh: null,
			omt: null,
			oml: null,
			object: false,
			origin: null,
			rotate: null,
			scalex: null,
			scaley: null,
			skewx: null,
			skewy: null,
			translatex: null,
			translatey: null
		}
	};
	ng.extend_element(a, ng.Events.prototype);
	ng.extend_element(a, ng.element_methods);
	if (!ng.defined(a.id)) {
		a.id = ng.random_id("element")
	}
	a.is_ng_element = true;
	return a
};
ng.extend_element = function (a, b) {
	if (ng.defined(a.did_extend)) {
		return a
	}
	if (ng.defined(a.is_ng_element)) {
		return a
	}
	ng.obj_each(b, function (f, c) {
		if (ng.defined(a.__proto__)) {
			a.__proto__[c] = f
		} else {
			if (ng.defined(a.prototype)) {
				a.prototype[c] = f
			} else {
				try {
					a[c] = f
				} catch (d) {}
			}
		}
	});
	return a
};
ng.element_methods = {
	has_type: "html_element",
	did_extend: true,
	empty: function () {
		this.innerHTML = "";
		return this
	},
	remove: function () {
		this.remove_element()
	},
	remove_element: function () {
		this.clear_all_events();
		ng.obj_each(this.p, function (b, a) {
			if (ng.defined(b)) {
				if (ng.defined(b.remove_element)) {
					b.remove_element()
				} else {
					if ((ng.defined(b.remove)) && (ng.type(b.remove) == "function")) {
						b.remove()
					}
				}
			} else {
				delete this.p[a]
			}
		}, this);
		this.parentNode.removeChild(this)
	},
	set: function (b, a) {
		if (b == "html") {
			b = "innerHTML"
		} else {
			if (b == "class") {
				b = "className"
			}
		}
		if (b == "innerHTML") {
			return this.set_html(a)
		}
		this[b] = a;
		return this
	},
	get: function (b) {
		if (b == "html") {
			b = "innerHTML"
		} else {
			if (b == "tag") {
				b = "tagName"
			} else {
				if (b == "class") {
					b = "className"
				}
			}
		}
		var a = this[b];
		if (!ng.defined(a)) {
			if (ng.defined(this.getAttribute)) {
				a = this.getAttribute(b)
			} else {
				if (ng.defined(this.getProperty)) {
					a = this.getProperty(b)
				}
			}
		}
		if (b == "tagName") {
			return a.toLowerCase()
		} else {
			return a
		}
	},
	set_html: function (c, a, b) {
		if (!ng.defined(c)) {
			return this
		}
		if (!ng.defined(a)) {
			a = "overwrite"
		}
		a = a.toLowerCase();
		if (ng.defined(c.render_html)) {
			c = c.render_html()
		}
		if (ng.type(c) == "array") {
			c = c.join("")
		}
		if (a == "bottom") {
			this.innerHTML += c
		} else {
			if (a == "top") {
				this.innerHTML = c + this.innerHTML
			} else {
				this.innerHTML = c
			}
		}
		if ((ng.defined(b)) && (b)) {
			c.eval_script()
		}
		return this
	},
	get_html: function () {
		return this.innerHTML
	},
	append_element: function (c, a) {
		if (ng.defined(c.render_html)) {
			return this.set_html(c, a)
		}
		if (!ng.defined(a)) {
			a = "bottom"
		}
		a = a.toLowerCase();
		if (c.is_ng_plugin) {
			var b = c.get_object()
		} else {
			var b = ng.get(c)
		}
		if (a == "top") {
			this.insertBefore(b, this.firstChild)
		} else {
			if (a == "before") {
				this.parentNode.insertBefore(b, this)
			} else {
				if (a == "after") {
					this.parentNode.insertBefore(b, this.nextSibling)
				} else {
					this.appendChild(b)
				}
			}
		}
	},
	replace: function (a) {
		a = ng.get(a);
		this.parentNode.replaceChild(a, this)
	},
	get_children: function (b, g) {
		if (!ng.defined(b)) {
			var b = "*"
		}
		var h = this.getElementsByTagName(b);
		b = b.toLowerCase();
		var f = [];
		var c = h.length;
		var a = true,
			e;
		for (var d = 0; d < c; d++) {
			if (h[d].nodeType == 1) {
				e = ng.get(h[d]);
				f.push(e);
				if (ng.defined(g)) {
					a = (g.bind(this, [e, f.length - 1]))();
					if ((ng.defined(a)) && (a === false)) {
						break
					}
				}
			}
		}
		return f
	},
	get_direct_children: function (j, c) {
		var g = false;
		var e = this.childNodes;
		if ((ng.defined(j)) && (j != "*")) {
			g = true;
			j = j.toLowerCase()
		}
		var h = [];
		var f = e.length;
		var k = true,
			a;
		var b;
		for (var d = 0; d < f; d++) {
			if (e[d].nodeType == 1) {
				if (!g) {
					b = true
				} else {
					if ((g) && (e[d].tagName.toLowerCase() == j)) {
						b = true
					} else {
						b = false
					}
				}
				if (b) {
					a = ng.get(e[d]);
					h.push(a);
					if (ng.defined(c)) {
						k = (c.bind(this, [a, h.length - 1]))();
						if ((ng.defined(k)) && (k === false)) {
							break
						}
					}
				}
			}
		}
		return h
	},
	get_children_by_class_name: function (l, n, c) {
		var g = true;
		var h = true;
		if ((!ng.defined(n)) || (n == "*")) {
			h = false;
			var n = "*";
			var a = n + "." + l
		} else {
			var a = "." + l
		}
		if (ng.defined(this.querySelectorAll)) {
			g = h = false;
			var e = this.querySelectorAll(a)
		} else {
			if (ng.defined(this.getElementsByClassName)) {
				g = false;
				var e = this.getElementsByClassName(l)
			} else {
				n = n.toLowerCase();
				var e = this.getElementsByTagName(n)
			}
		}
		var k = [];
		var f = e.length;
		var m = true,
			b, j;
		for (var d = 0; d < f; d++) {
			if (e[d].nodeType == 1) {
				j = true;
				b = ng.get(e[d]);
				if ((g) && (!b.has_class(l))) {
					j = false
				}
				if ((h) && (b.get("tag") != n)) {
					j = false
				}
				if (j) {
					k.push(b);
					if (ng.defined(c)) {
						m = (c.bind(this, [b, k.length - 1]))();
						if ((ng.defined(m)) && (m === false)) {
							break
						}
					}
				}
			}
		}
		return k
	},
	get_first_child: function () {
		var a = this.firstChild;
		while (a.nodeType != 1) {
			a = a.nextSibling
		}
		return ng.get(a)
	},
	get_last_child: function () {
		var a = this.lastChild;
		while (a.nodeType != 1) {
			a = a.previousSibling
		}
		return ng.get(a)
	},
	get_next_sibling: function () {
		var a = this.nextSibling;
		while (a.nodeType != 1) {
			a = a.nextSibling
		}
		return ng.get(a)
	},
	get_previous_sibling: function () {
		var a = this.previousSibling;
		while (a.nodeType != 1) {
			a = a.previousSibling
		}
		return ng.get(a)
	},
	get_parent: function () {
		return ng.get(this.parentNode)
	},
	is_child_of: function (c) {
		var b = ng.get(c);
		var a = this;
		if (b === a) {
			return false
		}
		while (a && a !== b) {
			a = a.parentNode
		}
		return (a === b)
	},
	clone_element: function (b) {
		if (!ng.defined(b)) {
			b = false
		}
		var c = this.cloneNode(b);
		if ((!ng.defined(c.did_extend)) || (!c.did_extend)) {
			c.is_ng_element = null
		}
		c.className = this.className;
		var a = 1;
		while (ng.defined(ng.get(this.id + "_" + a))) {
			a++
		}
		c.id = this.id + "_" + a;
		return ng.get(c)
	},
	disable: function () {
		if (this.disabled) {
			return this
		}
		this.disabled = true;
		this.fire_event("disable");
		return this
	},
	enable: function () {
		if (!this.disabled) {
			return this
		}
		this.disabled = false;
		this.fire_event("enable");
		return this
	},
	get_style: function (a) {
		if (ng.type(a) == "array") {
			return this.get_styles(a)
		}
		a = a.css_camel_case();
		if ((a == "opacity") && (ng.defined(this.p.opacity))) {
			return this.get_opacity() + "%"
		} else {
			if ((a == "zoom") && (ng.defined(this.p.zoom))) {
				return this.get_zoom() + "%"
			} else {
				if (a == "float") {
					if (ng.browser.ie) {
						a = "styleFloat"
					} else {
						if (!ng.browser.webkit) {
							a = "cssFloat"
						}
					}
				}
			}
		}
		var j = this.style[a];
		if (j == "") {
			if (this.currentStyle) {
				j = this.currentStyle[a];
				if ((j == "") && (a == "styleFloat")) {
					j = this.currentStyle["float"]
				}
			} else {
				j = document.defaultView.getComputedStyle(this, null).getPropertyValue(a.css_hyphenate());
				if ((j == "") && (a == "cssFloat")) {
					j = document.defaultView.getComputedStyle(this, null).getPropertyValue("float")
				}
			}
		}
		if (!ng.defined(j)) {
			j = ""
		}
		if (ng.type(j) != "string") {
			j = j.toString()
		}
		if ((j == "") || (j.toLowerCase() == "auto")) {
			if (a == "top") {
				j = this.get_position().top + "px"
			} else {
				if (a == "left") {
					j = this.get_position().left + "px"
				} else {
					if (a == "right") {
						j = (this.get_position().left + this.get_width()) + "px"
					} else {
						if (a == "bottom") {
							j = (this.get_position().top + this.get_height()) + "px"
						} else {
							if (a == "width") {
								j = this.get_width();
								var f = ["paddingRight", "paddingLeft", "borderRightWidth", "borderLeftWidth"];
								for (var e = 0; e < f.length; e++) {
									var k = this.get_style(f[e]).to_int();
									if (!isNaN(k)) {
										j -= k
									}
								}
								j += "px"
							} else {
								if (a == "height") {
									j = this.get_height();
									var f = ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"];
									for (var e = 0; e < f.length; e++) {
										var k = this.get_style(f[e]).to_int();
										if (!isNaN(k)) {
											j -= k
										}
									}
									j += "px"
								}
							}
						}
					}
				}
			}
		}
		if (j == "") {
			var g = {
				padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
				margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
				background: ["backgroundImage", "backgroundColor", "backgroundRepeat", "backgroundPosition", "backgroundAttachment"],
				font: ["fontVariant", "fontStyle", "fontSize", "fontFamily"],
				border: ["borderStyle", "borderWidth", "borderColor"],
				borderWidth: ["borderTopWidth"]
			};
			if ((ng.browser.webkit) || (ng.browser.gecko)) {
				g.border = ["borderTopStyle", "borderTopWidth", "borderTopColor"]
			}
			if (ng.defined(g[a])) {
				for (var e = 0; e < g[a].length; e++) {
					var k = this.get_style(g[a][e]);
					if (k != "") {
						j += k + " "
					}
				}
			}
			if (j != "") {
				j = j.trim()
			}
		}
		if (ng.type(j) == "string") {
			var h = j.indexOf("rgb(");
			if (h != -1) {
				var b = j.substr(0, h + 4);
				var d = j.replace(b, "");
				d = d.substr(d.indexOf(")"));
				var c = new ng.Color(j.replace(b, "").replace(d, "").split(","));
				j = b.replace("rgb(", "") + c.get_hex().toLowerCase() + d.replace(")", "")
			}
		}
		if (a == "zoom") {
			if (j.toString().indexOf("%") == -1) {
				j = Math.round(j.to_float() * 100)
			} else {
				j = Math.round(j.to_float())
			}
			this.p.zoom = j;
			j += "%"
		}
		if (a == "opacity") {
			j = Math.round(j.to_float() * 100);
			this.p.opacity = j;
			j += "%"
		}
		return j
	},
	get_styles: function (a) {
		if (ng.type(a) != "array") {
			return this.get_style(a)
		}
		var c = {};
		for (var b = 0; b < a.length; b++) {
			c[a[b]] = this.get_style(a[b])
		}
		return c
	},
	set_style: function (c, b) {
		if (ng.type(c) != "string") {
			return this.set_styles(c)
		}
		var a = c.toLowerCase();
		if (a == "opacity") {
			return this.set_opacity(b)
		} else {
			if (a == "zoom") {
				return this.set_zoom(b)
			} else {
				if (a == "scroll") {
					return this.set_scroll(b)
				} else {
					if (a.replace("-", "") == "scrolltop") {
						return this.set_scroll_top(b)
					} else {
						if (a.replace("-", "") == "scrollleft") {
							return this.set_scroll_left(b)
						} else {
							if (a.indexOf("transform-") != -1) {
								return this.set_transform(c, b).transform()
							} else {
								if (a == "width") {
									this.p.transform.ow = b.to_int()
								} else {
									if (a == "height") {
										this.p.transform.oh = b.to_int()
									} else {
										if (a.replace("-", "") == "margintop") {
											this.p.transform.omt = b.to_int()
										} else {
											if (a.replace("-", "") == "marginleft") {
												this.p.transform.oml = b.to_int()
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if (ng.type(b) == "color") {
			if ((ng.browser.ie) && (ng.browser.get_ie_version() < 9)) {
				b = b.get_hex()
			} else {
				b = "rgba(" + b.get_rgb(true).join(",") + ")"
			}
		} else {
			if (b.is_numeric()) {
				if ((a == "width") || (a == "height")) {
					if (b < 0) {
						b = 0
					}
				}
				if (a.replace("-", "") != "zindex") {
					b = Math.round(b) + "px"
				}
			}
		}
		if (c.charAt(0) == "-") {
			if (this.style.setProperty) {
				this.style.setProperty(c.css_hyphenate(), b, null)
			} else {
				this.style.setAttribute(c.css_camel_case(), b)
			}
		} else {
			if (a == "float") {
				if (ng.browser.ie) {
					c = "styleFloat"
				} else {
					c = "cssFloat"
				}
			}
			this.style[c.css_camel_case()] = b
		}
		return this
	},
	set_styles: function (a) {
		ng.obj_each(a, function (c, b) {
			this.set_style(b, c)
		}, this);
		return this
	},
	process_transform_css: function () {
		if (this.p.transform.object) {
			return
		}
		var c = this.get_style("transform");
		if (c == "") {
			if ("MozTransform" in this.style) {
				c = this.get_style("MozTransform")
			} else {
				if ("WebkitTransform" in this.style) {
					c = this.get_style("WebkitTransform")
				} else {
					if ("OTransform" in this.style) {
						c = this.get_style("OTransform")
					} else {
						if ("msTransform" in this.style) {
							c = this.get_style("msTransform")
						}
					}
				}
			}
		}
		if (c == "") {
			return this
		}
		var a = c.split(")");
		for (var b = 0; b < a.length; b++) {
			if (a[b].indexOf("rotate") != -1) {
				this.p.transform.rotate = a[b].replace("rotate", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("scaleX") != -1) {
				this.p.transform.scalex = a[b].replace("scaleX", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("scaleY") != -1) {
				this.p.transform.scaley = a[b].replace("scaleY", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("scale") != -1) {
				var d = a[b].replace("scale", "").replace(/\)\s/g, "").split(",");
				this.p.transform.scalex = d[0].to_int();
				if (d.length > 1) {
					this.p.transform.scaley = d[1].to_int()
				}
			}
			if (a[b].indexOf("skewX") != -1) {
				this.p.transform.skewx = a[b].replace("skewX", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("skewY") != -1) {
				this.p.transform.skewy = a[b].replace("skewY", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("skew") != -1) {
				var d = a[b].replace("skew", "").replace(/\)\s/g, "").split(",");
				this.p.transform.skewx = d[0].to_int();
				if (d.length > 1) {
					this.p.transform.skewy = d[1].to_int()
				}
			}
			if (a[b].indexOf("translateX") != -1) {
				this.p.transform.translatex = a[b].replace("translateX", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("translateY") != -1) {
				this.p.transform.translatey = a[b].replace("translateY", "").replace(/\)\s/g, "").trim().to_int()
			}
			if (a[b].indexOf("translate") != -1) {
				var d = a[b].replace("translate", "").replace(/\)\s/g, "").split(",");
				this.p.transform.translatex = d[0].to_int();
				if (d.length > 1) {
					this.p.transform.translatey = d[1].to_int()
				}
			}
		}
	},
	set_transform: function (b, a) {
		if (!ng.defined(this.p.transform.ow)) {
			this.p.transform.ow = this.get_width()
		}
		if (!ng.defined(this.p.transform.oh)) {
			this.p.transform.oh = this.get_height()
		}
		if (!ng.defined(this.p.transform.omt)) {
			this.p.transform.omt = this.get_style("margin-top").to_int();
			if (isNaN(this.p.transform.omt)) {
				this.p.transform.omt = 0
			}
		}
		if (!ng.defined(this.p.transform.oml)) {
			this.p.transform.oml = this.get_style("margin-left").to_int();
			if (isNaN(this.p.transform.oml)) {
				this.p.transform.oml = 0
			}
		}
		b = b.toLowerCase().replace("transform-", "");
		a = a + "";
		if (b == "origin") {
			this.p.transform.origin = a
		} else {
			if (b == "scale") {
				a = a.replace(/\(\)\s/g, "").split(",");
				this.set_transform("scaleX", a[0]);
				if (a.length > 1) {
					this.set_transform("scaleY", a[1])
				}
			} else {
				if (b == "skew") {
					a = a.replace(/\(\)\s/g, "").split(",");
					this.set_transform("skewX", a[0]);
					if (a.length > 1) {
						this.set_transform("skewY", a[1])
					}
				} else {
					if (b == "translate") {
						a = a.replace(/\(\)\s/g, "").split(",");
						this.set_transform("translateX", a[0]);
						if (a.length > 1) {
							this.set_transform("translateY", a[1])
						}
					} else {
						a = a.replace(/\(\)\s/g, "");
						this.p.transform[b] = a.to_float()
					}
				}
			}
		}
		return this
	},
	get_transform: function (b) {
		this.process_transform_css();
		b = b.toLowerCase().replace("transform-", "");
		var a = "";
		if (b == "scale") {
			a = this.p.transform.scalex;
			if (this.p.transform.scaley) {
				a += "," + this.p.transform.scaley
			}
		}
		if (b == "skew") {
			a = this.p.transform.skewx + "deg";
			if (this.p.transform.skewy) {
				a += "," + this.p.transform.skewy + "deg"
			}
		}
		if (b == "translate") {
			a = this.p.transform.translatex + "px";
			if (this.p.transform.translatey) {
				a += "," + this.p.transform.translatey + "px"
			}
		}
		if (ng.defined(this.p.transform[b])) {
			a = this.p.transform[b]
		}
		if (a == "") {
			return ""
		}
		if ((b == "skewx") || (b == "skewy") || (b == "rotate")) {
			a += "deg"
		} else {
			if ((b == "translatex") || (b == "translatey")) {
				a += "px"
			}
		}
		return a
	},
	transform: function () {
		var l = [
			[1, 0, 0, 1]
		];
		var j = 1,
			i = 0,
			c = 0,
			b = 1;
		var d = Math.PI * 2 / 360;
		if (ng.defined(this.p.transform.rotate)) {
			var k = this.p.transform.rotate * d;
			var m = Math.cos(k).round(10);
			var e = Math.sin(k).round(10);
			l.push([m, e, -e, m])
		}
		if ((ng.defined(this.p.transform.skewx)) && (ng.defined(this.p.transform.skewy))) {
			var h = this.p.transform.skewx * d;
			var g = this.p.transform.skewy * d;
			l.push([1, Math.tan(g).round(10), Math.tan(h).round(10), 1])
		} else {
			if (ng.defined(this.p.transform.skewx)) {
				var k = this.p.transform.skewx * d;
				l.push([1, 0, Math.tan(k).round(10), 1])
			}
			if (ng.defined(this.p.transform.skewy)) {
				var k = this.p.transform.skewy * d;
				l.push([1, Math.tan(k).round(10), 0, 1])
			}
		}
		if ((ng.defined(this.p.transform.scalex)) && (ng.defined(this.p.transform.scaley))) {
			l.push([this.p.transform.scalex, 0, 0, this.p.transform.scaley])
		} else {
			if (ng.defined(this.p.transform.scalex)) {
				l.push([this.p.transform.scalex, 0, 0, 1])
			}
			if (ng.defined(this.p.transform.scaley)) {
				l.push([
					[1, 0, 0, this.p.transform.scaley]
				])
			}
		}
		while (l.length > 1) {
			l[1] = [l[0][0] * l[1][0] + l[0][1] * l[1][2], l[0][0] * l[1][1] + l[0][1] * l[1][3], l[0][2] * l[1][0] + l[0][3] * l[1][2], l[0][2] * l[1][1] + l[0][3] * l[1][3]];
			l.shift()
		}
		if ((ng.browser.ie) && (ng.browser.get_ie_version() < 9)) {
			this.style.zoom = Math.round(this.get_zoom() / 100);
			this.set_ie_filter("progid:DXImageTransform.Microsoft.Matrix", "M11=" + l[0][0] + ", M12=" + l[0][2] + ", M21=" + l[0][1] + ", M22=" + l[0][3] + ", sizingmethod='auto expand'");
			var f = (this.p.transform.ow - this.get_width()) / 2;
			var a = (this.p.transform.oh - this.get_height()) / 2;
			if ((ng.defined(this.p.transform.transformx)) && (this.p.transform.transformx != 0)) {
				f += this.p.transform.transformx
			}
			if ((ng.defined(this.p.transform.transformy)) && (this.p.transform.transformy != 0)) {
				a += this.p.transform.transformy
			}
			this.style.marginTop = (a + this.p.transform.omt) + "px";
			this.style.marginLeft = (f + this.p.transform.oml) + "px"
		} else {
			if (!ng.defined(this.p.transform.transformx)) {
				this.p.transform.transformx = 0
			}
			if (!ng.defined(this.p.transform.transformy)) {
				this.p.transform.transformy = 0
			}
			if ("MozTransform" in this.style) {
				if (ng.defined(this.p.transform.origin)) {
					this.style.MozTransformOrigin = this.p.transform.origin
				}
				this.style.MozTransform = "matrix(" + l[0][0] + ", " + l[0][1] + ", " + l[0][2] + ", " + l[0][3] + ", " + this.p.transform.transformx + "px, " + this.p.transform.transformy + "px)"
			} else {
				if ("WebkitTransform" in this.style) {
					if (ng.defined(this.p.transform.origin)) {
						this.style.WebkitTransformOrigin = this.p.transform.origin
					}
					this.style.WebkitTransform = "matrix(" + l[0][0] + ", " + l[0][1] + ", " + l[0][2] + ", " + l[0][3] + ", " + this.p.transform.transformx + ", " + this.p.transform.transformy + ")"
				} else {
					if ("OTransform" in this.style) {
						if (ng.defined(this.p.transform.origin)) {
							this.style.OTransformOrigin = this.p.transform.origin
						}
						this.style.OTransform = "matrix(" + l[0][0] + ", " + l[0][1] + ", " + l[0][2] + ", " + l[0][3] + ", " + this.p.transform.transformx + ", " + this.p.transform.transformy + ")"
					} else {
						if ("msTransform" in this.style) {
							if (ng.defined(this.p.transform.origin)) {
								this.style.msTransformOrigin = this.p.transform.origin
							}
							this.style.msTransform = "matrix(" + l[0][0] + ", " + l[0][1] + ", " + l[0][2] + ", " + l[0][3] + ", " + this.p.transform.transformx + ", " + this.p.transform.transformy + ")"
						}
					}
				}
			}
			if (ng.defined(this.p.transform.origin)) {
				this.style.transformOrigin = this.p.transform.origin
			}
			this.style.transform = "matrix(" + l[0][0] + ", " + l[0][1] + ", " + l[0][2] + ", " + l[0][3] + ", " + this.p.transform.transformx + ", " + this.p.transform.transformy + ")"
		}
		return this
	},
	set_ie_filter: function (c, e) {
		var f = this.style.filter;
		if (f == "") {
			this.style.filter = c + "(" + e + ")"
		} else {
			var a = f.split(")");
			var d = false;
			for (var b = 0; b < a.length; b++) {
				if (a[b].indexOf(c) != -1) {
					if (e == "") {
						delete a[b]
					} else {
						a[b] = c + "(" + e
					}
					d = true
				}
			}
			if (!d) {
				this.style.filter += " " + c + "(" + e + ")"
			} else {
				this.style.filter = a.join(")")
			}
		}
		return this
	},
	set_opacity: function (a) {
		a = ng.Filter.between(a.to_int(), 0, 100);
		if (a == this.get_opacity()) {
			return
		}
		if ((ng.browser.ie) && ng.defined(this.currentStyle) && (ng.browser.get_ie_version() < 8)) {
			if (!this.currentStyle.hasLayout) {
				this.set_width(this.get_style("width"))
			}
			if (a >= 100) {
				this.set_ie_filter("progid:DXImageTransform.Microsoft.BasicImage", "")
			} else {
				this.set_ie_filter("progid:DXImageTransform.Microsoft.BasicImage", "opacity=" + (a / 100))
			}
		}
		this.style.opacity = a / 100;
		this.p.opacity = a;
		return this
	},
	get_opacity: function () {
		if (!ng.defined(this.p.opacity)) {
			var a = this.get_style("opacity").to_int();
			if ((isNaN(a)) || (!ng.defined(a))) {
				this.p.opacity = 100;
				return 100
			}
			return a
		}
		return this.p.opacity
	},
	set_zoom: function (j, d, a) {
		j = j.to_int();
		if (this.get_zoom() == j) {
			return
		}
		if (("zoom" in this.style) && (!ng.defined(a))) {
			this.style.zoom = j / 100
		} else {
			if (("MozTransform" in this.style) && (!ng.defined(a))) {
				this.set_transform("scale", (j / 100) + "," + (j / 100)).transform()
			} else {
				if (("OTransform" in this.style) && (!ng.defined(a))) {
					this.set_transform("scale", (j / 100) + "," + (j / 100)).transform()
				} else {
					var c = this.get_zoom_style("height").to_int();
					var e = this.get_zoom_style("width").to_int();
					var k = this.get_direct_children();
					for (var b = 0; b < k.lenght; b++) {
						k[b].set_zoom(j, true, true)
					}
					this.set_styles({
						width: e.percent(j),
						height: c.percent(j)
					});
					var f = ["paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "fontSize", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth"];
					if (d) {
						f = f.concat(["marginTop", "marginLeft", "marginRight", "marginBottom"])
					}
					for (var b = 0; b < f.length; b++) {
						var g = this.get_zoom_style(f[b]).to_int();
						if (!isNaN(g)) {
							this.set_style(f[b], g.percent(j).to_int())
						}
					}
				}
			}
		}
		this.p.zoom = j;
		return this
	},
	get_zoom_style: function (a) {
		if (!ng.defined(this.p.original_zoom_obj[a])) {
			this.p.original_zoom_obj[a] = this.get_style(a)
		}
		return this.p.original_zoom_obj[a]
	},
	get_zoom: function () {
		if (!ng.defined(this.p.zoom)) {
			var a = this.get_style("zoom").to_int();
			if ((isNaN(a)) || (!ng.defined(a))) {
				this.p.zoom = 100;
				return 100
			}
			return a
		}
		return this.p.zoom
	},
	set_scroll: function (c, b) {
		if ((!ng.defined(b)) && (ng.type(c) == "string")) {
			var a = c.split(" ");
			c = a[0].to_int();
			b = a[1].to_int()
		}
		return this.set_scroll_top(c).set_scroll_left(b)
	},
	get_scroll: function () {
		return this.get_scroll_top() + " " + this.get_scroll_left()
	},
	set_scroll_top: function (a) {
		this.scrollTop = a.to_int();
		return this
	},
	get_scroll_top: function () {
		return this.scrollTop
	},
	set_scroll_left: function (a) {
		this.scrollLeft = a.to_int();
		return this
	},
	get_scroll_left: function () {
		return this.scrollLeft
	},
	get_width: function () {
		return this.offsetWidth
	},
	set_width: function (a) {
		return this.set_style("width", a)
	},
	get_height: function () {
		return this.offsetHeight
	},
	set_height: function (a) {
		return this.set_style("height", a)
	},
	get_position: function () {
		var a = Math.max(document.body.scrollTop, document.documentElement.scrollTop) - document.documentElement.clientTop;
		var i = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft) - document.documentElement.clientLeft;
		var g = false;
		if (document.body.dir.toLowerCase() == "rtl") {
			g = true
		}
		if ((!g) && (ng.doc.dir.toLowerCase() == "rtl")) {
			g = true
		}
		if ((!g) && (ng.get(document.body).get_style("direction") == "rtl")) {
			g = true
		}
		if ((!g) && (ng.get(ng.doc).get_style("direction") == "rtl")) {
			g = true
		}
		if (g) {
			var d = -1
		} else {
			var d = 1
		}
		if (this.getBoundingClientRect) {
			var e = this.getBoundingClientRect();
			return {
				top: e.top + a,
				left: e.left + (d * i),
				bottom: e.bottom + a,
				right: e.right + (d * i)
			}
		}
		if (this.get_style("position") == "fixed") {
			return {
				top: this.offsetTop + a,
				left: this.offsetLeft + (d * i),
				bottom: this.offsetTop + a + this.get_height(),
				right: this.offsetLeft + (d * i) + this.get_width()
			}
		}
		var b = this;
		var f = b.offsetTop;
		var h = b.offsetLeft;
		var c = 0,
			j = 0;
		while (b = b.offsetParent) {
			if (!ng.browser.opera) {
				j = ng.get(b).get_style("borderTopWidth").to_int();
				if (isNaN(j)) {
					j = ng.get(b).get_style("borderWidth").to_int();
					if (isNaN(j)) {
						j = 0
					}
				}
				c = ng.get(b).get_style("borderLeftWidth").to_int();
				if (isNaN(c)) {
					c = ng.get(b).get_style("borderWidth").to_int();
					if (isNaN(c)) {
						c = 0
					}
				}
			}
			f += b.offsetTop + j;
			h += b.offsetLeft + c
		}
		return {
			top: f,
			left: h,
			bototm: f + this.get_height(),
			right: h + this.get_width()
		}
	},
	add_class: function (a) {
		if (!this.has_class(a)) {
			this.className += " " + a
		}
		this.className = this.className.trim();
		return this
	},
	remove_class: function (a) {
		if (this.className.indexOf(" ") != -1) {
			this.className = this.className.split(" ").remove_value(a).join(" ")
		} else {
			if (this.className == a) {
				this.className = ""
			}
		}
		return this
	},
	has_class: function (a) {
		return (this.className.split(" ").has(a))
	},
	toggle_class: function (b, a) {
		if (this.has_class(b)) {
			this.remove_class(b).add_class(a)
		} else {
			this.remove_class(a).add_class(b)
		}
		return this
	},
	fade_in: function (a, b, c) {
		if (!ng.defined(c)) {
			c = {}
		}
		if (!ng.defined(c.end)) {
			c.end = {}
		}
		c.end.opacity = 100;
		c.time = a;
		return this.animate(c, b)
	},
	fade_out: function (a, b, c) {
		if (!ng.defined(c)) {
			c = {}
		}
		if (!ng.defined(c.end)) {
			c.end = {}
		}
		c.end.opacity = 0;
		c.time = a;
		return this.animate(c, b)
	},
	animate: function (b, a) {
		if (ng.defined(this.p.animation)) {
			if (b.end == "reverse") {
				b.start = ng.obj_clone(this.p.animation.get_end());
				b.end = ng.obj_clone(this.p.animation.get_start())
			}
			if (this.p.animation.get_status() == "playing") {
				if (b.start_now) {
					this.stop_animation()
				} else {
					this.p.animation_arr.push({
						anim_obj: b,
						onfinish: a
					});
					return this
				}
			}
		}
		if (!ng.defined(b.start)) {
			b.start = {}
		}
		ng.obj_each(b.end, function (e, d) {
			if (!ng.defined(b.start[d])) {
				if (d.indexOf("transform-") == -1) {
					b.start[d] = this.get_style(d);
					if (d.toLowerCase().indexOf("color") == -1) {
						b.start[d] = b.start[d].to_int()
					}
				} else {
					b.start[d] = this.get_transform(d.replace("transform-", "")).to_float();
					if (isNaN(b.start[d])) {
						if (d.indexOf("scale") != -1) {
							b.start[d] = 1
						} else {
							b.start[d] = 0
						}
					}
				}
			}
			if ((ng.type(e) == "string") && (e.indexOf("current_") != -1)) {
				if (d.indexOf("transform-") == -1) {
					b.end[d] = this.get_style(e.replace("current_", "")).to_int()
				} else {
					b.end[d] = this.get_transform(d.replace("current_transform-", "")).to_float()
				}
			}
			if (d.toLowerCase().indexOf("color") != -1) {
				if (ng.type(e) == "color") {
					b.end[d] = e
				} else {
					b.end[d] = new ng.Color(e)
				}
			}
		}, this);
		ng.obj_each(b.start, function (e, d) {
			if ((ng.type(e) == "string") && (e.indexOf("current_") != -1)) {
				if (d.indexOf("transform-") == -1) {
					b.start[d] = this.get_style(e.replace("current_", "")).to_int()
				} else {
					b.start[d] = this.get_transform(d.replace("current_transform-", "")).to_float()
				}
				if ((d == "top") && (ng.defined(b.bezier))) {
					b.bezier[0].top = e
				} else {
					if ((d == "left") && (ng.defined(b.bezier))) {
						b.bezier[0].left = e
					}
				}
			}
			if (d.toLowerCase().indexOf("color") != -1) {
				if (ng.type(e) == "color") {
					b.start[d] = e
				} else {
					b.start[d] = new ng.Color(e)
				}
			}
		}, this);
		if (ng.defined(b.bezier)) {
			var c = function (g, f) {
				g.top = Math.sum(0, b.bezier.length - 1, function (i, h) {
					return Math.choose(h, i) * b.bezier[i].top * Math.pow((1 - g._bl), (h - i)) * Math.pow(g._bl, i)
				}).to_int();
				g.left = Math.sum(0, b.bezier.length - 1, function (i, h) {
					return Math.choose(h, i) * b.bezier[i].left * Math.pow((1 - g._bl), (h - i)) * Math.pow(g._bl, i)
				}).to_int();
				delete g._bl;
				var e = {};
				var d = false;
				ng.obj_each(g, function (i, h) {
					if (h.indexOf("transform-") != -1) {
						d = true;
						e[h] = i;
						delete g[h]
					}
				}, this);
				this.set_styles(g);
				if (d) {
					ng.obj_each(e, function (i, h) {
						this.set_transform(h, i)
					}, this);
					this.transform()
				}
			}.bind(this)
		} else {
			var c = function (f) {
				var e = {};
				var d = false;
				ng.obj_each(f, function (h, g) {
					if (g.indexOf("transform-") != -1) {
						d = true;
						e[g] = h;
						delete f[g]
					}
				}, this);
				this.set_styles(f);
				if (d) {
					ng.obj_each(e, function (h, g) {
						this.set_transform(g, h)
					}, this);
					this.transform()
				}
			}.bind(this)
		}
		if (!ng.defined(this.p.animation)) {
			this.p.animation = new ng.Animation(c, b.start, b.end, b.time, b.easing, b.fps)
		} else {
			this.p.animation.ini(c, b.start, b.end, b.time, b.easing, b.fps)
		}
		this.p.animation.clear_all_events();
		this.p.animation.add_event("finish", function () {
			if (this.p.animation_arr.length > 0) {
				var d = this.p.animation_arr.shift();
				this.animate.defer(this, [d.anim_obj, d.onfinish])
			}
			if (ng.defined(a)) {
				a()
			}
			this.fire_event("onAnimationFinish")
		}.bind(this));
		if (ng.defined(b.events)) {
			this.p.animation.add_events(b.events)
		}
		if (ng.defined(b.wait)) {
			(function () {
				this.p.animation.play()
			}.delay(b.wait, this))
		} else {
			if (b.pause) {
				return this
			} else {
				this.p.animation.play()
			}
		}
		return this
	},
	play_animation: function () {
		this.p.animation.play();
		return this
	},
	pause_animation: function () {
		this.p.animation.pause();
		return this
	},
	stop_animation: function () {
		this.p.animation.stop();
		this.p.animation_arr.empty();
		return this
	},
	reverse_animation: function (b, a) {
		if (!ng.defined(b)) {
			b = {}
		}
		b.end = "reverse";
		return this.animate(b, a)
	},
	move_to: function (d, c, b, a) {
		if (!ng.defined(b)) {
			b = {}
		}
		if (!ng.defined(b.end)) {
			b.end = {}
		}
		b.end.top = d;
		b.end.left = c;
		return this.animate(b, a)
	},
	bezier_move: function (a, d, b) {
		if (!ng.defined(d)) {
			d = {}
		}
		if (a.length <= 1) {
			return this.move_to(a[0].top, a[0].left, d)
		}
		var f = this.get_position();
		var e = this.get_style("top").to_int();
		var c = this.get_style("left").to_int();
		if (isNaN(e)) {
			e = f.top
		}
		if (isNaN(c)) {
			c = f.left
		}
		if (!ng.defined(d.start)) {
			d.start = {
				top: e,
				left: c,
				_bl: 0
			}
		}
		if (!ng.defined(d.start.top)) {
			d.start.top = e
		}
		if (!ng.defined(d.start.left)) {
			d.start.left = c
		}
		d.start._bl = 0;
		if (!ng.defined(d.end)) {
			d.end = {}
		}
		d.end.top = a[a.length - 1].top;
		d.end.left = a[a.length - 1].left;
		d.end._bl = 1;
		d.bezier = [{
			top: d.start.top,
			left: d.start.left
		}].concat(a);
		return this.animate(d, b)
	},
	ajax: function (a, b) {
		if (!ng.defined(b)) {
			b = {}
		}
		if (ng.defined(b.append)) {
			this.p.ajax.append = b.append.toLowerCase()
		}
		if ((ng.defined(b.every)) && (b.every > 0)) {
			this.p.ajax.every = this.p.ajax.current_every = b.every
		}
		if (ng.defined(b.delay_empty)) {
			this.p.ajax.delay_empty = b.delay_empty
		}
		if (ng.defined(b.eval_script)) {
			this.p.ajax.script = b.eval_script
		}
		var c = function (d) {
			if (this.p.ajax.delay_empty) {
				if (d.text == "") {
					this.p.ajax.current_every += this.p.ajax.current_every.percent(10).to_int()
				} else {
					this.p.ajax.current_every = this.p.ajax.every
				}
			}
			if (d.text == "") {
				this.fire_event("ajaxreturnempty")
			} else {
				this.set_html(d.text, this.p.ajax.append);
				this.fire_event("ajaxupdate", [d.text])
			}
			this.fire_event("ajaxreturn")
		}.bind(this);
		if (!ng.defined(this.p.ajax.object)) {
			this.p.ajax.object = new ng.XHR(a, b);
			this.p.ajax.object.add_event("onSuccess", c)
		} else {
			this.p.ajax.object.set_url(a);
			this.p.ajax.object.set_eval_script(this.p.ajax.script);
			if (ng.defined(b.events)) {
				this.p.ajax.object.clear_all_events();
				this.p.ajax.object.add_events(b.events);
				this.p.ajax.object.add_event("onSuccess", c)
			}
		}
		this.abort_ajax();
		this.p.ajax.object.request();
		if (this.p.ajax.current_every > 0) {
			this.p.ajax.timeout = this.ajax.delay(this.p.ajax.current_every, this, [a])
		}
		return this
	},
	abort_ajax: function () {
		if (ng.defined(this.p.ajax.object)) {
			clearTimeout(this.p.ajax.timeout);
			this.p.ajax.object.cancel()
		}
		return this
	},
	drag: function (d) {
		this.p.drag.object = true;
		var e = ng.defined;
		if (!e(d)) {
			d = {}
		}
		if (e(d.grid)) {
			this.p.drag.grid = d.grid
		}
		if (e(d.top)) {
			this.p.drag.top = d.top
		}
		if (e(d.left)) {
			this.p.drag.left = d.left
		}
		if (e(d.handle)) {
			this.p.drag.handle = ng.get(d.handle)
		} else {
			this.p.drag.handle = this
		}
		if (e(d.targets)) {
			this.p.drag.targets = d.targets
		}
		if (ng.type(this.p.drag.targets) != "array") {
			this.p.drag.targets = [this.p.drag.targets]
		}
		if (e(d.style)) {
			if (ng.type(d.style) == "string") {
				this.p.drag.style = d.style.toLowerCase()
			} else {
				this.p.drag.style = ng.get(d.style)
			}
		}
		if (e(d.opacity)) {
			this.p.drag.opacity = d.opacity
		}
		if (e(d.zoom)) {
			this.p.drag.zoom = d.zoom
		}
		if (e(d.on_top)) {
			this.p.drag.on_top = d.on_top
		}
		if (e(d.container)) {
			this.p.drag.container = ng.get(d.container)
		}
		if (e(d.offset)) {
			this.p.drag.offset = d.offset
		}
		if (e(d.drag_delay)) {
			this.p.drag.drag_delay = d.drag_delay
		}
		var a = "mousedown";
		var c = "mouseup";
		var b = "mousemove";
		if ("onpointerdown" in this) {
			a = "pointerdown";
			c = "pointerup";
			b = "pointermove"
		} else {
			if ("onmspointerdown" in this) {
				a = "MSPointerDown";
				c = "MSPointerUp";
				b = "MSPointerMove"
			} else {
				if (("ontouchstart" in this) && (!("onmousedown" in this))) {
					a = "touchstart";
					c = "touchend";
					b = "touchmove"
				}
			}
		}
		if (!this.p.did_set_drag) {
			this.p.drag.handle.add_event(a, function (f) {
				this.p.is_dragging = true;
				(function (g) {
					if (!this.p.is_dragging) {
						return
					}
					if (!ng.is_drag_set) {
						ng.set_doc_for_drag()
					}
					if (ng.defined(g.pointerId)) {
						ng["drag_mouse_up_" + g.pointerId] = function (k) {
							if (!ng.defined(k.pointerId)) {
								k.pointerId = g.pointerId
							}
							ng.drag_mouseup(k)
						};
						ng["drag_mouse_move_" + g.pointerId] = function (k) {
							if (!ng.defined(k.pointerId)) {
								k.pointerId = g.pointerId
							}
							ng.drag_mousemove(k)
						};
						ng.doc.add_event(c, ng["drag_mouse_up_" + g.pointerId]);
						ng.doc.add_event(b, ng["drag_mouse_move_" + g.pointerId]);
						if (("ontouchstart" in this) && (a != "touchstart") && (a.indexOf("pointer") == -1)) {
							this.add_event("touchend", ng["drag_mouse_up_" + g.pointerId]);
							ng.doc.add_event("touchmove", ng["drag_mouse_move_" + g.pointerId])
						} else {
							if (c == "touchend") {
								this.add_event("touchend", ng["drag_mouse_up_" + g.pointerId])
							}
						}
					} else {
						ng.doc.add_event(c, ng.drag_mouseup);
						ng.doc.add_event(b, ng.drag_mousemove)
					}
					document.onselectstart = function () {
						return false
					};
					document.body.onselectstart = function () {
						return false
					};
					document.body.unselectable = "on";
					document.body.style.MozUserSelect = "none";
					document.body.style.WebkitUserSelect = "none";
					ng.deselect_text();
					this.ondragstart = function () {
						return false
					};
					var j;
					this.fire_event("predragstart", null, g);
					if (ng.type(this.p.drag.style) != "string") {
						var i = {
							position: "absolute"
						};
						j = this.p.drag.style.get_position();
						i[this.p.drag.left] = this.get_style(this.p.drag.left);
						i[this.p.drag.top] = this.get_style(this.p.drag.top);
						this.p.drag.style.set_styles(i)
					} else {
						if ((this.p.drag.style != "proxy") && (this.p.drag.style != "clone")) {
							this.set_style("position", "absolute")
						}
					}
					this.fire_event("dragstart", null, g);
					var h = 0;
					if (ng.defined(g.pointerId)) {
						h = g.pointerId
					}
					ng.set_drag_object({
						object: this,
						top: this.p.drag.top,
						left: this.p.drag.left,
						grid: this.p.drag.grid,
						style: this.p.drag.style,
						opacity: this.p.drag.opacity,
						zoom: this.p.drag.zoom,
						on_top: this.p.drag.on_top,
						container: this.p.drag.container,
						offset: this.p.drag.offset,
						targets: this.p.drag.targets,
						pre_pos: j
					}, h);
					ng.ini_drag(g)
				}.delay(this.p.drag.drag_delay, this, f));
				f.stop_default()
			}.bind(this))
		}
		this.p.did_set_drag = true;
		if (("ontouchstart" in this) && (a != "touchstart") && (a.indexOf("pointer") == -1)) {
			this.p.drag.handle.add_event("touchstart", function (f) {
				this.fire_event(a, null, f)
			})
		}
		this.style.msTouchAction = "none";
		this.style.touchAction = "none";
		return this
	},
	stop_drag: function () {
		this.p.drag.object = false;
		this.style.msTouchAction = "";
		this.style.touchAction = "";
		return this
	},
	start_drag: function () {
		this.p.drag.object = true;
		this.style.msTouchAction = "none";
		this.style.touchAction = "none";
		return this
	},
	can_drag: function () {
		return this.p.drag.object
	},
	set_drag_grid: function (a) {
		this.p.drag.grid = a;
		return this
	},
	get_drag_grid: function () {
		return this.p.drag.grid
	},
	set_drag_left: function (a) {
		this.p.drag.left = a;
		return this
	},
	get_drag_left: function () {
		return this.p.drag.left
	},
	set_drag_top: function (a) {
		this.p.drag.top = a;
		return this
	},
	get_drag_top: function () {
		return this.p.drag.top
	},
	set_drag_style: function (a) {
		this.p.drag.style = a;
		return this
	},
	get_drag_style: function () {
		return this.p.drag.style
	},
	set_drag_opacity: function (a) {
		this.p.drag.opacity = a;
		return this
	},
	get_drag_opacity: function () {
		return this.p.drag.opacity
	},
	set_drag_zoom: function (a) {
		this.p.drag.zoom = a;
		return this
	},
	get_drag_zoom: function () {
		return this.p.drag.zoom
	},
	set_drag_on_top: function (a) {
		this.p.drag.on_top = a;
		return this
	},
	get_drag_on_top: function () {
		return this.p.drag.on_top
	},
	set_drag_container: function (a) {
		this.p.drag.container = ng.get(a);
		return this
	},
	get_drag_container: function () {
		return this.p.drag.container
	},
	set_drag_offset: function (a) {
		this.p.drag.offset = a;
		return this
	},
	get_drag_offset: function () {
		return this.p.drag.offset
	},
	set_drag_targets: function (a) {
		if (ng.type(a) != "array") {
			a = [a]
		}
		this.p.drag.targets = a;
		return this
	},
	get_drag_targets: function () {
		return this.p.drag.targets
	}
};
if (ng.defined(window.HTMLElement)) {
	ng.extend_proto(HTMLElement, ng.Events.prototype);
	ng.extend_proto(HTMLElement, ng.element_methods)
}
ng.get = function (a) {
	if (!ng.defined(a)) {
		return a
	}
	if ((a.is_ng_element) || (a.is_ng_plugin)) {
		return a
	}
	return ng.Element(a)
};
ng.create = function (a, c) {
	if (!ng.defined(c)) {
		c = {}
	}
	var b = ng.get(document.createElement(a));
	ng.obj_each(c, function (e, d) {
		if ((d == "styles") || (d == "style")) {
			b.set_styles(e)
		} else {
			if ((d == "events") || (d == "event")) {
				b.add_events(e)
			} else {
				b.set(d, e)
			}
		}
	});
	return b
};
ng.is_drag_set = false;
ng.set_doc_for_drag = function () {
	ng.drag_object = {};
	ng.set_drag_object = function (a, b) {
		if (!ng.defined(b)) {
			b = 0
		}
		ng.drag_object[b] = a
	};
	ng.ini_drag = function (b) {
		if (ng.defined(b.pointerId)) {
			var e = ng.drag_object[b.pointerId]
		} else {
			var e = ng.drag_object[0]
		}
		if (ng.defined(e.object.p.drag_clone_id)) {
			ng.get(e.object.p.drag_clone_id).parentNode.removeChild(ng.get(e.object.p.drag_clone_id))
		}
		if ((e.style == "proxy") || (e.style == "clone")) {
			e.clone_object = e.object.clone_element((e.style == "clone"));
			e.object.p.drag_clone_id = e.clone_object.id;
			e.clone_object.set_style("position", "absolute");
			if (e.style == "proxy") {
				var a = e.object.get_style("width").to_int();
				if (isNaN(a)) {
					a = e.object.get_width()
				}
				var d = e.object.get_style("height").to_int();
				if (isNaN(d)) {
					d = e.object.get_height()
				}
				e.clone_object.set_styles({
					width: a,
					height: d
				})
			}
			e.drag_element = e.clone_object;
			e.object.append_element(e.clone_object, "before")
		} else {
			if (e.style == "self") {
				e.drag_element = e.object
			} else {
				e.drag_element = e.style
			}
		}
		if (ng.defined(e.opacity)) {
			e.pre_opacity = e.drag_element.get_opacity();
			e.drag_element.set_opacity(e.opacity)
		}
		if (ng.defined(e.zoom)) {
			e.pre_zoom = e.drag_element.get_zoom();
			e.drag_element.set_transform("scale", (e.zoom / 100) + "," + (e.zoom / 100)).transform()
		}
		if (e.on_top) {
			e.pre_zIndex = e.drag_element.get_style("zIndex");
			e.drag_element.set_style("zIndex", 10000000)
		}
		if (ng.defined(e.container)) {
			e.ctr_pos = e.container.get_position();
			e.ctr_w = e.container.get_width();
			e.ctr_h = e.container.get_height()
		} else {
			e.ctr_pos = {
				top: 0,
				left: 0
			};
			e.ctr_w = Math.max(Math.max(document.body.scrollWidth, document.documentElement.scrollWidth), Math.max(document.body.offsetWidth, document.documentElement.offsetWidth), Math.max(document.body.clientWidth, document.documentElement.clientWidth));
			e.ctr_h = Math.max(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), Math.max(document.body.offsetHeight, document.documentElement.offsetHeight), Math.max(document.body.clientHeight, document.documentElement.clientHeight))
		}
		if (e.offset.top != 0) {
			e.drag_element.set_style(e.top, e.drag_element.get_style(e.top).to_int() + e.offset.top)
		}
		if (e.offset.left != 0) {
			e.drag_element.set_style(e.left, e.drag_element.get_style(e.left).to_int() + e.offset.left)
		}
		e.cache = {};
		e.cache.width = e.drag_element.get_width();
		e.cache.height = e.drag_element.get_height();
		e.cache.top = e.drag_element.get_style(e.top).to_int();
		e.cache.left = e.drag_element.get_style(e.left).to_int();
		e.cache.offset_top = b.top - e.cache.top;
		e.cache.offset_left = b.left - e.cache.left;
		e.targets_pos = [];
		for (var c = 0; c < e.targets.length; c++) {
			e.targets[c] = ng.get(e.targets[c]);
			var f = e.targets[c].get_position();
			e.targets_pos.push({
				element: e.targets[c],
				top: f.top,
				left: f.left,
				width: e.targets[c].get_width(),
				height: e.targets[c].get_height(),
				over: false
			})
		}
		delete e.targets;
		if (ng.defined(b.pointerId)) {
			ng.drag_object[b.pointerId] = e
		} else {
			ng.drag_object[0] = e
		}
	};
	ng.fire_drag_events = function (a) {
		var e = a.top;
		var d = a.left;
		if (ng.defined(a.pointerId)) {
			var c = ng.drag_object[a.pointerId]
		} else {
			var c = ng.drag_object[0]
		}
		for (var b = 0; b < c.targets_pos.length; b++) {
			if ((e >= c.targets_pos[b].top) && (e <= c.targets_pos[b].top + c.targets_pos[b].height) && (d >= c.targets_pos[b].left) && (d <= c.targets_pos[b].left + c.targets_pos[b].width)) {
				if (!c.targets_pos[b].over) {
					c.object.fire_event("targetenter", c.targets_pos[b].element, a);
					c.targets_pos[b].over = true
				}
				c.object.fire_event("targetmove", c.targets_pos[b].element, a)
			} else {
				if (c.targets_pos[b].over) {
					c.object.fire_event("targetleave", c.targets_pos[b].element, a);
					c.targets_pos[b].over = false
				}
			}
		}
		if (ng.defined(a.pointerId)) {
			ng.drag_object[a.pointerId] = c
		} else {
			ng.drag_object[0] = c
		}
	};
	ng.drag_mouseup = function (b) {
		var h = null;
		if (ng.defined(b.pointerId)) {
			var g = ng.drag_object[b.pointerId]
		} else {
			var g = ng.drag_object[0]
		}
		if (ng.defined(g)) {
			var e = g.object;
			if (ng.defined(g.clone_object)) {
				e.set_style("position", "absolute");
				e.set_style(g.top, g.clone_object.get_style(g.top));
				e.set_style(g.left, g.clone_object.get_style(g.left));
				if (g.clone_object.parentNode) {
					g.clone_object.parentNode.removeChild(g.clone_object)
				} else {
					if (ng.defined(e.p.drag_clone_id)) {
						ng.get(e.p.drag_clone_id).parentNode.removeChild(ng.get(e.p.drag_clone_id))
					}
				}
				e.p.drag_clone_id = null
			}
			if (ng.type(g.style) != "string") {
				e.set_style("position", "absolute");
				e.set_style(g.top, g.style.get_style(g.top));
				e.set_style(g.left, g.style.get_style(g.left));
				g.drag_element.set_styles({
					top: g.pre_pos.top,
					left: g.pre_pos.left
				})
			}
			if (ng.defined(g.pre_zIndex)) {
				g.drag_element.set_style("zIndex", g.pre_zIndex)
			}
			if (ng.defined(g.pre_opacity)) {
				g.drag_element.set_opacity(g.pre_opacity)
			}
			if (ng.defined(g.pre_zoom)) {
				g.drag_element.set_transform("scale", (g.pre_zoom / 100) + "," + (g.pre_zoom / 100)).transform()
			}
			e.fire_event("dragend", null, b);
			for (var d = 0; d < g.targets_pos.length; d++) {
				if (g.targets_pos[d].over) {
					h = g.targets_pos[d].element;
					break
				}
			}
			if (ng.defined(h)) {
				e.fire_event("drop", h, b)
			} else {
				e.fire_event("drop", [null], b)
			}
			var a = "mousedown";
			var f = "mouseup";
			var c = "mousemove";
			if ("onmspointerdown" in this) {
				a = "MSPointerDown";
				f = "MSPointerUp";
				c = "MSPointerMove"
			} else {
				if ("onpointerdown" in this) {
					a = "pointerdown";
					f = "pointerup";
					c = "pointermove"
				} else {
					if (("ontouchstart" in this) && (!("onmousedown" in this))) {
						a = "touchstart";
						f = "touchend";
						c = "touchmove"
					}
				}
			}
			e.p.is_dragging = false;
			if (ng.defined(b.pointerId)) {
				ng.doc.remove_event(f, ng["drag_mouse_up_" + b.pointerId]);
				ng.doc.remove_event(c, ng["drag_mouse_move_" + b.pointerId]);
				if (("ontouchstart" in e) && (a != "touchstart") && (a.indexOf("pointer") == -1)) {
					e.remove_event("touchend", ng["drag_mouse_up_" + b.pointerId]);
					ng.doc.remove_event("touchmove", ng["drag_mouse_move_" + b.pointerId])
				} else {
					if (f == "touchend") {
						e.add_event("touchend", ng["drag_mouse_up_" + b.pointerId])
					}
				}
				delete ng["drag_mouse_up_" + b.pointerId];
				delete ng["drag_mouse_move_" + b.pointerId]
			} else {
				ng.doc.remove_event(f, ng.drag_mouseup);
				ng.doc.remove_event(c, ng.drag_mousemove)
			}
		}
		if (ng.defined(b.pointerId)) {
			delete ng.drag_object[b.pointerId]
		} else {
			delete ng.drag_object[0]
		}
		document.onselectstart = function () {
			return true
		};
		document.body.onselectstart = function () {
			return true
		};
		document.body.unselectable = "off";
		document.body.style.MozUserSelect = "";
		document.body.style.WebkitUserSelect = ""
	};
	ng.drag_mousemove = function (h) {
		if (ng.defined(h.pointerId)) {
			var d = ng.drag_object[h.pointerId]
		} else {
			var d = ng.drag_object[0]
		}
		if (!ng.defined(d)) {
			return
		}
		if (h.top < d.ctr_pos.top + d.cache.offset_top) {
			var g = d.ctr_pos.top
		}
		if (h.top > d.ctr_pos.top + d.ctr_h - (d.cache.height - d.cache.offset_top)) {
			var j = d.ctr_pos.top + d.ctr_h
		}
		if (h.left < d.ctr_pos.left + d.cache.offset_left) {
			var b = d.ctr_pos.left
		}
		if (h.left > d.ctr_pos.left + d.ctr_w - (d.cache.width - d.cache.offset_left)) {
			var c = d.ctr_pos.left + d.ctr_w
		}
		if (d.object.can_drag()) {
			if (!ng.defined(d.drag_pre_point)) {
				d.drag_pre_point = {
					top: h.top,
					left: h.left
				}
			}
			var i = {
				top: h.top,
				left: h.left
			};
			var f = {};
			var a = false;
			if (Math.abs(d.drag_pre_point.top - i.top) >= d.grid) {
				var e = d.cache.top - (d.drag_pre_point.top - i.top);
				if ((ng.defined(g)) && (e < g)) {
					e = g
				}
				if ((ng.defined(j)) && (e > j)) {
					e = j
				}
				if ((d.ctr_pos.top <= e) && (d.ctr_h + d.ctr_pos.top >= e + d.cache.height)) {
					d.drag_element.set_style(d.top, e);
					d.cache.top = e;
					if (d.top == "height") {
						d.cache.height = e
					}
					a = true
				}
			}
			if (Math.abs(d.drag_pre_point.left - i.left) >= d.grid) {
				var k = d.cache.left - (d.drag_pre_point.left - i.left);
				if ((ng.defined(b)) && (k < b)) {
					k = b
				}
				if ((ng.defined(c)) && (k > c)) {
					k = c
				}
				if ((d.ctr_pos.left <= k) && (d.ctr_w + d.ctr_pos.left >= k + d.cache.width)) {
					d.drag_element.set_style(d.left, k);
					d.cache.left = k;
					if (d.left == "width") {
						d.cache.width = k
					}
					a = true
				}
			}
			if (a) {
				d.object.fire_event("drag", null, h);
				ng.fire_drag_events(h);
				d.drag_pre_point = i
			}
		}
		if (ng.defined(h.pointerId)) {
			ng.drag_object[h.pointerId] = d
		} else {
			ng.drag_object[0] = d
		}
	};
	ng.is_drag_set = true
};
ng.doc = ng.get(document.documentElement);
ng.InnerHtmlEvents = function (a) {
	this.p = {};
	this.id = ng.random_id("innerhtmlevent");
	this.add_events(a);
	ng.global_innerhtml_events[this.id] = this
};
ng.extend_proto(ng.InnerHtmlEvents, ng.Events.prototype);
ng.extend_proto(ng.InnerHtmlEvents, {
	has_type: "innerhtml_event",
	get_html: function () {
		var a = [];
		var b = [];
		ng.obj_each(this.p.events, function (d, c) {
			if (!b.has(c)) {
				a.push(c + "=\"ng.global_innerhtml_events['" + this.id + "'].fire_event('" + c + "', ng.get(this), event);\"");
				b.push(c)
			}
		}, this);
		return a.join(" ")
	},
	remove: function () {
		this.p = null;
		delete ng.global_innerhtml_events[this.id];
		delete this
	},
	toString: function () {
		return this.get_html()
	}
});
ng.global_innerhtml_events = {};
ng.XHR = function (a, b) {
	this.p = {
		url: "",
		param: null,
		eval_script: false,
		xhr: null,
		async: true,
		encoding: ng_config.xhr_encoding,
		headers: null,
		timeout: ng_config.xhr_timeout_length,
		timeout_timer: 0,
		cache: false,
		progress_events_added: false
	};
	this.p.headers = {};
	if (ng.type(a) == "object") {
		var b = a;
		var a = b.url
	}
	this.set_url(a);
	if (!ng.defined(b)) {
		b = {}
	}
	var c = ng.defined;
	if (c(b.param)) {
		this.set_param(b.param)
	}
	if (c(b.cache)) {
		this.set_cache(b.cache)
	}
	if (c(b.events)) {
		this.add_events(b.events)
	}
	if (c(b.async)) {
		this.set_async(b.async)
	}
	if (c(b.method)) {
		this.request(b.method)
	}
	if (c(b.encoding)) {
		this.set_encoding(b.encoding)
	}
	if (c(b.timeout)) {
		this.set_timeout(b.timeout)
	}
	if (c(b.eval_script)) {
		this.set_eval_script(b.eval_script)
	}
	if (c(b.eval_script)) {
		this.set_eval_script(b.eval_script)
	}
	this.set_header("Content-type", "application/x-www-form-urlencoded; charset=" + this.p.encoding);
	return this
};
ng.extend_proto(ng.XHR, ng.Events.prototype);
ng.extend_proto(ng.XHR, {
	has_type: "xhr",
	set_url: function (a) {
		this.p.url = a;
		return this
	},
	get_url: function () {
		return this.p.url
	},
	set_param: function (a) {
		this.p.param = a;
		return this
	},
	get_param: function () {
		return this.p.param
	},
	get_status: function () {
		if (!ng.defined(this.p.xhr)) {
			return 0
		}
		return this.p.xhr.readyState
	},
	get_status_text: function () {
		return ["initialized", "setup", "sent", "process", "complete"][this.get_status()]
	},
	set_async: function (a) {
		this.p.async = a;
		return this
	},
	get_async: function () {
		return this.p.async
	},
	set_encoding: function (a) {
		this.p.encoding = a;
		return this
	},
	get_encoding: function () {
		return this.p.encoding
	},
	set_header: function (a, b) {
		this.p.headers[a] = b;
		return this
	},
	clear_header: function (a) {
		delete this.p.headers[a];
		return this
	},
	get_header: function (a) {
		if (!ng.defined(this.p.xhr)) {
			return this.p.headers[a]
		} else {
			try {
				this.p.xhr.getResponseHeader(a)
			} catch (b) {
				return this.p.headers[a]
			}
		}
	},
	get_headers: function () {
		return this.p.headers
	},
	set_eval_script: function (a) {
		return this.p.eval_script = a;
		return this
	},
	get_eval_script: function () {
		return this.p.eval_script
	},
	set_timeout: function (a) {
		this.p.timeout = a;
		return this
	},
	get_timeout: function () {
		return this.p.timeout
	},
	set_cache: function (a) {
		this.p.cache = a;
		return this
	},
	get_cache: function () {
		return this.p.cache
	},
	request: function (method, process_param) {
		if (!ng.defined(method)) {
			method = "GET"
		}
		if (!ng.defined(process_param)) {
			process_param = true
		}
		method = method.toUpperCase();
		this.get_object();
		var url = this.p.url;
		if (method == "GET") {
			var bdy = null
		} else {
			var bdy = this.p.param
		}
		if ((process_param) && (ng.defined(this.p.param))) {
			if (method != "GET") {
				bdy = ng.make_query(this.p.param)
			} else {
				if (this.p.url.indexOf("?") == -1) {
					var mark = "?"
				} else {
					var mark = "&"
				}
				url += mark + ng.make_query(this.p.param)
			}
		}
		if ((!this.p.cache) && (method == "GET")) {
			if (url.indexOf("?") == -1) {
				var mark = "?"
			} else {
				var mark = "&"
			}
			url += mark + "ng_rand=" + (new Date().getTime())
		}
		var did_onload_run = false;
		var rdy_func = function () {
			did_onload_run = true;
			if (this.p.xhr.readyState == 4) {
				clearTimeout(this.p.timeout_timer);
				var success = 200;
				var o_success = 304;
				if (location.protocol == "file:") {
					var o_success = 0
				}
				if ((this.p.xhr.status == success) || (this.p.xhr.status == o_success)) {
					var args = {
						text: this.p.xhr.responseText,
						xml: this.p.xhr.responseXML,
						response: this.p.xhr.response
					};
					if (this.p.eval_script) {
						try {
							if ((/(ecma|java)script/).test(this.p.xhr.getResponseHeader("Content-type"))) {
								ng.eval(args.text)
							} else {
								var text = "<script>" + args.text + "<\/script>";
								text.eval_script()
							}
						} catch (e) {}
					}
					this.fire_event("success", args);
					ng.get(window).fire_event("xhrsuccess", this);
					if (ng.defined(ng.UI)) {
						ng.UI.ini.delay(250)
					}
				} else {
					var args = this.p.xhr.status;
					this.fire_event("fail", args);
					ng.get(window).fire_event("xhrfail", this)
				}
				this.fire_event("complete", args);
				ng.get(window).fire_event("xhrcomplete", this)
			}
		}.bind(this);
		if (!this.p.progress_events_added) {
			this.p.xhr.onprogress = function (evt) {
				if (evt.lengthComputable) {
					var args = {
						loaded: evt.loaded,
						total: evt.total,
						percent: (100 * evt.loaded / evt.total),
						status: "progress",
						text: this.p.xhr.responseText,
						xml: this.p.xhr.responseXML,
						response: this.p.xhr.response
					}
				} else {
					var args = {
						status: "pending",
						text: this.p.xhr.responseText,
						xml: this.p.xhr.responseXML,
						response: this.p.xhr.response
					}
				}
				this.fire_event("progress", args)
			}.bind(this);
			this.p.xhr.onload = function (evt) {
				var args = {
					status: "complete",
					text: this.p.xhr.responseText,
					xml: this.p.xhr.responseXML,
					response: this.p.xhr.response
				};
				this.fire_event("progress", args)
			}.bind(this);
			this.p.xhr.onerror = function (evt) {
				var args = {
					status: "error",
					text: this.p.xhr.responseText,
					xml: this.p.xhr.responseXML,
					response: this.p.xhr.response
				};
				this.fire_event("progress", args)
			}.bind(this);
			this.p.xhr.onabort = function (evt) {
				var args = {
					status: "cancel",
					text: this.p.xhr.responseText,
					xml: this.p.xhr.responseXML,
					response: this.p.xhr.response
				};
				this.fire_event("cancel", args)
			}.bind(this);
			this.p.progress_events_added = true
		}
		//this.p.xhr.open(method, url, this.p.async);
		this.p.xhr.onreadystatechange = rdy_func;
		ng.obj_each(this.p.headers, function (value, key) {
			try {
				this.p.xhr.setRequestHeader(key, value)
			} catch (e) {}
		}.bind(this));
		if (method == "POST") {
			if (ng.defined(bdy.length)) {
				this.p.xhr.setRequestHeader("Content-length", bdy.length);
				this.p.xhr.setRequestHeader("Connection", "close")
			}
		}
		this.fire_event("request");
		ng.get(window).fire_event("xhrrequest");
		this.p.xhr.send(bdy);
		this.p.timeout_timer = function () {
			this.abort();
			this.fire_event("timeout");
			ng.get(window).fire_event("xhrtimeout", this)
		}.delay(this.p.timeout * 1000, this);
		if (!did_onload_run) {
			rdy_func()
		}
		return this
	},
	cancel: function () {
		if (ng.defined(this.p.xhr)) {
			this.abort();
			this.fire_event("cancel");
			ng.get(window).fire_event("xhrcancel", this)
		}
		return this
	},
	abort: function () {
		if (ng.defined(this.p.xhr)) {
			this.p.xhr.onreadystatechange = function () {};
			clearTimeout(this.p.timeout_timer);
			this.p.xhr.abort()
		}
		return this
	},
	get: function (a) {
		return this.request("GET", a)
	},
	post: function (a) {
		return this.request("POST", a)
	},
	get_object: function () {
		if (!ng.defined(this.p.xhr)) {
			this.p.xhr = ng.get_xhr()
		}
		return this.p.xhr
	},
	submit_form: function (o) {
		o = ng.get(o);
		var b = o.method.toUpperCase();
		var g = o.action;
		if ((g == "") || (!ng.defined(g))) {
			g = location.href
		}
		this.set_url(g);
		if ((b == "POST") && (window.FormData)) {
			this.set_param(new FormData(o));
			this.clear_header("Content-type");
			return this.request(b, false)
		}
		var c = [];
		var r = ["input", "select", "textarea"];
		all_loops: for (var h = 0; h < r.length; h++) {
			var m = o.getElementsByTagName(r[h]);
			for (var l = 0; l < m.length; l++) {
				if (m[l].name != "") {
					var n = m[l].type.toLowerCase();
					var p = true;
					if (r[h] == "input") {
						if (((n == "checkbox") || (n == "radio")) && (!m[l].checked)) {
							p = false
						}
						if (n == "file") {
							if (b == "GET") {
								var d = "";
								if (m[l].value != "") {
									d = m[l].value.split("\\");
									d = d[d.length - 1]
								}
								c.push(ng.make_query(m[l].name) + "=" + ng.make_query(d))
							} else {
								if (m[l].value != "") {
									return this.submit_form_iframe(o);
									break all_loops
								}
							}
							p = false
						}
					}
					if ((r[h] == "select") && (m[l].multiple)) {
						p = false;
						var a = m[l].getElementsByTagName("option");
						for (var f = 0; f < a.length; f++) {
							if (a[f].selected) {
								c.push(ng.make_query(m[l].name) + "=" + ng.make_query(a[f].value))
							}
						}
					}
					if (p) {
						c.push(ng.make_query(m[l].name) + "=" + ng.make_query(m[l].value))
					}
				}
			}
		}
		if (b != "GET") {
			this.set_param(c.join("&"))
		} else {
			var e = "?";
			if (g.indexOf("?") != -1) {
				e = "&"
			}
			g = g + e + c.join("&")
		}
		return this.request(b, false)
	},
	submit_form_iframe: function (c) {
		c = ng.get(c);
		c.enctype = c.encoding = "multipart/form-data";
		var b = ng.create("div", {
			styles: {
				display: "none"
			}
		});
		var e = ng.random_id("xhrframe");
		b.innerHTML = '<iframe name="' + e + '" id="' + e + '" src="about:Blank"><iframe>"';
		document.body.appendChild(b);
		var d = (function () {
			b.remove_element();
			this.fire_event("timeout")
		}.delay((this.get_timeout() * 1000) + 1, this));
		var a = function (g) {
			clearTimeout(d);
			if (!ng.defined(ng.get(e))) {
				return
			}
			try {
				var i = (ng.get(e).contentDocument || ng.get(e).contentWindow);
				if (i.document) {
					i = i.document
				}
				var f = i.body.innerHTML;
				if (f == "") {
					this.fire_event("fail", 0);
					this.fire_event("complete", 0)
				} else {
					this.fire_event("success", {
						text: f,
						xml: f,
						response: f
					});
					this.fire_event("complete", {
						text: f,
						xml: f,
						response: f
					})
				}
			} catch (h) {
				this.fire_event("fail", h.message);
				this.fire_event("complete", h.message)
			}
			b.remove_element()
		}.bind(this);
		ng.get(e).add_event("load", a);
		c.target = e;
		c.submit();
		return this
	}
});
ng.Assets = {
	has_type: "assets",
	p: {
		scripts: [],
		styles: []
	},
	load: function (c, b) {
		if (ng.type(c) == "array") {
			for (var a = 0; a < c.length; a++) {
				ng.Assets.load(c[a])
			}
		} else {
			if (c.indexOf(".js") != -1) {
				ng.Assets.load_script(c, b)
			} else {
				if (c.indexOf(".css") != -1) {
					ng.Assets.load_style(c)
				} else {
					ng.Assets.load_image(c, b)
				}
			}
		}
	},
	load_script: function (f, d) {
		if (!this.p.scripts.has(f)) {
			var a = document.createElement("script");
			a.type = "text/javascript";
			a.src = f;
			var b = d;
			if (ng.defined(d)) {
				if (ng.browser.ie) {
					a.onreadystatechange = function () {
						if ((a.readyState == "complete") || (a.readyState == "loaded")) {
							b.call();
							b = function () {}
						}
					}
				} else {
					a.onload = d
				}
			}
			document.getElementsByTagName("head")[0].appendChild(a);
			this.p.scripts.push(f)
		} else {
			try {
				d.call()
			} catch (c) {}
		}
		return this
	},
	load_style: function (b) {
		if (!this.p.styles.has(b)) {
			var a = document.createElement("link");
			a.type = "text/css";
			a.rel = "stylesheet";
			a.href = b;
			document.getElementsByTagName("head")[0].appendChild(a);
			this.p.styles.push(b)
		}
		return this
	},
	load_image: function (c, b) {
		if (ng.type(c) == "array") {
			return ng.load_images(c, b)
		}
		var a = new Image();
		if (ng.defined(b)) {
			a.onload = b
		}
		a.src = c;
		return this
	},
	load_images: function (b, f, e) {
		if (ng.type(b) == "string") {
			return ng.load_image(b, f)
		}
		var a = b.clone();
		var d = 0;
		var c = function () {
			if (ng.defined(e)) {
				e.defer(null, [a[0], d])
			}
			d++;
			a.remove_key(0);
			if (a.length > 0) {
				ng.Assets.load_image.defer(this, [a[0], c])
			} else {
				f.defer()
			}
		};
		ng.Assets.load_image(a[0], c);
		return this
	}
};
if (!ng_config.use_ui) {
	ng.Assets.load_style(ng_config.assets_dir + "css/" + ng_config.css_skin_prefix + "all.css")
} else {
	ng.ready(function () {
		if (!ng.defined(ng.UI)) {
			ng.Assets.load_style(ng_config.assets_dir + "css/" + ng_config.css_skin_prefix + "all.css")
		}
	})
}
ng.Language = {
	p: {
		default_language: ng_config.language,
		languages: {},
		loaded_src: []
	},
	load: function (c, g) {
		if (!ng.defined(c)) {
			c = "general"
		}
		if (!ng.defined(g)) {
			g = ng.Language.p.default_language
		}
		if (ng.type(c) == "array") {
			for (var b = 0; b < c.length; b++) {
				ng.Language.load(c[b], g)
			}
			return ng.Language
		}
		var a = ng_config.assets_dir + "language/" + g + "/" + c + ".js";
		if (ng.Language.p.loaded_src.has(a)) {
			ng.Language.p.default_language = g;
			return ng.Language
		}
		ng.Language.p.loaded_src.push(a);
		try {
			if (location.protocol == "file:") {
				if (ng.browser.ie) {
					var f = new ng.XHR(a, {
						eval_script: true,
						async: false,
						cache: true
					});
					f.get()
				} else {
					if (ng.browser.loaded) {
						ng.Assets.load(a)
					} else {
						document.write('<script src="' + a + '" type="text/javascript"><\/script>')
					}
				}
			} else {
				var f = new ng.XHR(a, {
					eval_script: true,
					async: false,
					cache: true
				});
				f.get()
			}
		} catch (d) {
			ng.Assets.load(a)
		}
		ng.Language.p.default_language = g;
		return ng.Language
	},
	set_language: function (b, a) {
		if (!ng.defined(b)) {
			b = ng.Language.p.default_language
		}
		if (!ng.defined(ng.Language.p.languages[b])) {
			ng.Language.p.languages[b] = {}
		}
		ng.obj_merge(ng.Language.p.languages[b], a);
		return ng.Language
	},
	get_language: function (a) {
		if (!ng.defined(a)) {
			a = ng.Language.p.default_language
		}
		return ng.Language.p.languages[a]
	},
	translate_numbers: function (c, b) {
		if (!ng.defined(b)) {
			b = ng.Language.p.default_language
		}
		if (b == "en") {
			return c
		}
		if (ng.defined(ng.Language[b + "_translate_numbers"])) {
			return ng.Language[b + "_translate_numbers"](c, b)
		}
		c = c + "";
		for (var a = 0; a < 10; a++) {
			c = c.replace(new RegExp(a, "g"), ng.Language.get_language(b).numbers[a])
		}
		return c
	},
	numbers_to_english: function (d, c) {
		if (!ng.defined(c)) {
			c = ng.Language.p.default_language
		}
		if (c == "en") {
			return d
		}
		if (ng.defined(ng.Language[c + "_numbers_to_english"])) {
			return ng.Language[c + "_numbers_to_english"](d, c)
		}
		var b = ng.Language.get_language(c);
		for (var a = 0; a < b.numbers.length; a++) {
			d = d.replace(new RegExp(b.numbers[a], "g"), a)
		}
		return d
	},
	date_to_english: function (c, g) {
		if (!ng.defined(g)) {
			g = ng.Language.p.default_language
		}
		if (g == "en") {
			return c
		}
		if ((ng.is_lite) && (!ng.defined(ng_lang.en))) {
			return c
		}
		ng.Language.load("general", "en");
		if (ng.defined(ng.Language[g + "_date_to_english"])) {
			return ng.Language[g + "_date_to_english"](str, g)
		}
		var e = ng.Language.get_language(g).date;
		var f = ng.Language.get_language("en").date;
		var b = function (i, h) {
			if (i != "") {
				c = c.replace(i, a[h])
			}
		};
		var a = f.months["long"];
		for (var d = e.months["long"].length - 1; d >= 0; d--) {
			b(e.months["long"][d], d)
		}
		var a = f.months["short"];
		for (var d = e.months["short"].length - 1; d >= 0; d--) {
			b(e.months["short"][d], d)
		}
		var a = f.days["long"];
		for (var d = e.days["long"].length - 1; d >= 0; d--) {
			b(e.days["long"][d], d)
		}
		var a = f.days.mid;
		for (var d = e.days.mid.length - 1; d >= 0; d--) {
			b(e.days.mid[d], d)
		}
		var a = f.am_pm.lowercase;
		for (var d = e.am_pm.lowercase.length - 1; d >= 0; d--) {
			b(e.am_pm.lowercase[d], d)
		}
		var a = f.am_pm.uppercase;
		for (var d = e.am_pm.uppercase.length - 1; d >= 0; d--) {
			b(e.am_pm.uppercase[d], d)
		}
		return ng.Language.numbers_to_english(c, g)
	},
	t: function (b, a) {
		if (!ng.defined(a)) {
			a = ng.Language.p.default_language
		}
		return ng.Language.get_language(a)[b]
	},
	get_dir: function (a) {
		return ng.Language.t("direction", a)
	}
};
ng.Language.load();
ng.ready(function () {
	var b = document.getElementsByTagName("script");
	for (var d = 0, a = b.length; d < a; d++) {
		ng.Assets.p.scripts.push(b[d].src)
	}
	var c = document.getElementsByTagName("link");
	for (var d = 0, a = c.length; d < a; d++) {
		if (c[d].rel.toLowerCase() == "stylesheet") {
			ng.Assets.p.styles.push(c[d].src)
		}
	}
});
ng.Validate = {
	has_type: "validate",
	any: function (a) {
		return true
	},
	text: function (b, a) {
		if (!ng.defined(b)) {
			return false
		}
		if (!ng.defined(a)) {
			a = 1
		}
		return (b.toString().length >= a.to_int())
	},
	max_text: function (b, a) {
		if (!ng.defined(b)) {
			return false
		}
		return (b.toString().length <= a.to_int())
	},
	text_between: function (c, a, b) {
		if (!ng.defined(c)) {
			return false
		}
		return ((c.toString().length <= b.to_int()) && (c.toString().length >= a.to_int()))
	},
	text_equal: function (b, a) {
		if (!ng.defined(b)) {
			return false
		}
		return (b.toString().length == a)
	},
	number: function (a) {
		if (!ng.defined(a)) {
			return false
		}
		if (isNaN(a)) {
			return false
		}
		if (ng.defined(a.is_numeric)) {
			return a.is_numeric()
		}
		return a.toString().is_numeric()
	},
	integer: function (a) {
		if (!ng.defined(a)) {
			return false
		}
		return (a.toString().to_int() == a)
	},
	between: function (c, a, b) {
		if (!ng.Validate.number(c)) {
			return false
		}
		var c = c.to_float();
		if (ng.defined(a)) {
			if (c < a) {
				return false
			}
		}
		if (ng.defined(b)) {
			if (c > b) {
				return false
			}
		}
		return true
	},
	greater_than: function (b, a) {
		return ng.Validate.between(b, a, null)
	},
	less_than: function (b, a) {
		return ng.Validate.between(b, null, a)
	},
	regexp: function (b, a) {
		if (!ng.defined(b)) {
			return false
		}
		if (ng.type(a) == "string") {
			var a = new RegExp(a)
		}
		return a.test(b.toString())
	},
	email: function (a) {
		return ng.Validate.regexp(a, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
	},
	url: function (a) {
		return ng.Validate.regexp(a, /^((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)$/)
	},
	us_zip: function (a) {
		return ng.Validate.regexp(a, /^\d{5}(-\d{4})?$/)
	},
	canada_zip: function (a) {
		return ng.Validate.regexp(a, /^[a-zA-Z]{1}\d{1}[a-zA-Z]{1}[ |-]?\d{1}[a-zA-Z]{1}\d{1}$/)
	},
	us_phone: function (a) {
		return ng.Validate.regexp(a, /^1?\s?[\-|\.]?\(?\s?[2-9]{1}\d{2}\s?\)?\s?[\-|\.]?\s?\d{3}\s?[\-|\.]?\s?\d{4}$/)
	},
	date: function (d, a, b) {
		if (ng.type(d) == "date") {
			var c = d.getTime()
		} else {
			if (ng.type(d) == "number") {
				var c = d
			} else {
				d = d.toString();
				d = d.replace("1st", "1").replace("2nd", "2").replace("3rd", "3");
				var c = Date.parse(d.replace(/[-|\\]/g, "/"))
			}
		}
		if (isNaN(c)) {
			return false
		}
		if (ng.defined(a)) {
			if (c < a.getTime()) {
				return false
			}
		}
		if (ng.defined(b)) {
			if (c > b.getTime()) {
				return false
			}
		}
		return true
	},
	date_greater_than: function (b, a) {
		return ng.Validate.date(b, a)
	},
	date_less_than: function (b, a) {
		return ng.Validate.date(b, null, a)
	},
	credit_card: function (f, d) {
		if (ng.type(d) == "string") {
			d = d.toLowerCase();
			if (d.indexOf("master") != -1) {
				d = "mc"
			} else {
				if (d.indexOf("american") != -1) {
					d = "amex"
				} else {
					if (d.indexOf("diner") != -1) {
						d = "diner"
					} else {
						if (d.indexOf("china") != -1) {
							d = "chinaunionpay"
						}
					}
				}
			}
			var a = {
				visa: {
					length: [13, 16],
					prefix: 4,
					func: ng.Validate.mod_10
				},
				mc: {
					length: 16,
					prefix: [51, 52, 53, 54, 55],
					func: ng.Validate.mod_10
				},
				amex: {
					length: 15,
					prefix: [34, 37],
					func: ng.Validate.mod_10
				},
				discover: {
					length: 16,
					prefix: [6011, 65, 644, 645, 646, 647, 648, 649, 622],
					func: ng.Validate.mod_10
				},
				diner: {
					length: 14,
					prefix: [300, 301, 302, 303, 304, 305, 36, 38],
					func: ng.Validate.mod_10
				},
				jcb: {
					length: [15, 16],
					prefix: [3, 2131, 1800],
					func: ng.Validate.mod_10
				},
				chinaunionpay: {
					length: [16, 17, 18, 19],
					prefix: 62,
					func: function () {
						return true
					}
				}
			};
			d = a[d]
		}
		f = f.toString();
		if (!ng.Validate.number(f)) {
			return false
		}
		if (ng.type(d.length) != "array") {
			d.length = [d.length]
		}
		if (ng.type(d.prefix) != "array") {
			d.prefix = [d.prefix]
		}
		var e = false;
		for (var c = 0; c < d.length.length; c++) {
			if (f.length == d.length[c]) {
				e = true;
				break
			}
		}
		if (!e) {
			return false
		}
		var e = false;
		for (var c = 0; c < d.prefix.length; c++) {
			var b = d.prefix[c].toString();
			if (f.substr(0, b.length) == b) {
				e = true;
				break
			}
		}
		if (!e) {
			return false
		}
		return d.func(f)
	},
	mod_10: function (d) {
		d = d.toString().replace(/[^\d]/g, "");
		var c = "";
		var b = 0;
		for (var a = 0; a < d.length; a++) {
			if (a % 2 == 0) {
				c += d.charAt(d.length - a - 1)
			} else {
				c += d.charAt(d.length - a - 1).to_int() * 2
			}
		}
		for (var a = 0; a < c.length; a++) {
			b += c.charAt(a).to_int()
		}
		return (b % 10 == 0)
	},
	cvv: function (c, b) {
		var b = b.toLowerCase();
		if (b.indexOf("american") != -1) {
			b = "amex"
		}
		var a = 3;
		if (b == "amex") {
			a = 4
		}
		if (!ng.Validate.number(c)) {
			return false
		}
		return (c.toString().length == a)
	}
};
ng.Filter = {
	has_type: "filter",
	any: function (a) {
		return a
	},
	string: function (c, b, a) {
		if (!ng.defined(c)) {
			c = ""
		}
		c = c.toString();
		if ((ng.defined(b)) && (c.length > b)) {
			c = c.substr(0, b);
			if ((ng.defined(a)) && (a)) {
				var d = c.lastIndexOf(" ");
				if (d != -1) {
					c = c.substr(0, d)
				}
			}
		}
		return c
	},
	number: function (c, a, b) {
		if (!ng.defined(c)) {
			return ""
		}
		c = c.toString().replace(/[^\d]/g, "").to_float();
		if (isNaN(c)) {
			return ""
		}
		if (ng.defined(a)) {
			if (c < a) {
				c = a
			}
		}
		if (ng.defined(b)) {
			if (c > b) {
				c = b
			}
		}
		return c
	},
	integer: function (c, a, b) {
		if (!ng.defined(c)) {
			return ""
		}
		return Math.round(ng.Filter.number(c.toString().to_int(), a, b))
	},
	between: function (c, a, b) {
		return ng.Filter.number(c, a, b)
	},
	less_than: function (b, a) {
		return ng.Filter.number(b, null, a)
	},
	greater_than: function (b, a) {
		return ng.Filter.number(b, a)
	},
	date: function (b, a, c) {
		if (ng.type(b) == "string") {
			b = b.replace("1st", "1").replace("2nd", "2").replace("3rd", "3");
			b = Date.parse(b)
		} else {
			if (ng.type(b) == "date") {
				b = b.getTime()
			} else {
				b = b
			}
		}
		if (isNaN(b)) {
			return ""
		}
		if (ng.defined(a)) {
			a = a.getTime()
		}
		if (ng.defined(c)) {
			c = c.getTime()
		}
		return new Date(ng.Filter.number(b, a, c))
	},
	date_between: function (b, a, c) {
		return ng.Filter.date(b, a, c)
	},
	date_greater_than: function (b, a) {
		return ng.Filter.date(b, a)
	},
	date_less_than: function (a, b) {
		return ng.Filter.date(a, null, b)
	},
	credit_card: function (c, a) {
		if (!ng.defined(a)) {
			a = ""
		}
		if (ng.type(a) == "string") {
			a = a.toLowerCase();
			if (a.indexOf("american") != -1) {
				a = "amex"
			}
			if (a == "amex") {
				var b = 15
			} else {
				var b = 16
			}
		} else {
			var b = a
		}
		c = c.toString().replace(/[^\d]/g, "");
		return c.substr(0, b)
	},
	cvv: function (c, a) {
		if (!ng.defined(a)) {
			a = ""
		}
		if (ng.type(a) == "string") {
			a = a.toLowerCase();
			if (a.indexOf("american") != -1) {
				a = "amex"
			}
			if (a == "amex") {
				var b = 4
			} else {
				var b = 3
			}
		} else {
			var b = a
		}
		c = c.toString().replace(/[^\d]/g, "");
		return c.substr(0, b)
	}
};
ng.Format = {
	has_type: "format",
	any: function (a) {
		return a
	},
	number: function (e, d, g, a, c) {
		e = e.toString().to_float();
		if (isNaN(e)) {
			e = 0
		}
		if (!ng.defined(d)) {
			d = 0
		}
		if (!ng.defined(g)) {
			g = "."
		}
		if (!ng.defined(a)) {
			if (g == ".") {
				a = ","
			} else {
				a = " "
			}
		}
		if (!ng.defined(c)) {
			c = true
		}
		if (c) {
			e = e.round(d)
		}
		var f = 1;
		if (e < 0) {
			f = -1
		}
		e = (e * f).toString();
		var h = e.split(".");
		if (d > 0) {
			if (!ng.defined(h[1])) {
				h[1] = ""
			}
			h[1] = g + (h[1] + new Array(d + 1).join("0")).substr(0, d)
		} else {
			h[1] = ""
		}
		if (a != "") {
			var b = [];
			while (h[0].length > 3) {
				var j = h[0].length - 3;
				b.push(h[0].substr(j));
				h[0] = h[0].substr(0, j)
			}
			b.push(h[0]);
			h[0] = b.reverse().join(a)
		}
		var i = "";
		if (f < 0) {
			i += "-"
		}
		if (h[0] == "") {
			i += "0"
		} else {
			i += h[0]
		}
		i += h[1];
		return i
	},
	money: function (b, c, a) {
		if (!ng.defined(c)) {
			c = "($#)"
		}
		if (!ng.defined(a)) {
			a = /[\-|\(|\)]/g
		}
		if (ng.type(b) == "number") {
			b = ng.Format.number(b, 2)
		}
		if (b.charAt(0) != "-") {
			c = c.replace(a, "")
		} else {
			b = b.substr(1)
		}
		return c.replace("#", b)
	},
	phone: function (c, e, b) {
		if (!ng.defined(e)) {
			e = "+#r (#3) #3-#4"
		}
		if (!ng.defined(b)) {
			b = /^[\s|\-|\)]+|[\s|\-|\(]+$/g
		}
		c = c.toString().replace(/[^\d]/g, "");
		var d, a;
		while ((e.indexOf("#") != -1) && (c.length > 0)) {
			d = e.lastIndexOf("#");
			a = e.charAt(d + 1);
			if (a == "r") {
				a = c.length
			} else {
				a = a.to_int()
			}
			if (a > c.length) {
				a = c.length
			}
			e = e.substr(0, d) + c.substr(c.length - a) + e.substr(d + 2);
			c = c.substr(0, c.length - a)
		}
		d = e.lastIndexOf("#");
		if (d == -1) {
			d = -2
		}
		return e.substr(d + 2).replace(b, "")
	},
	us_zip: function (c) {
		c = c.toString().replace(/[^\d|\-]/g, "");
		if (c.indexOf("-") != -1) {
			var a = c.split("-")
		} else {
			if (c.length > 5) {
				var a = [c.substr(0, 5), c.substr(5)]
			} else {
				if (c.length == 5) {
					return c
				} else {
					var a = [c, ""]
				}
			}
		}
		if (a[0].length < 5) {
			a[0] = new Array(5 - a[0].length + 1).join("0") + a[0]
		}
		a[0] = a[0].substr(0, 5);
		var b = a[0];
		if (a[1] != "") {
			if (a[1].length < 4) {
				a[1] += new Array(4 - a[1].length + 1).join("0")
			}
			a[1] = a[1].substr(0, 4);
			b += "-" + a[1]
		}
		return b
	},
	canada_zip: function (a) {
		a = a.toString().replace(/[^\w\d]/g, "");
		if (a.length < 6) {
			a += new Array(6 - a.length + 1).join("0")
		}
		a = a.toUpperCase();
		return a.substr(0, 3) + " " + a.substr(3, 3)
	},
	credit_card: function (c, b) {
		if (!ng.defined(b)) {
			b = " "
		}
		c = c.toString().replace(/[^\d]/g, "");
		if (c.length == 15) {
			c = c.substr(0, 4) + b + c.substr(4, 6) + b + c.substr(10)
		} else {
			var a = [];
			while (c.length > 0) {
				a.push(c.substr(0, 4));
				c = c.substr(4)
			}
			c = a.join(b)
		}
		return c
	},
	credit_card_stars: function (c, a, b) {
		if (!ng.defined(a)) {
			a = 4
		}
		if (!ng.defined(b)) {
			b = "*"
		}
		c = c.toString().replace(/[^\d]/g, "");
		if (a > c.length) {
			a = c.length
		}
		return new Array(c.length - a + 1).join(b) + c.substr(c.length - a)
	},
	date: function (b, c, a) {
		if (ng.type(b) == "string") {
			b = b.replace("1st", "1").replace("2nd", "2").replace("3rd", "3");
			b = Date.parse(b);
			if (isNaN(b)) {
				return ""
			}
			b = new Date(b)
		} else {
			if (ng.type(b) == "number") {
				b = new Date(b)
			} else {
				b = b
			}
		}
		return b.print(c, a)
	}
};
ng.PlugIn = function (a) {
	this.p = this.create_options(a, {
		object: null,
		language: null
	});
	this.create_events()
};
ng.extend_proto(ng.PlugIn, ng.Events.prototype);
ng.extend_proto(ng.PlugIn, {
	has_type: "plugin",
	is_ng_plugin: true,
	create_options: function (b, c) {
		var a = {};
		if (ng.defined(this.p)) {
			ng.obj_merge(a, this.p)
		}
		if ((ng.type(b) == "string") || (ng.type(b) == "html_element")) {
			b = ng.html5_options(b)
		}
		if (ng.defined(c)) {
			ng.obj_merge(a, c)
		}
		if (ng.defined(b)) {
			ng.obj_merge(a, b)
		}
		return a
	},
	create_events: function () {
		if (ng.defined(this.p.events)) {
			var a = this.p.events;
			delete this.p.events;
			this.add_events(a)
		}
	},
	get_position: function () {
		return this.get_object().get_position()
	},
	get_width: function () {
		return this.get_object().get_width()
	},
	get_height: function () {
		return this.get_object().get_height()
	},
	set_object: function (a) {
		if (ng.defined(a)) {
			this.p.object = ng.get(a)
		}
		return this
	},
	get_object: function () {
		return this.p.object
	},
	make_id: function (a) {
		if (!ng.defined(a)) {
			var a = "plugin"
		}
		if (!ng.defined(this.p.id)) {
			this.id = ng.random_id(a)
		} else {
			this.id = this.p.id;
			delete this.p.id
		}
		return this
	},
	get_id: function () {
		if (!ng.defined(this.id)) {
			this.make_id()
		}
		return this.id
	},
	set_language: function (a) {
		if (!ng.defined(a)) {
			a = ng_config.language
		}
		this.p.language = a;
		if (ng.defined(this.p.object)) {
			this.p.object.dir = ng.Language.get_dir(this.get_language())
		}
		return this
	},
	get_language: function () {
		if (!ng.defined(this.p.language)) {
			this.set_language(null)
		}
		return this.p.language
	},
	remove: function () {
		ng.obj_each(this.p, function (b, a) {
			if (ng.defined(b)) {
				if (ng.defined(b.remove_element)) {
					b.remove_element()
				} else {
					if ((ng.defined(b.remove)) && (ng.type(b.remove) == "function")) {
						b.remove()
					}
				}
			} else {
				delete this.p[a]
			}
		}, this);
		delete this
	}
});
ng.Component = function (a) {
	this.p = this.create_options(a, {
		content: null,
		input: null,
		placement: "aaaa",
		visible: false,
		offset: null,
		open: false,
		button: null,
		parent: null,
		disabled: false,
		buttons_color: ng_config.button_color,
		buttons_over_color: ng_config.button_over_color,
		buttons_down_color: null,
		buttons_disable_color: null,
		buttons_gloss: ng_config.button_gloss,
		buttons_checked_color: ng_config.button_checked_color,
		button_light_border: ng_config.button_light_border,
		button_ui_class: "",
		responsive_top: null,
		responsive_left: null,
		is_moving_input: false,
		open_onfocus: true,
		open_onclick: true
	});
	this.create_events();
	if (this.p.disabled) {
		this.p.disabled = false;
		this.disable.delay(100, this)
	}
	this.make_id("component");
	if (ng.defined(this.p.object)) {
		this.set()
	}
};
ng.Component.inherit(ng.PlugIn);
ng.extend_proto(ng.Component, {
	has_type: "component",
	is_ng_component: true,
	set: function () {
		if (!ng.defined(this.p.object)) {
			this.set_object(ng.create("div"));
			document.body.appendChild(this.p.object)
		}
		this.set_object(this.p.object);
		if (ng.defined(this.p.input)) {
			this.set_input(this.p.input)
		}
		this.set_language(this.p.language);
		if (!ng.defined(this.p.placement)) {
			this.p.placement = "aaaa"
		}
		this.set_placement(this.get_placement().toLowerCase());
		if (ng.defined(this.p.button)) {
			var a = this.p.button;
			this.p.button = null;
			this.set_button(a)
		}
		var c = this.get_object();
		if (!this.p.visible) {
			c.add_class("ng-comp-hidden")
		} else {
			this.p.open = true;
			c.add_class("ng-comp-visible")
		}
		var b = "right";
		if (ng.Language.get_dir(this.p.language) == "rtl") {
			b = "left"
		}
		if ((ng.browser.ie) && (ng.browser.get_ie_version() < 9)) {
			c.set_html('<table cellspacing="0" cellpadding="0" class="ng-comp-table ' + ng.Language.get_dir(this.p.language) + '"><tr><td class="ng-comp-main-td" id="' + this.id + '_content"></td><td class="ng-comp-' + b + '-shadow"> </td></tr><tr><td class="ng-comp-bottom-shadow"> </td><td class="ng-comp-bottom-' + b + '-shadow"> </td></tr></table>')
		} else {
			c.set_html('<div class="ng-comp-input-holder ' + ng.Language.get_dir(this.p.language) + '" id="' + this.id + '_input_div"><div class="ng-comp-close-button" onclick="ng.close_all_component();">×</div></div><div class="ng-comp-main-div ' + ng.Language.get_dir(this.p.language) + '" id="' + this.id + '_content"></div>')
		}
		this.p.content = ng.get(this.id + "_content");
		ng.all_component_arr[this.id] = this;
		if (ng.defined(this.p.parent)) {
			if (ng.type(this.p.parent) != "string") {
				this.p.parent = this.p.parent.id
			}
		}
		if (this.p.disabled) {
			this.disable()
		}
		return this
	},
	set_parent: function (a) {
		if (a.is_ng_component) {
			this.p.parent = a.id
		} else {
			this.p.parent = a
		}
		return this
	},
	get_parent: function () {
		return this.p.parent
	},
	get_parents_components: function () {
		var a = [];
		var b = this;
		while ((ng.defined(b)) && (ng.defined(b.get_parent()))) {
			a.push(b.get_parent());
			b = ng.all_component_arr[b.parent]
		}
		return a
	},
	get_children_components: function () {
		var a = [];
		ng.obj_each(ng.all_component_arr, function (c, b) {
			if (c.get_parent() == this.id) {
				a.push(b)
			}
		}, this);
		return a
	},
	set_html: function (c, a, b) {
		if (!ng.defined(this.p.content)) {
			this.set()
		}
		this.p.content.set_html(c, a, b);
		return this
	},
	get_html: function () {
		if (!ng.defined(this.p.content)) {
			this.set()
		}
		return this.p.content.get_html()
	},
	get_content_div: function (b, a) {
		if (!ng.defined(this.p.content)) {
			this.set()
		}
		return this.p.content
	},
	get_position_style: function (k) {
		if (!ng.defined(k)) {
			var k = this.get_input()
		} else {
			var k = ng.get(k)
		}
		if (!ng.defined(k)) {
			return {
				top: "auto",
				left: "auto"
			}
		}
		if (window.innerWidth <= 480) {
			var p = ng.doc.clientHeight;
			var j = ng.doc.clientWidth;
			var s = (j - this.get_content_div().get_width()) / 2;
			var o = (p - this.get_content_div().get_height()) / 2;
			if (ng.defined(this.p.responsive_top)) {
				o = this.p.responsive_top
			}
			if (ng.defined(this.p.responsive_left)) {
				s = this.p.responsive_left
			}
			if (o < 15) {
				o = 15
			}
			var f = {
				top: Math.max(ng.doc.scrollTop, window.scrollY || 0),
				left: 0,
				right: 0,
				paddingTop: o,
				height: p
			};
			if (ng.Language.get_dir(this.get_language()) == "rtl") {
				f.paddingRight = s
			} else {
				f.paddingLeft = s
			}
			return f
		}
		var e = k.get_position();
		var d = 1;
		if (ng.Language.get_dir(this.get_language()) == "rtl") {
			d = -1
		}
		var n = this.get_offset();
		var l = e.top + n.y;
		var c = e.left + (n.x * d);
		var m = this.p.placement;
		var g = this.p.content;
		var i = Math.max(g.get_height(), g.scrollHeight);
		var a = Math.max(g.get_width(), g.scrollWidth);
		var b = ng.doc.get_height();
		var r = ng.doc.get_width();
		var q = Math.max(ng.doc.get_scroll_top(), document.body.scrollTop);
		var t = Math.max(ng.doc.get_scroll_left(), document.body.scrollLeft);
		if (m.charAt(0) == "a") {
			if (((l + i - q) > b) && (i <= l - q)) {
				m = "t" + m.substr(1, 1) + "b" + m.substr(3, 1)
			} else {
				m = "b" + m.substr(1, 1) + "t" + m.substr(3, 1)
			}
		}
		if (m.charAt(1) == "a") {
			if (d == -1) {
				if (((c + a - (r - t)) > r) && (a <= c - (r - t))) {
					m = m.substr(0, 1) + "l" + m.substr(2, 1) + "l"
				} else {
					m = m.substr(0, 1) + "r" + m.substr(2, 1) + "r"
				}
			} else {
				if (((c + a - t) > r) && (a <= c - t)) {
					m = m.substr(0, 1) + "r" + m.substr(2, 1) + "r"
				} else {
					m = m.substr(0, 1) + "l" + m.substr(2, 1) + "l"
				}
			}
		}
		if (m.charAt(0) == "b") {
			l += k.get_height()
		}
		if (m.charAt(1) == "r") {
			c += k.get_width()
		}
		var f = {};
		if (m.charAt(2) == "t") {
			f.top = l
		} else {
			f.top = l - i
		}
		if (m.charAt(3) == "l") {
			f.left = c
		} else {
			f.left = c - a
		}
		f.paddingLeft = "";
		f.paddingTop = "";
		f.right = "";
		f.height = "";
		return f
	},
	check_parent_id: function () {
		if (!ng.defined(this.p.input)) {
			return this
		}
		if (!ng.defined(ng.get("input_button_container" + this.id))) {
			var a = ng.create("span", {
				id: "input_button_container" + this.id
			});
			this.p.input.append_element(a, "before");
			a.append_element(this.p.input)
		}
	},
	open: function (a) {
		if (this.is_disabled()) {
			return this
		}
		if ((this.p.visible) || (this.is_open())) {
			return this
		}
		this.p.object.set_styles({
			display: "inline-block"
		});
		ng.get(document.getElementsByTagName("body")[0].add_class("ng-comp-open"));
		this.check_parent_id();
		if (window.innerWidth <= 480) {
			if ((ng.defined(this.p.input)) && (this.p.input.parentNode.id != this.id + "_input_div")) {
				ng.get(this.id + "_input_div").set_style("width", this.get_content_div().get_width());
				this.p.is_moving_input = true;
				ng.get(this.id + "_input_div").append_element(this.p.input);
				(function () {
					this.p.is_moving_input = false
				}.defer(this))
			}
		}
		var b = this.get_position_style(a);
		this.p.object.set_styles(b);
		this.p.object.set_styles({
			opacity: 100,
			height: this.p.object.scrollHeight
		});
		this.p.open = true;
		this.show_shim(b);
		ng.close_all_component(this.id);
		return this.fire_event("open")
	},
	reposition: function (a) {
		if ((this.is_open()) && (!this.get_visible())) {
			this.check_parent_id();
			if (window.innerWidth >= 480) {
				if ((ng.defined(this.p.input)) && (this.p.input.parentNode.id != "input_button_container" + this.id)) {
					this.p.is_moving_input = true;
					ng.get("input_button_container" + this.id).append_element(this.p.input, "top");
					(function () {
						this.p.is_moving_input = false
					}.defer(this))
				}
				ng.get(document.getElementsByTagName("body")[0].remove_class("ng-comp-open"))
			} else {
				if ((ng.defined(this.p.input)) && (this.p.input.parentNode.id != this.id + "_input_div")) {
					ng.get(this.id + "_input_div").set_style("width", this.get_content_div().get_width());
					this.p.is_moving_input = true;
					ng.get(this.id + "_input_div").append_element(this.p.input);
					(function () {
						this.p.is_moving_input = false
					}.defer(this))
				}
				ng.get(document.getElementsByTagName("body")[0].add_class("ng-comp-open"))
			}
			var b = this.get_position_style(a);
			this.p.object.set_styles(b);
			this.show_shim(b)
		}
		return this
	},
	show_shim: function (b) {
		if (ng.defined(this.p.shim_timer)) {
			clearTimeout(this.p.shim_timer)
		}
		if (this.is_disabled()) {
			return this
		}
		if ((this.p.visible) || (!this.is_open())) {
			return this
		}
		if (this.is_shim_required()) {
			if (!ng.defined(this.p.iframe_shim)) {
				var a = ng.random_id("shim_frame");
				ng.hold_html("<iframe id='ng_iframe_shim" + a + "' src=' javascript:\"\";' frameborder='0' class='ng-comp-iframe-shim'></iframe>");
				this.p.iframe_shim = ng.get("ng_iframe_shim" + a);
				ng.doc.append_element(this.p.iframe_shim)
			}
			this.p.iframe_shim.set_styles({
				width: this.p.object.get_width() - 4,
				height: this.p.object.get_height() - 4,
				top: b.top,
				left: b.left,
				display: "block"
			});
			this.p.shim_timer = this.show_shim.delay(250, this, [b])
		}
	},
	close: function () {
		if (this.is_disabled()) {
			return this
		}
		if ((this.p.visible) || (!this.is_open())) {
			return this
		}
		this.check_parent_id();
		var a = {
			paddingLeft: "",
			paddingTop: "",
			right: "",
			height: "",
			display: "none"
		};
		if ((ng.defined(this.p.input)) && (this.p.input.parentNode.id != "input_button_container" + this.id)) {
			this.p.is_moving_input = true;
			ng.get("input_button_container" + this.id).append_element(this.p.input, "top");
			(function () {
				this.p.is_moving_input = false
			}.defer(this))
		}
		if ((!ng.defined(this.p.object.animate)) && (ng.browser.ie) && (ng.browser.get_ie_version() < 8)) {
			this.p.object.set_styles(a)
		} else {
			this.p.object.animate({
				end: {
					opacity: 0,
					height: 0
				},
				time: 200
			}, function () {
				this.p.object.set_styles(a)
			}.bind(this))
		}
		ng.get(document.getElementsByTagName("body")[0].remove_class("ng-comp-open"));
		this.hide_shim();
		this.p.open = false;
		return this.fire_event("close")
	},
	hide_shim: function () {
		if (this.is_shim_required()) {
			if (ng.defined(this.p.iframe_shim)) {
				this.p.iframe_shim.set_styles({
					width: 0,
					height: 0,
					top: -500,
					left: -500,
					display: "none"
				})
			}
		}
	},
	toggle: function (a) {
		if (this.is_disabled()) {
			return this
		}
		if (this.is_open()) {
			return this.close()
		} else {
			return this.open(a)
		}
	},
	is_shim_required: function () {
		return ((ng.browser.ie6) || (document.getElementsByTagName("embed").length > 0))
	},
	is_disabled: function () {
		if (!ng.defined(this.p.disabled)) {
			this.p.disabled = false
		}
		return this.p.disabled
	},
	is_enabled: function () {
		return (!this.is_disabled())
	},
	disable: function () {
		if (this.is_disabled()) {
			return this
		}
		this.close();
		this.get_object().add_class("ng-comp-disabled");
		ng.obj_each(this.p, function (b, a) {
			if ((ng.defined(b)) && (ng.defined(b.disable)) && (ng.type(b.disable) == "function")) {
				b.disable()
			}
		});
		this.p.disabled = true;
		this.fire_event("disable");
		return this
	},
	enable: function () {
		if (this.is_enabled()) {
			return this
		}
		this.get_object().remove_class("ng-comp-disabled");
		ng.obj_each(this.p, function (b, a) {
			if ((ng.defined(b)) && (ng.defined(b.enable)) && (ng.type(b.enable) == "function")) {
				b.enable()
			}
		});
		this.p.disabled = false;
		this.fire_event("enable");
		return this
	},
	is_open: function () {
		if (!ng.defined(this.p.open)) {
			this.p.open = false
		}
		return this.p.open
	},
	is_close: function () {
		if (!ng.defined(this.p.open)) {
			this.p.open = false
		}
		return !(this.is_open())
	},
	set_object: function (a) {
		if (!ng.defined(this.p.object_mouseup_event)) {
			this.p.object_mouseup_event = function (b) {
				ng.close_all_component(this.id);
				b.stop()
			}.bind(this)
		}
		if ((ng.defined(this.p.object)) && (this.p.object.remove_event)) {
			this.p.object.remove_event("mouseup", this.p.object_mouseup_event)
		}
		if (ng.defined(a)) {
			this.p.object = ng.get(a);
			this.p.object.add_event("mouseup", this.p.object_mouseup_event)
		}
		return this
	},
	input_mouseup_event: function (a) {
		a.stop()
	},
	set_input: function (a) {
		if (!ng.defined(this.p.input_focus_event)) {
			this.p.input_focus_event = function () {
				if (this.p.open_onfocus) {
					this.open()
				}
			}.bind(this)
		}
		if (!ng.defined(this.p.input_click_event)) {
			this.p.input_click_event = function () {
				if (this.p.open_onclick) {
					this.open()
				}
			}.bind(this)
		}
		if ((ng.defined(this.p.input)) && (this.p.input.remove_events)) {
			this.p.input.remove_events({
				focus: this.p.input_focus_event,
				click: this.p.input_click_event,
				mouseup: this.input_mouseup_event
			})
		}
		this.p.input = ng.get(a);
		if (!ng.defined(this.p.open_onfocus)) {
			this.p.open_onfocus = true
		}
		if (!ng.defined(this.p.open_onclick)) {
			this.p.open_onclick = true
		}
		this.p.input.add_events({
			focus: this.p.input_focus_event,
			click: this.p.input_click_event,
			mouseup: this.input_mouseup_event
		});
		if (!ng.defined(this.p.first_time_input_set)) {
			this.p.first_time_input_set = true
		}(function () {
			if (!ng.defined(this.p.input.paretNode)) {
				return
			}
			if (this.p.first_time_input_set) {
				this.p.first_time_input_set = false;
				return
			}
			if (this.p.input.paretNode.id != "input_button_container" + this.id) {
				if (ng.defined(ng.get("input_button_container" + this.id))) {
					var b = ng.get("input_button_container" + this.id);
					while (b.childNodes.length > 0) {
						b.append_element(b.childNodes[0], "before")
					}
				} else {
					var b = ng.create("span", {
						id: "input_button_container" + this.id
					})
				}
				this.p.input.append_element(b, "before");
				b.append_element(this.p.input)
			}
		}.delay(50, this));
		return this
	},
	get_input: function (a) {
		return this.p.input
	},
	set_button: function (a) {
		if (ng.defined(a)) {
			if (ng.defined(this.p.button)) {
				if ((ng.defined(a.get_component())) && (this.get_id() == a.get_component().get_id())) {
					return this
				}
				if (this.p.button.remove_component) {
					this.p.button.remove_component()
				}
			}
			a.set_component(this)
		}
		this.p.button = a;
		return this
	},
	get_button: function () {
		return this.p.button
	},
	set_placement: function (a) {
		this.p.placement = a.toLowerCase();
		return this
	},
	get_placement: function () {
		return this.p.placement
	},
	set_offset: function (a) {
		if (!ng.defined(a)) {
			a = {
				x: 0,
				y: 0
			}
		}
		this.p.offset = a;
		return this
	},
	get_offset: function () {
		if (!ng.defined(this.p.offset)) {
			this.p.offset = {
				x: 0,
				y: 0
			}
		}
		return this.p.offset
	},
	set_visible: function (a) {
		if (a != this.p.visible) {
			if (!a) {
				this.get_object().remove_class("ng-comp-visible");
				this.get_object().add_class("ng-comp-hidden");
				this.p.visible = a;
				this.close();
				if (ng.defined(this.p.button)) {
					this.p.button.get_object().set_style("display", "")
				}
			} else {
				this.get_object().remove_class("ng-comp-hidden");
				this.get_object().add_class("ng-comp-visible");
				this.open();
				this.p.visible = a;
				if (ng.defined(this.p.button)) {
					this.p.button.get_object().set_style("display", "none")
				}
			}
		}
		return this
	},
	get_visible: function () {
		return this.p.visible
	},
	set_open_onfocus: function (a) {
		if (!ng.defined(a)) {
			a = true
		}
		this.p.open_onfocus = a;
		return this
	},
	get_open_onfocus: function () {
		return this.p.open_onfocus
	},
	set_open_onclick: function (a) {
		if (!ng.defined(a)) {
			a = true
		}
		this.p.open_onclick = a;
		return this
	},
	get_open_onclick: function () {
		return this.p.open_onclick
	},
	get_input_html: function () {
		var b = "";
		if (this.get_visible()) {
			b = ' style="display:none;"'
		}
		if (ng.UI) {
			var a = '<span class="ng-input-button-container" id="input_button_container' + this.id + '" dir="' + ng.Language.get_dir(this.get_language()) + '"></span>';
			(function () {
				if ((ng.defined(this.p.button)) && (ng.defined(this.p.input))) {
					var e = this.p.button.get_object();
					var c = this.p.input;
					if (ng.defined(c)) {
						var f = c.get_height();
						var d = e.get_height();
						if (d > f) {
							e.set_style("height", f)
						} else {
							if (d < f) {
								f = f - d;
								e.set_styles({
									paddingTop: Math.floor(f / 2),
									paddingBottom: Math.floor(f / 2)
								})
							}
						}
					}
					if (b != "") {
						this.p.button.get_object().set_style("display", "none")
					}
				}
			}.delay(250, this))
		} else {
			var a = "<table cellspacing='0' cellpadding='0' class='ng-input-button-table ng_input_button_table' id='input_button_container" + this.id + "' dir='" + ng.Language.get_dir(this.get_language()) + "'>";
			a += "<tr><td id='input_holder_td" + this.id + "'></td><td id='button_holder_td" + this.id + "'" + b + "></td></tr>";
			a += "</table>"
		}
		return a
	},
	set_button_ui_class: function (a) {
		if (ng.defined(this.p.button)) {
			this.p.button.set_ui_class(a)
		}
		this.p.button_ui_class = a;
		return this
	},
	get_button_ui_class: function (a) {
		if (ng.defined(this.p.button)) {
			return this.p.button.get_ui_class()
		}
		return this.p.button_ui_class
	}
});
ng.all_component_arr = {};
ng.close_all_component = function (b) {
	var a = [];
	if ((ng.defined(b)) && (ng.defined(ng.all_component_arr[b]))) {
		var a = ng.all_component_arr[b].get_parents_components()
	}
	a.push(b);
	ng.obj_each(ng.all_component_arr, function (d, c) {
		if (!a.has(c)) {
			if (ng.defined(d.close())) {
				d.close()
			}
		}
	})
};
ng.doc.add_event("mouseup", function (a) {
	if (a.left < 15) {
		return
	}
	if ((ng.doc.get_width() + ng.doc.get_scroll_left() - a.left) < 15) {
		return
	}
	if ((a.left - ng.doc.get_scroll_left()) < 10) {
		return
	}
	ng.close_all_component()
});
ng.doc.add_event("keyup", function (a) {
	if (a.key == "esc") {
		ng.close_all_component()
	}
});
ng.get(window).add_event("resize", function () {
	ng.obj_each(ng.all_component_arr, function (b, a) {
		if (!b.get_visible()) {
			b.reposition()
		}
	})
});
ng.ready(function () {
	(function () {
		ng.get(window).fire_event("resize")
	}.delay(250))
});
ng.Button = function (b) {
	this.p = this.create_options(b, {
		render_top: true,
		render_right: true,
		render_bottom: true,
		render_left: true,
		color: ng_config.button_color,
		over_color: ng_config.button_over_color,
		down_color: ng_config.button_down_color,
		disable_color: ng_config.button_disable_color,
		checked_color: ng_config.button_checked_color,
		current_color: null,
		text_color: ng_config.button_text_color,
		light_border: ng_config.button_light_border,
		gloss: ng_config.button_gloss,
		arrow_style: "down",
		text_length: null,
		width: null,
		text: "",
		value: null,
		icon: null,
		component: null,
		hide_text: false,
		hide_icon: false,
		hide_component: false,
		disabled: false,
		checked: false,
		stop_default: false,
		layout: "ita",
		ui_class: "",
		count: ""
	});
	this.create_events();
	this.p.enabled = !this.p.disabled;
	if (ng.type(this.p.color) == "string") {
		this.p.color = this.p.color.toLowerCase()
	}
	if (!ng.defined(this.p.over_color)) {
		this.p.over_color = this.p.color
	}
	if (!ng.defined(this.p.down_color)) {
		this.p.down_color = this.p.over_color
	}
	if (!ng.defined(this.p.checked_color)) {
		this.p.checked_color = this.p.down_color
	}
	if (!ng.defined(this.p.disable_color)) {
		if (ng.type(this.p.color) == "color") {
			this.p.disable_color = new ng.Color(this.p.color.get_hex())
		} else {
			if ((this.p.color == "transparent") || (this.p.color == "none")) {
				var a = "#cccccc"
			} else {
				var a = this.p.color
			}
			this.p.disable_color = new ng.Color(a)
		}
		this.p.disable_color.desaturate()
	}
	this.make_id("button");
	this.set_object(this.p.object);
	if (ng.defined(this.p.component)) {
		this.set_component(this.p.component)
	}
	if (ng.defined(this.p.object)) {
		this.render()
	}
};
ng.Button.inherit(ng.PlugIn);
ng.extend_proto(ng.Button, {
	has_type: "button",
	render: function (g) {
		if (ng.defined(g)) {
			this.set_object(g)
		}
		var g = this.get_object();
		var c = g.get("tag");
		if ((g.disabled) || (ng.defined(g.getAttribute("disabled")))) {
			(function () {
				this.disable()
			}.defer(this))
		}
		if (((c == "input") || (c == "button")) && (g.get("type") == "submit") && (ng.defined(g.get("form")))) {
			this.p.form = ng.get(g.get("form"));
			if ((!ng.defined(this.p.stop_default)) || (this.p.stop_default == false)) {
				this.add_event("click", function (i) {
					this.p.form.submit()
				})
			}
			if (!ng.defined(this.p.value)) {
				this.p.value = this.p.text
			}
		} else {
			if (c == "a") {
				this.p.link = g.getAttribute("href");
				this.p.target = g.get("target");
				if ((!ng.defined(this.p.stop_default)) || (this.p.stop_default == false)) {
					if ((this.p.link != "") && (this.p.link != "#")) {
						this.add_event("click", function (i) {
							if ((this.p.target != "") && (this.p.target != "_self")) {
								window.open(this.p.link, this.p.target, "")
							} else {
								location.href = this.p.link
							}
						})
					}
				}
			}
		}
		this.p.xobjEvents = new ng.InnerHtmlEvents({
			click: function (n, i) {
				this.click(i);
				i.stop()
			}.bind(this),
			focus: function (n, i) {
				this.focus(i)
			}.bind(this),
			blur: function (n, i) {
				this.blur(i)
			}.bind(this)
		});
		var a = "";
		if ((c == "input") || (c == "button")) {
			if (this.get_text() == "") {
				if (c == "button") {
					this.set_text(g.get_html())
				} else {
					this.set_text(g.value)
				}
			}
			if (this.get_value() == "") {
				this.set_value(this.get_text())
			}
			if (g.get("type").toLowerCase() == "submit") {
				a = '<div style="position:absolute; width:0px; height:0px; overflow:hidden;"><input type="submit" name="' + g.name + '" value="' + this.get_value() + '" ' + this.p.xobjEvents.get_html() + " /></div>"
			}
		} else {
			if (this.get_text() == "") {
				this.set_text(g.get_html())
			}
		}
		var k = "";
		if (a == "") {
			k = '<a href="' + this.p.link + '" ' + this.p.xobjEvents.get_html() + ">";
			a = "</a>"
		}
		var h = [];
		h.push('<span id="' + this.id + '" class="ng-button ');
		if (this.get_gloss()) {
			h.push("ng-button-gloss ")
		}
		if ((ng.defined(ng.UI)) && (this.p.ui_class != "")) {
			h.push(this.p.ui_class + " ")
		}
		h.push(ng.Language.get_dir(this.get_language()) + '" title="' + g.title + '" data-ng_skip="1" onselectstart="return false">' + k);
		if (!ng.defined(ng.UI)) {
			h.push("<div id='" + this.id + "_holder' class='ng-button-holder'><div id='" + this.id + "_bevel' class='ng-button-bevel'>");
			h.push('<table cellspacing="0" cellpadding="0" class="ng-button-table" id="' + this.id + '_maintable"><tr>');
			h.push('<td class="ng-button-icon-td" id="' + this.id + '_icon_td">');
			if (ng.defined(this.get_icon())) {
				var j = this.get_icon();
				if (this.p.hide_icon) {
					var l = ' style="display:none;" '
				} else {
					var l = ""
				}
				if (j.indexOf(".") == -1) {
					var d = j.split(",");
					h.push('<span class="' + d[0].trim() + ' ng-button-icon-span"' + l + ' id="' + this.id + '_icon">');
					for (var f = 1; f < d.length; f++) {
						h.push('<span class="' + d[f].trim() + '">')
					}
					h.push(" ");
					for (var f = 1; f < d.length; f++) {
						h.push("</span>")
					}
					h.push("</span>")
				} else {
					h.push("<img src='" + j + "' border='0' id='" + this.id + "_icon' class='ng-button-icon-img'" + l + " />")
				}
			}
			h.push('</td><td class="ng-button-text-td" id="' + this.id + '_text_td">');
			if (this.p.hide_text) {
				var l = ' style="display:none;" '
			} else {
				var l = ""
			}
			h.push("<span id='" + this.id + "_text'" + l + " class='ng-button-text-span'>" + this.get_text() + "</span>");
			h.push('</td><td id="' + this.id + '_component_td" class="ng-button-arrow-td">');
			if (ng.defined(this.get_component())) {
				if (this.p.hide_component) {
					var l = ' style="display:none;" '
				} else {
					var l = ""
				}
				h.push("<img id='" + this.id + "_component' class='ng-button-arrow-img'" + l + " />")
			}
			h.push("</td></tr></table>");
			h.push("</div></div>")
		} else {
			var l = ' style="display:none;" ';
			if (this.p.count.toString() != "") {
				l = ""
			}
			h.push('<b id="' + this.id + '_count"' + l + ' class="ng-button-count">' + this.p.count + "</b>");
			l = ' style="display:none;" ';
			var j = "";
			if (ng.defined(this.get_icon())) {
				j = this.get_icon()
			}
			if ((!this.p.hide_icon) && (j != "")) {
				l = ""
			}
			if (j.indexOf(".") == -1) {
				var d = j.split(",");
				h.push('<span class="' + d[0].trim() + ' ng-button-icon-span"' + l + ' id="' + this.id + '_icon">');
				for (var f = 1; f < d.length; f++) {
					h.push('<span class="' + d[f].trim() + '">')
				}
				h.push(" ");
				for (var f = 1; f < d.length; f++) {
					h.push("</span>")
				}
				h.push("</span>")
			} else {
				h.push('<span id="' + this.id + '_icon" class="ng-button-icon-span"' + l + ">");
				if (j == "") {
					h.push(" ")
				} else {
					h.push('<img src="' + j + '" id="' + this.id + '_icon_img" border="0" class="ng-button-icon-img" />')
				}
				h.push("</span>")
			}
			l = ' style=" display:none;" ';
			var e = this.get_text();
			if ((!this.p.hide_text) && (e != "")) {
				l = ""
			}
			h.push('<span id="' + this.id + '_text"' + l + ' class="ng-button-text-span">' + e + "</span>");
			l = ' style="display:none;" ';
			if ((ng.defined(this.get_component())) && (!this.p.hide_component)) {
				l = ""
			}
			h.push('<span id="' + this.id + '_component"' + l + ' class="ng-button-arrow"></span>')
		}
		h.push(a);
		h.push("</span>");
		ng.hold_html(h.join(""));
		if (this.p.layout != "ita") {
			var b = this.p.layout;
			this.p.layout = "ita";
			this.set_layout(b)
		}
		g.replace(this.id);
		this.set_object(ng.get(this.id));
		this.set_language(this.get_language());
		this.get_object().add_events({
			click: function (i) {
				this.click(i)
			}.bind(this),
			mouseenter: function (i) {
				this.mouseenter(i)
			}.bind(this),
			mouseleave: function (i) {
				this.mouseleave(i)
			}.bind(this),
			mousedown: function (i) {
				this.mousedown(i)
			}.bind(this),
			mouseup: function (i) {
				this.mouseup(i);
				if (ng.defined(this.get_component())) {
					i.stop()
				}
			}.bind(this)
		});
		var m = this.get_color();
		if (this.is_checked()) {
			if (ng.defined(ng.UI)) {
				ng.get(this.id).add_class("checked")
			}
			m = this.get_checked_color()
		}
		if (this.is_disabled()) {
			if (ng.defined(ng.UI)) {
				ng.get(this.id).add_class("disabled")
			}
			m = this.get_disable_color()
		}
		if (!ng.defined(ng.UI)) {
			this.apply_colors(m);
			if (!this.p.render_top) {
				this.hide_top()
			}
			if (!this.p.render_right) {
				this.hide_right()
			}
			if (!this.p.render_bottom) {
				this.hide_bottom()
			}
			if (!this.p.render_left) {
				this.hide_left()
			}
		}
		if (ng.defined(this.p.width)) {
			this.set_width(this.p.width)
		}
		return this
	},
	make: function (a, c) {
		if (!ng.defined(a)) {
			a = ng.get(document.body)
		} else {
			a = ng.get(a)
		}
		if (!ng.defined(c)) {
			c = "bottom"
		}
		var b = ng.create("a");
		a.append_element(b, c);
		this.p.stop_default = true;
		return this.render(b)
	},
	set_layout: function (n) {
		n = n.toLowerCase();
		if (n == this.p.layout) {
			return this
		}
		this.p.layout = n;
		if (n.indexOf("i") == -1) {
			n = "i" + n;
			this.hide_icon.defer(this)
		} else {
			this.show_icon.defer(this)
		}
		if (n.indexOf("t") == -1) {
			n = n.replace("i", "it");
			this.hide_text.defer(this)
		} else {
			this.show_text.defer(this)
		}
		if (n.indexOf("a") == -1) {
			n = n + "a";
			this.hide_component.defer(this)
		} else {
			this.show_component.defer(this)
		}
		n = n.replace(/[^ita\|]/g, "");
		var m = n.split("|");
		var p = "";
		if (m.length == 3) {
			p = "ng-3-rows-button"
		} else {
			if (m.length == 2) {
				if (m[0].length > 1) {
					p = "ng-2-rows-2-1-button"
				} else {
					p = "ng-2-rows-1-2-button"
				}
			}
		}
		if (ng.defined(ng.UI)) {
			var b = ng.get(this.id);
			b.remove_class("ng-3-rows-button").remove_class("ng-2-rows-2-1-button").remove_class("ng-2-rows-1-2-button");
			if (p != "") {
				ng.get(this.id).add_class(p)
			}
			n = n.replace(/\|/g, "");
			for (var h = n.length - 1; h >= 0; h--) {
				var a = n.charAt(h);
				if (a == "i") {
					b.append_element(this.id + "_icon", "top")
				} else {
					if (a == "t") {
						b.append_element(this.id + "_text", "top")
					} else {
						if (a == "a") {
							b.append_element(this.id + "_component", "top")
						}
					}
				}
			}
			return this
		}
		var l = 1;
		for (var h = 0; h < m.length; h++) {
			l = Math.max(l, m[h].length)
		}
		var o = [];
		for (var h = 0; h < m.length; h++) {
			if (m[h].length) {
				var d = o.length;
				o[d] = document.createElement("tr");
				for (var f = 0; f < m[h].length; f++) {
					var c = "";
					if (m[h].charAt(f) == "i") {
						c = this.id + "_icon_td"
					} else {
						if (m[h].charAt(f) == "t") {
							c = this.id + "_text_td"
						} else {
							if (m[h].charAt(f) == "a") {
								c = this.id + "_component_td"
							}
						}
					}
					if (c != "") {
						c = ng.get(c);
						o[d].appendChild(c);
						if (f == 0) {
							c.colSpan = l - m[h].length + 1
						}
					}
				}
			}
		}
		var g = ng.get(this.id + "_maintable");
		g.remove_class("ng-3-rows-button").remove_class("ng-2-rows-2-1-button").remove_class("ng-2-rows-1-2-button");
		if (p != "") {
			g.add_class(p)
		}
		var e = g.get_children("tbody")[0];
		e.innerHTML = "";
		for (var h = 0; h < o.length; h++) {
			e.appendChild(o[h])
		}
		return this
	},
	get_layout: function () {
		return this.p.layout
	},
	apply_colors: function (n, l, g) {
		if (ng.UI) {
			return this
		}
		if (!ng.defined(ng.get(this.id + "_holder"))) {
			return this
		}
		if (l) {
			var j = "_down"
		} else {
			var j = ""
		}
		if ((!ng.defined(g)) && (this.p.current_color == n.toString() + j)) {
			return this
		}
		this.p.current_color = n.toString() + j;
		var m = false;
		var e = false;
		if (ng.type(n) != "color") {
			if (n == "transparent") {
				var n = new ng.Color("#ffffff");
				m = true
			} else {
				if (n == "none") {
					var n = new ng.Color("#ffffff");
					e = true
				} else {
					var n = new ng.Color(n)
				}
			}
		}
		var c = n.get_hex();
		if (this.p.light_border) {
			var i = "#ffffff";
			var f = "#000000"
		} else {
			var i = "#000000";
			var f = "#ffffff"
		}
		var h = new ng.Color(n.get_hex()).mix(i, 75);
		var d = new ng.Color(n.get_hex()).mix(f, 50);
		var b = new ng.Color(n.get_hex()).mix(i, 50);
		var a = n.get_luminance();
		if (ng.defined(ng.get(this.id + "_component"))) {
			if (a >= 50) {
				ng.get(this.id + "_component").src = ng_config.assets_dir + "images/arrows/black_" + this.p.arrow_style + ".png"
			} else {
				ng.get(this.id + "_component").src = ng_config.assets_dir + "images/arrows/white_" + this.p.arrow_style + ".png"
			}
		}
		if (!ng.defined(this.get_text_color())) {
			if (a >= 50) {
				var k = "#000000"
			} else {
				var k = "#ffffff"
			}
		} else {
			if (ng.type(this.get_text_color()) == "color") {
				var k = this.get_text_color().get_hex()
			} else {
				var k = this.get_text_color()
			}
		}
		if (this.is_disabled()) {
			k = new ng.Color(k).mix(c, 50).get_hex();
			if (ng.defined(ng.get(this.id + "_component"))) {
				ng.get(this.id + "_component").set_opacity(50)
			}
		} else {
			if (ng.defined(ng.get(this.id + "_component"))) {
				ng.get(this.id + "_component").set_opacity(100)
			}
		}
		if (m) {
			this.get_object().set_styles({
				background: "none",
				"border-color": "#404040",
				color: k
			});
			ng.get(this.id + "_holder").set_style("border-color", "#404040")
		} else {
			if (e) {
				this.get_object().set_styles({
					background: "none",
					"border-color": "transparent",
					color: k
				});
				ng.get(this.id + "_holder").set_style("border-color", "transparent")
			} else {
				this.get_object().set_styles({
					"background-color": c,
					"border-color": h.get_hex(),
					color: k
				});
				ng.get(this.id + "_holder").set_style("border-color", h.get_hex())
			}
		}
		if (!ng.defined(l)) {
			ng.get(this.id + "_bevel").set_styles({
				"border-color": d.get_hex(),
				"border-bottom-color": b.get_hex(),
				"border-right-color": b.get_hex()
			})
		} else {
			ng.get(this.id + "_bevel").set_styles({
				"border-color": d.get_hex(),
				"border-top-color": b.get_hex(),
				"border-left-color": b.get_hex()
			})
		}
		return this
	},
	set_down_background: function (a) {
		if (ng.defined(ng.UI)) {
			return this
		}
		if (a) {
			this.get_object().add_class("ng-button-down");
			if (this.get_gloss()) {
				ng.get(this.id + "_holder").add_class("ng-button-holder-gloss-down")
			} else {
				ng.get(this.id + "_holder").add_class("ng-button-holder-down")
			}
		} else {
			this.get_object().remove_class("ng-button-down");
			if (this.get_gloss()) {
				ng.get(this.id + "_holder").remove_class("ng-button-holder-gloss-down")
			} else {
				ng.get(this.id + "_holder").remove_class("ng-button-holder-down")
			}
		}
		return this
	},
	over: function () {
		if (!this.p.enabled) {
			return this
		}
		if (ng.defined(ng.UI)) {
			ng.get(this.id).add_class("over")
		} else {
			this.set_down_background().apply_colors(this.get_over_color())
		}
		return this
	},
	out: function () {
		if (!this.p.enabled) {
			return this
		}
		if (ng.defined(ng.UI)) {
			ng.get(this.id).remove_class("over")
		} else {
			this.set_down_background().apply_colors(this.get_color())
		}
		return this
	},
	down: function () {
		if (!this.p.enabled) {
			return this
		}
		if (ng.defined(ng.UI)) {
			ng.get(this.id).add_class("down")
		} else {
			this.set_down_background(true).apply_colors(this.get_down_color(), true)
		}
		return this
	},
	up: function () {
		if (ng.defined(ng.UI)) {
			ng.get(this.id).remove_class("down")
		}
		return this.over()
	},
	focus: function (a) {
		if (!this.p.enabled) {
			return this
		}
		this.over();
		return this.fire_event("focus", null, a)
	},
	blur: function (a) {
		if (!this.p.enabled) {
			return this
		}
		this.out();
		return this.fire_event("blur", null, a)
	},
	click: function (a) {
		if (!this.p.enabled) {
			return this
		}
		return this.fire_event("click", null, a)
	},
	mouseenter: function (a) {
		if (!this.p.enabled) {
			return this
		}
		if (!this.p.checked) {
			this.over()
		} else {
			if (ng.defined(ng.UI)) {
				this.over()
			}
		}
		return this.fire_event("mouseenter", null, a)
	},
	mouseleave: function (a) {
		if (!this.p.enabled) {
			return this
		}
		if (!this.p.checked) {
			this.out()
		} else {
			if (ng.defined(ng.UI)) {
				this.out()
			}
		}
		return this.fire_event("mouseleave", null, a)
	},
	mousedown: function (a) {
		if (!this.p.enabled) {
			return this
		}
		if (!this.p.checked) {
			this.down()
		} else {
			if (ng.defined(ng.UI)) {
				this.down()
			}
		}
		return this.fire_event("mousedown", null, a)
	},
	mouseup: function (a) {
		if (!this.p.enabled) {
			return this
		}
		if (!this.p.checked) {
			this.up()
		} else {
			if (ng.defined(ng.UI)) {
				this.up()
			}
		}
		return this.fire_event("mouseup", null, a)
	},
	is_disabled: function () {
		return !this.p.enabled
	},
	enable: function () {
		if (this.p.enabled) {
			return this
		}
		this.p.enabled = true;
		if (ng.defined(ng.UI)) {
			ng.get(this.id).remove_class("disabled")
		} else {
			this.set_down_background().apply_colors(this.get_color())
		}
		return this.fire_event("enable")
	},
	disable: function () {
		if (!this.p.enabled) {
			return this
		}
		this.p.enabled = false;
		if (ng.defined(ng.UI)) {
			ng.get(this.id).add_class("disabled")
		} else {
			this.set_down_background().apply_colors(this.get_disable_color())
		}
		return this.fire_event("disable")
	},
	is_checked: function () {
		return this.p.checked
	},
	check: function () {
		if (this.p.checked) {
			return this
		}
		this.p.checked = true;
		if (ng.defined(ng.UI)) {
			ng.get(this.id).add_class("checked")
		} else {
			this.set_down_background(true).apply_colors(this.get_checked_color())
		}
		return this.fire_event("check")
	},
	uncheck: function () {
		if (!this.p.checked) {
			return this
		}
		this.p.checked = false;
		if (ng.defined(ng.UI)) {
			ng.get(this.id).remove_class("checked")
		}
		this.out();
		return this.fire_event("uncheck")
	},
	set_value: function (a) {
		this.p.value = a;
		if (ng.defined(ng.get("hidden_input" + this.id))) {
			ng.get("hidden_input" + this.id).value = a
		}
		return this
	},
	get_value: function () {
		return this.p.value
	},
	set_text: function (a) {
		var b = this.p.text;
		this.p.text = a;
		if (ng.defined(this.p.text_length)) {
			a = a.shorten(this.p.text_length)
		}
		if (ng.defined(ng.get(this.id + "_text"))) {
			ng.get(this.id + "_text").set_html(a);
			ng.get(this.id).title = this.p.text
		}
		if ((ng.defined(ng.UI)) && ng.defined(ng.get(this.id + "_text")) && (b == "") && (!this.p.hide_text)) {
			ng.get(this.id + "_text").set_style("display", "")
		}
	},
	get_text: function () {
		return this.p.text
	},
	set_text_style: function (b, a) {
		ng.get(this.id + "_text").set_style(b, a);
		return this
	},
	set_text_styles: function (a) {
		ng.get(this.id + "_text").set_styles(a);
		return this
	},
	get_text_element: function () {
		return ng.get(this.id + "_text")
	},
	is_text_hidden: function () {
		return (ng.get(this.id + "_text").get_style("display") == "none")
	},
	set_text_length: function (a) {
		if (a == "auto") {
			a = null
		}
		this.p.text_length = a;
		return this.set_text(this.p.text)
	},
	get_text_length: function () {
		return this.p.text_length
	},
	show_text: function () {
		if (ng.defined(ng.get(this.id + "_text"))) {
			ng.get(this.id + "_text").set_style("display", "")
		}
		return this
	},
	hide_text: function () {
		if (ng.defined(ng.get(this.id + "_text"))) {
			ng.get(this.id + "_text").set_style("display", "none")
		}
		return this
	},
	set_width: function (a) {
		if (!ng.defined(a)) {
			a = "auto"
		}
		this.p.width = a;
		this.p.object.set_style("width", a);
		return this
	},
	get_width: function () {
		if (!ng.defined(this.p.width)) {
			this.p.width = this.p.object.get_style("width").to_int()
		}
		return this.p.width
	},
	set_icon: function (e) {
		if (ng.defined(ng.UI)) {
			if (ng.defined(ng.get(this.id + "_icon_img"))) {
				ng.get(this.id + "_icon_img").remove_element()
			}
			var d = ng.create("span", {
				id: this.id + "_icon",
				className: "ng-button-icon-span"
			});
			if (e.indexOf(".") == -1) {
				var a = e.split(",");
				d.className += " " + a[0].trim();
				var c = [];
				for (var b = 1; b < a.length; b++) {
					c.push('<span class="' + a[b].trim() + '">')
				}
				c.push(" ");
				for (var b = 1; b < a.length; b++) {
					c.push("</span>")
				}
				d.set_html(c)
			} else {
				d.append_element(ng.create("img", {
					id: this.id + "_icon_img",
					className: "ng-button-icon-img",
					src: e
				}))
			}
		} else {
			if (e.indexOf(".") == -1) {
				var d = ng.create("span", {
					id: this.id + "_icon",
					className: "ng-button-icon-span"
				});
				var a = e.split(",");
				d.className += " " + a[0].trim();
				var c = [];
				for (var b = 1; b < a.length; b++) {
					c.push('<span class="' + a[b].trim() + '">')
				}
				c.push(" ");
				for (var b = 1; b < a.length; b++) {
					c.push("</span>")
				}
				d.set_html(c)
			} else {
				var d = ng.create("img", {
					id: this.id + "_icon",
					className: "ng-button-icon-img",
					src: e
				})
			}
		}
		if (this.p.hide_icon) {
			d.set_style("display", "none")
		}
		if (ng.defined(ng.get(this.id + "_icon"))) {
			ng.get(this.id + "_icon").replace(d)
		} else {
			ng.get(this.id + "_icon_td").append_element(d, "top")
		}
		this.p.icon = e;
		return this
	},
	get_icon: function () {
		return this.p.icon
	},
	get_icon_element: function () {
		if (ng.defined(ng.get(this.id + "_icon"))) {
			return ng.get(this.id + "_icon")
		}
		return null
	},
	is_icon_hidden: function () {
		if (!ng.defined(this.id + "_icon")) {
			return false
		}
		return (ng.get(this.id + "_icon").get_style("display") == "none")
	},
	hide_icon: function () {
		if (ng.defined(ng.get(this.id + "_icon"))) {
			ng.get(this.id + "_icon").set_style("display", "none")
		}
		return this
	},
	show_icon: function () {
		if (ng.defined(ng.get(this.id + "_icon"))) {
			ng.get(this.id + "_icon").set_style("display", "")
		}
		return this
	},
	set_count: function (a) {
		if (!ng.defined(ng.get(this.id + "_count"))) {
			return this
		}
		if (!ng.defined(a)) {
			a = ""
		}
		this.p.count = a;
		ng.get(this.id + "_count").set_html(a);
		if (a == "") {
			ng.get(this.id + "_count").set_style("display", "none")
		} else {
			ng.get(this.id + "_count").set_style("display", "")
		}
		return this
	},
	get_count: function () {
		return this.p.count
	},
	set_component: function (b) {
		if (ng.defined(ng.UI)) {
			if (!this.p.hide_component) {
				ng.get(this.id + "_component").set_style("display", "")
			}
			if (b.get_button_ui_class() != "") {
				ng.get(this.id).add_class(b.get_button_ui_class())
			}
		} else {
			if ((ng.defined(ng.get(this.id + "_component_td"))) && (!ng.defined(ng.get(this.id + "_component")))) {
				var a = ng.create("img", {
					id: this.id + "_component",
					className: "ng-button-arrow-img"
				});
				if (this.p.hide_component) {
					a.set_style("display", "none")
				}
				ng.get(this.id + "_component_td").append_element(a)
			}
		}
		if (!ng.defined(this.comp_click_event)) {
			this.comp_click_event = function (c) {
				if (ng.defined(this.p.component.get_input())) {
					this.p.component.toggle()
				} else {
					this.p.component.toggle(this)
				}
				c.stop_default()
			};
			this.comp_open_event = function () {
				this.check()
			}.bind(this);
			this.comp_close_event = function () {
				this.uncheck()
			}.bind(this)
		} else {
			this.remove_event("click", this.comp_click_event);
			if (ng.defined(this.p.component)) {
				this.p.component.remove_events({
					open: this.comp_open_event,
					close: this.comp_close_event
				})
			}
		}
		this.add_event("click", this.comp_click_event);
		this.p.component = b;
		this.p.component.add_events({
			open: this.comp_open_event,
			close: this.comp_close_event
		});
		if (ng.defined(ng.get(this.id))) {
			this.out()
		}
		if (ng.defined(ng.UI)) {
			ng.get(this.id).remove_class("over");
			return this
		} else {
			return this.apply_colors(this.get_color(), null, true)
		}
	},
	remove_component: function () {
		if (ng.defined(ng.UI)) {
			if (ng.defined(ng.get(this.id + "_component"))) {
				ng.get(this.id + "_component").set_style("display", "none")
			}
		} else {
			if (ng.defined(ng.get(this.id + "_component"))) {
				ng.get(this.id + "_component").remove()
			}
		}
		if (ng.defined(this.comp_click_event)) {
			this.remove_event("click", this.comp_click_event);
			if (ng.defined(this.p.component)) {
				this.p.component.remove_events({
					open: this.comp_open_event,
					close: this.comp_close_event
				})
			}
		}
		if (ng.defined(this.p.component)) {
			this.p.component.set_button(null)
		}
		return this
	},
	get_component: function () {
		return this.p.component
	},
	get_component_element: function () {
		if (ng.defined(ng.get(this.id + "_component"))) {
			return ng.get(this.id + "_component")
		}
		return null
	},
	is_component_hidden: function () {
		if (!ng.defined(this.id + "_component")) {
			return false
		}
		return (ng.get(this.id + "_component").get_style("display") == "none")
	},
	hide_component: function () {
		if (ng.defined(ng.get(this.id + "_component"))) {
			ng.get(this.id + "_component").set_style("display", "none")
		}
		return this
	},
	show_component: function () {
		if (ng.defined(ng.get(this.id + "_component"))) {
			ng.get(this.id + "_component").set_style("display", "")
		}
		return this
	},
	set_gloss: function (a) {
		this.p.gloss = a;
		if (a) {
			this.get_object().add_class("ng-button-gloss")
		} else {
			this.get_object().remove_class("ng-button-gloss")
		}
		return this
	},
	get_gloss: function () {
		return this.p.gloss
	},
	set_color: function (a) {
		this.p.color = a;
		return this.out()
	},
	get_color: function () {
		return this.p.color
	},
	set_over_color: function (a) {
		this.p.over_clr = a;
		return this.out()
	},
	get_over_color: function () {
		return this.p.over_color
	},
	set_down_color: function (a) {
		this.p.down_color = a;
		return this.out()
	},
	get_down_color: function () {
		return this.p.down_color
	},
	set_disable_color: function (a) {
		this.p.disable_color = a;
		return this.out()
	},
	get_disable_color: function () {
		return this.p.disable_color
	},
	set_checked_color: function (a) {
		this.p.checked_color = a;
		return this.out()
	},
	get_checked_color: function () {
		return this.p.checked_color
	},
	set_text_color: function (a) {
		this.p.text_color = a;
		return this.out()
	},
	get_text_color: function () {
		return this.p.text_color
	},
	set_arrow_style: function (a) {
		this.p.arrow_style = a;
		return this.out()
	},
	get_arrow_style: function () {
		return this.p.arrow_style
	},
	hide_borders: function () {
		return this.hide_top().hide_left().hide_right().hide_bottom()
	},
	show_borders: function () {
		return this.show_top().show_left().show_right().show_bottom()
	},
	hide_top: function () {
		this.get_object().set_style("border-top-width", "0px");
		return this
	},
	show_top: function () {
		this.get_object().set_style("border-top-width", "1px");
		return this
	},
	hide_bottom: function () {
		this.get_object().set_style("border-bottom-width", "0px");
		return this
	},
	show_bottom: function () {
		this.get_object().set_style("border-bottom-width", "1px");
		return this
	},
	hide_left: function () {
		ng.get(this.id + "_holder").set_style("border-left-width", "0px");
		return this
	},
	show_left: function () {
		ng.get(this.id + "_holder").set_style("border-left-width", "1px");
		return this
	},
	hide_right: function () {
		ng.get(this.id + "_holder").set_style("border-right-width", "0px");
		return this
	},
	show_right: function () {
		ng.get(this.id + "_holder").set_style("border-right-width", "1px");
		return this
	},
	set_ui_class: function (a) {
		if (this.p.ui_class != "") {
			this.get_object().remove_class(this.p.ui_class)
		}
		this.p.ui_class = a;
		this.get_object().add_class(a)
	},
	get_ui_class: function () {
		return this.p.ui_class
	},
	set_link: function (a) {
		this.p.link = a;
		return this
	},
	get_link: function () {
		return this.p.link
	}
});
ng.Language.set_language('en', {
	direction: 'ltr',
	
	numbers: ['0','1','2','3','4','5','6','7','8','9'],
	numbers_ordinal: ['st', 'nd', 'rd', 'th'],
	
	date: {
		date_format: 'm/d/Y',
		time_format: 'h:i A',
		
		days:{
			'char':['S','M','T','W','T','F','S'],
			short:['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
			mid:['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],
			'long':['Domingo','Lunes','Martes','Miercoles','Juves','Viernes','Sabado']
		},
		months:{
			short:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
			'long':['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
		},
		am_pm:{
			lowercase:['am','pm'],
			uppercase:['AM','PM']
		}
	},
	
	yes: 'Yes',
	no: 'No',
	
	'open': 'Abrir',
	'close': 'Cerrar',
	clear: 'Limpiar'
});
ng.Language.set_language('en', {
	// calendar component
	view_selected_dates:'Ver Fechas Seleccionadas',
	hide_selected_dates:'Ocultar Fechas'
});