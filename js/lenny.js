/* ========================================================================
 * Dancing Lenny v0.0.1
 * ========================================================================
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Jacob Adelgren & Justin Leniger 
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

 	Lenny.MODES = ['bounce', 'slideFromLeft', 'random'];

 	Lenny.DEFAULTS = {
 		fontName: "Arial",
 		fontHeightPixels: 100,
 		color: "#000000",
 		canvasWidth: 800,
 		canvasHeight: 600,
 		text: "( ͡° ͜ʖ ͡°)",
 		animationType: Lenny.MODES[0]
 	};

 	Lenny.prototype._init = function (element, options) {
 		var _this = this;

 		if (!$(element).is('canvas')) {
 			throw "error: lenny.js must be attached to a canvas element.";
 		}

 		_this.options = $.extend({}, Lenny.DEFAULTS, options);
 		_this.modes = Lenny.MODES;
 		_this.physics = {};

 		_this.fontString = _this.options.fontHeightPixels.toString() + "px " + _this.options.fontName;

 		_this.intervalIDs = [];

 		_this.$el = $(element);

 		_this.ctx = _this.$el[0].getContext("2d");
 		_this.ctx.font = _this.fontString;
 		_this.ctx.fillStyle = _this.options.color;

 		_this.startAnimation();
 	};

 	Lenny.prototype.addInterval = function (intervalFunction, interval) {
 		var _this = this;

 		_this.intervalIDs.push(setInterval(intervalFunction, interval));
 	};

 	Lenny.prototype.addTimeout = function (timeoutFunction, timeout) {
 		var _this = this;

 		_this.intervalIDs.push(setTimeout(timeoutFunction, timeout));
 	}

 	Lenny.prototype.animateBounce = function () {
 		var _this = this;

 		_this.physics.V_X = 0.4;
 		_this.physics.V_Y = 0;

 		// In the canvas coordinate system, down is positive
 		_this.physics.A_Y = 0.0121;
 		_this.physics.A_X = 0;

 		_this.physics.X = _this.getTextWidth();
 		_this.physics.Y = _this.options.fontHeightPixels;

 		var millisPerFrame = 17;

 		_this.addInterval(function() {
 			_this.physics_updatePosition(millisPerFrame);
 			_this.drawFace(_this.physics.X, _this.physics.Y);
 		}, millisPerFrame);

 	};

 	Lenny.prototype.physics_updatePosition = function (timeSlice) {
 		var physics = this.physics;
 		var _this = this;

 		console.log(physics);

 		physics.X = (0.5 * physics.A_X * Math.pow(timeSlice, 2)) + (physics.V_X * timeSlice) + physics.X; // x(t) = 1/2at^2 + vt + x0
 		physics.Y = (0.5 * physics.A_Y * Math.pow(timeSlice, 2)) + (physics.V_Y * timeSlice) + physics.Y;

 		physics.V_X = (physics.A_X * timeSlice) + physics.V_X;
 		physics.V_Y = (physics.A_Y * timeSlice) + physics.V_Y;

 		var rightEdge = physics.X + (_this.getTextWidth() / 2);
 		var leftEdge = physics.X - (_this.getTextWidth() / 2); 

 		if (rightEdge > _this.options.canvasWidth || leftEdge < 0) {
 			physics.V_X = -1 * physics.V_X;
 		}

 		if (physics.Y >= _this.options.canvasHeight || physics.Y <= 0) {
 			physics.V_Y = -1 * physics.V_Y;
 		}
 	};

 	Lenny.prototype.animateRandom = function (interval) {
		var _this = this;
		
		_this.addInterval(function() { 
			_this.drawFace(Math.random() * _this.options.canvasWidth, Math.random() * _this.options.canvasHeight);
		}, interval);
	};

	Lenny.prototype.animateSlideFromLeft = function () {
		var _this = this;

		_this.addInterval(function() {

			var move = function(x, y) {
				_this.addTimeout(function() {
					_this.drawFace(x, y);
				}, 3 * x);
			};

			var y = Math.floor( Math.random() * _this.options.canvasHeight ) + 1;

			for (var i = 0; i < _this.options.canvasWidth / 2; i++ ) {
				move(i, y);	
			}
		}, 1200);
		
	};

	Lenny.prototype.clearCanvas = function () {
		var _this = this;

		_this.ctx.clearRect(0, 0, _this.options.canvasWidth, _this.options.canvasHeight);
	};

	Lenny.prototype.clearIntervals = function () {
		var _this = this;

		$.each(_this.intervalIDs, function(key, value) {
			clearInterval(value);
		});
	};

	// Draws the face, centered on x/y coordinates, positive left and down from top left corner
 	Lenny.prototype.drawFace = function (x, y) {

 		if (typeof (x) === 'undefined' || typeof (y) === 'undefined') {
 			return;
 		}

 		var _this = this;

 		_this.clearCanvas();

 		var width = _this.getTextWidth();

 		// Adjust so the face falls in the middle of the x/y coords
 		x = x - (width / 2);

 		_this.ctx.fillText(_this.options.text, x, y);
 	};

 	Lenny.prototype.getTextWidth = function () {
 		var _this = this;

 		return _this.ctx.measureText(_this.options.text).width;
 	};

 	Lenny.prototype.setMode = function (mode) {
 		var _this = this;

 		if ($.inArray(mode, _this.modes) !== -1) {
 			_this.clearIntervals();
 			_this.clearCanvas();
 			_this.options.animationType = mode;
 			_this.startAnimation();
 		}
 	};

	Lenny.prototype.startAnimation = function () {
 		var _this = this;

		switch (_this.options.animationType) {
			case 'bounce':
				_this.animateBounce();
				break;
			case 'slideFromLeft':
				_this.animateSlideFromLeft();
				break;
			case 'random':
				_this.animateSlideFromLeft();
				_this.animateRandom(200);
				break;
			default:
				_this.animateRandom(200);
				break;
		}
 	};
	
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
