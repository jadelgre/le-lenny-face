/* ========================================================================
 * Dancing Lenny v0.0.1
 * ========================================================================
 * The MIT License (MIT)
 * 
 * Copyright (c) [year] [fullname]
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ======================================================================== */

+function ($) {	
 	'use strict';

 	// LENNY PUBLIC CLASS DEFINITION
 	// =============================

 	var Lenny = function (element, options) {
 		this._init(element, options);
 	};

 	Lenny.VERSION = '0.0.1';

 	Lenny.DEFAULTS = {
 		fontName: "Arial",
 		fontHeightPixels: 100,
 		color: "#000000",
 		canvasWidth: 800,
 		canvasHeight: 600,
 		text: "( ͡° ͜ʖ ͡°)"
 	};

 	Lenny.prototype._init = function (element, options) {
 		var _this = this;

 		if (!$(element).is('canvas')) {
 			throw "error: lenny.js must be attached to a canvas element.";
 		}

 		_this.options = $.extend({}, Lenny.DEFAULTS, options);


 		_this.fontString = _this.options.fontHeightPixels.toString() + "px " + _this.options.fontName;

 		_this.$el = $(element);
 		_this.ctx = _this.$el[0].getContext("2d");
 		_this.startAnimation();
 	};

 	Lenny.prototype.startAnimation = function () {
 		var _this = this;

 		_this.drawFace(_this.options.canvasWidth / 2, _this.options.canvasHeight / 2);
 	};

 	// Draws the face, centered on x/y coordinates, positive left and down from top left corner
 	Lenny.prototype.drawFace = function(x, y) {

 		if (typeof (x) === 'undefined' || typeof (y) === 'undefined') {
 			return;
 		}

 		var _this = this;

 		_this.ctx.font = _this.fontString;

 		var width = _this.ctx.measureText(_this.options.text).width;

 		// Adjust so the face falls in the middle of the x/y coords
 		x = x - (width / 2);

 		_this.ctx.fillStyle = _this.options.color;
 		_this.ctx.fillText(_this.options.text, x, y);
 	}

 	// LENNY PlUGIN DEFINITION
 	// =======================

 	function Plugin(option) {
 		return this.each(function () {
 			var $this = $(this);
 			var data = $this.data('lenny');
 			var options = typeof option == 'object' && option;

 			if (!data) {
 				$this.data('lenny', (data = new Lenny(this, options)));
 			};
      	});
 	};

 	$.fn.lenny = Plugin;
 	$.fn.lenny.Constructor = Lenny;

}(jQuery);