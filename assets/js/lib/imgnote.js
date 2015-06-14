///#source 1 1 /assets/js/lib/imgnote/jquery.fs.zoetrope.js
/* 
 * Zoetrope v3.0.4 - 2015-04-04 
 * A requestAnimationFrame polyfill and jQuery Animation shim. Part of the Formstone Library. 
 * http://classic.formstone.it/zoetrope/ 
 * 
 * Copyright 2015 Ben Plum; MIT Licensed 
 */ 

/*
 * Request Animation Frame Polyfill originally by Paul Irish <https://gist.github.com/paulirish/1579671>
 */
;(function(window) {
	"use strict";

	var time = 0,
		vendors = ['webkit', 'moz'];

	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
		window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
	}

	window.nativeRAF = (typeof window.requestAnimationFrame !== "undefined");

	if (!window.nativeRAF) {
		window.requestAnimationFrame = function(callback, element) {
			var now = new Date().getTime(),
				diff = Math.max(0, 16 - (now - time)),
				id = window.setTimeout(function() {
					callback(now + diff);
				}, diff);

			time = now + diff;

			return id;
		};

		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
})(this);

/*
 * jQuery Animation Shim originally by Corey Frang <https://github.com/gnarf37/jquery-requestAnimationFrame>
 */
;(function($, window) {
	"use strict";

	var animating = false;

	function raf() {
		if (animating) {
			window.requestAnimationFrame(raf);
			jQuery.fx.tick();
		}
	}

	if (!window.nativeRAF) {
		$.fx.timer = function( timer ) {
			if (timer() && $.timers.push(timer) && !animating) {
				animating = true;
				raf();
			}
		};

		$.fx.stop = function() {
			animating = false;
		};
	}
})(jQuery, this);
///#source 1 1 /assets/js/lib/imgnote/jquery.mousewheel.js
/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

///#source 1 1 /assets/js/lib/imgnote/toe.js
/*!
 * toe.js
 * version 3.0.6
 * author: Damien Antipa
 * https://github.com/dantipa/toe.js
 */
(function ($, window, undefined) {

    var state,
        gestures = {},
        isTouch = 'ontouchstart' in window,
        touch = { /** @lends $.toe */

            /**
             * flag to indicate if the touch handling is
             * @type {Boolean}
             */
            active: false,

            /**
             * turns on the tracking of touch events
             * will implicitly be called when including
             */
            on: function () {
                $(document).on('touchstart MSPointerDown pointerdown', touchstart)
                    .on('touchmove MSPointerMove MSPointerHover pointermove', touchmove)
                    .on('touchend touchcancel MSPointerUp MSPointerCancel pointerup pointercancel', touchend);

                touch.active = true;
            },

            /**
             * turns off the tracking of touch events
             */
            off: function () {
                $(document).off('touchstart MSPointerDown pointerdown', touchstart)
                    .off('touchmove MSPointerMove MSPointerHover pointermove ', touchmove)
                    .off('touchend touchcancel MSPointerUp MSPointerCancel pointerup pointercancel', touchend);

                touch.active = false;
            },

            /**
             * track new gesture
             *
             * @param  {String} namespace for the gesture
             * @param  {Object} gesture handlers for the touch events
             * @param  {Function} gesture.touchstart
             * @param  {Function} gesture.touchmove
             * @param  {Function} gesture.touchend
             */
            track: function (namespace, gesture) {
                gestures[namespace] = gesture;
            },

            /**
             * returns normalized event parameters
             * @param  {Event} event
             * @param  {Object} extra additional parameters to add
             * @return {Object}
             */
            addEventParam: function (event, extra) {
                var $t = $(event.target),
                    pos = $t.offset(),
                    param = {
                        pageX: event.point[0].x,
                        pageY: event.point[0].y,
                        offsetX: pos.left - event.point[0].x,
                        offsetY: pos.top - event.point[0].y
                    };

                return $.extend(param, extra);
            },

            /**
             * normalizes a Event object for internal usage
             * @param  {Event} event original event object
             * @return {Object}
             */
            Event: function (event) { // normalizes and simplifies the event object
                var normalizedEvent = {
                    type: event.type,
                    timestamp: new Date().getTime(),
                    target: event.target,   // target is always consistent through start, move, end
                    point: []
                };

                var points = [];
                // Touch
                if (event.type.indexOf('touch') > -1) {
                    points = event.changedTouches || event.originalEvent.changedTouches || event.touches || event.originalEvent.touches;
                } else
                // MSPointer
                if (event.type.match(/.*?pointer.*?/i)) {
                    points = [event.originalEvent];
                }

                $.each(points, function (i, e) {
                    normalizedEvent.point.push({x: e.pageX, y: e.pageY});
                });

                return normalizedEvent;
            },

            /**
             * creates cross event a new state object
             * @param  {Object} start point object
             * @return {Object}
             */
            State: function (start) {
                var p = start.point[0];

                return {
                    start: start,
                    move: [],
                    end: null
                };
            },

            /**
             * Math methods for point arithmetic
             * @type {Object}
             */
            calc: {
                /**
                 * calculates the passed time between two points
                 * @param  {Object} start
                 * @param  {Object} end
                 * @return {Number} passed time in ms
                 */
                getDuration: function (start, end) {
                    return end.timestamp - start.timestamp;
                },

                /**
                 * calculates the distance between two points
                 * @param  {Object} start
                 * @param  {Object} end
                 * @return {Number} distance in px
                 */
                getDistance: function (start, end) {
                    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                },

                /**
                 * calculates the angle between two points
                 * @param  {Object} start
                 * @param  {Object} end
                 * @return {Number} in degree
                 */
                getAngle: function (start, end) {
                    return Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
                },

                /**
                 * returns the direction of a movement based on an angle
                 * @param  {Number} angle
                 * @return {String} 'up', 'down', 'left', 'right' or 'unknown'
                 */
                getDirection: function (angle) {
                    return angle < -45 && angle > -135 ? 'up' :
                        angle >= -45 && angle <= 45 ? 'right' :
                            angle >= 45 && angle < 135 ? 'down' :
                                angle >= 135 || angle <= -135 ? 'left' :
                                    'unknown';
                },

                /**
                 * returns the scale of a transformation
                 * @param  {Object} start
                 * @param  {Object} move
                 * @return {Number}
                 */
                getScale: function (start, move) {
                    var sp = start.point,
                        mp = move.point;

                    if (sp.length === 2 && mp.length === 2) { // needs to have the position of two fingers
                        return (Math.sqrt(Math.pow(mp[0].x - mp[1].x, 2) + Math.pow(mp[0].y - mp[1].y, 2)) / Math.sqrt(Math.pow(sp[0].x - sp[1].x, 2) + Math.pow(sp[0].y - sp[1].y, 2))).toFixed(2);
                    }

                    return 0;
                },

                /**
                 * calculates the rotation angle
                 * @param  {Object} start
                 * @param  {Object} move
                 * @return {Number} in degree
                 */
                getRotation: function (start, move) {
                    var sp = start.point,
                        mp = move.point;

                    if (sp.length === 2 && mp.length === 2) {
                        return ((Math.atan2(mp[0].y - mp[1].y, mp[0].x - mp[1].x) * 180 / Math.PI) - (Math.atan2(sp[0].y - sp[1].y, sp[0].x - sp[1].x) * 180 / Math.PI)).toFixed(2);
                    }

                    return 0;
                }
            }

        }; // touch obj

    /**
     * loops over all gestures
     * @private
     * @param  {String} type the handler's name
     * @param  {Event} event
     * @param  {Object} state
     * @param  {Obejcect} point
     */
    function loopHandler(type, event, state, point) {
        $.each(gestures, function (i, g) {
            g[type].call(this, event, state, point);
        });
    }

    /**
     * @private
     * @param  {Object} event
     */
    function touchstart(event) {
        var start = touch.Event(event);
        state = touch.State(start); // create a new State object and add start event

        loopHandler('touchstart', event, state, start);
    }

    /**
     * @private
     * @param  {Object} event
     */
    function touchmove(event) {
        if (!state) { return; }

        var move = touch.Event(event);
        state.move.push(move);

        loopHandler('touchmove', event, state, move);
    }

    /**
     * @private
     * @param  {Object} event
     */
    function touchend(event) {
        var end = touch.Event(event);
        state.end = end;

        loopHandler('touchend', event, state, end);
    }

    touch.on();

    // add to namespace
    $.toe = touch;

}(jQuery, this));
(function ($, touch, window, undefined) {

    var namespace = 'swipe', cfg = {
        distance: 40, // minimum
        duration: 1200, // maximum
        direction: 'all'
    };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            state[namespace] = {
                finger: start.point.length
            };
        },
        touchmove: function (event, state, move) {
            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;
        },
        touchend: function (event, state, end) {
            var opt = $.extend(cfg, event.data),
                duration,
                distance;

            // calc
            duration = touch.calc.getDuration(state.start, end);
            distance = touch.calc.getDistance(state.start.point[0], end.point[0]);

            // check if the swipe was valid
            if (duration < opt.duration && distance > opt.distance) {

                state[namespace].angle = touch.calc.getAngle(state.start.point[0], end.point[0]);
                state[namespace].direction = touch.calc.getDirection(state[namespace].angle);
                state[namespace].distance = distance;

                // fire if the amount of fingers match
                if (opt.direction === 'all' || state[namespace].direction === opt.direction) {
                    $(event.target).trigger($.Event(namespace, touch.addEventParam(state.start, state[namespace])));
                }
            }
        }
    });

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    var averageScreenLength = Math.sqrt(clientWidth * clientHeight);
    var relativeDistance = (2 / 100) * averageScreenLength;
    var namespace = 'tap', cfg = {
        distance: relativeDistance,
        duration: 300,
        finger: 1
    };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            state[namespace] = {
                finger: start.point.length
            };
        },
        touchmove: function (event, state, move) {
            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;
        },
        touchend: function (event, state, end) {
            var opt = $.extend(cfg, event.data),
                duration,
                distance;

            // calc
            duration = touch.calc.getDuration(state.start, end);
            distance = touch.calc.getDistance(state.start.point[0], end.point[0]);

            // check if the tap was valid
            if (duration < opt.duration && distance < opt.distance) {
                // fire if the amount of fingers match
                if (state[namespace].finger === opt.finger) {
                    $(event.target).trigger(
                        $.Event(namespace, touch.addEventParam(state.start, state[namespace]))
                    );
                }
            }
        }
    });

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    var timer, abort,
        namespace = 'taphold', cfg = {
            distance: 20,
            duration: 500,
            finger: 1
        };

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            var opt = $.extend(cfg, event.data);

            abort = false;
            state[namespace] = {
                finger: start.point.length
            };

            clearTimeout(timer);
            timer = setTimeout(function () {
                if (!abort && touch.active) {
                    if (state[namespace].finger === opt.finger) {
                        $(event.target).trigger($.Event(namespace, touch.addEventParam(start, state[namespace])));
                    }
                }
            }, opt.duration);
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data),
                distance;

            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;

            // calc
            distance = touch.calc.getDistance(state.start.point[0], move.point[0]);
            if (distance > opt.distance) { // illegal move
                abort = true;
            }
        },
        touchend: function (event, state, end) {
            abort = true;
            clearTimeout(timer);
        }
    });

}(jQuery, jQuery.toe, this));
(function ($, touch, window, undefined) {

    var namespace = 'transform', cfg = {
            scale: 0.1, // minimum
            rotation: 15
        },
        started;

    touch.track(namespace, {
        touchstart: function (event, state, start) {
            started = false;
            state[namespace] = {
                start: start,
                move: []
            };
        },
        touchmove: function (event, state, move) {
            var opt = $.extend(cfg, event.data);

            if (move.point.length !== 2) {
                return;
            }

            state[namespace].move.push(move);

            if (state[namespace].start.point.length !== 2 && move.point.length === 2) { // in case the user failed to start with 2 fingers
                state[namespace].start = $.extend({}, move);
            }

            state[namespace].rotation = touch.calc.getRotation(state[namespace].start, move);
            state[namespace].scale = touch.calc.getScale(state[namespace].start, move);

            if (Math.abs(1 - state[namespace].scale) > opt.scale || Math.abs(state[namespace].rotation) > opt.rotation) {
                if (!started) {
                    $(event.target).trigger($.Event('transformstart', state[namespace]));
                    started = true;
                }

                $(event.target).trigger($.Event('transform', state[namespace]));
            }
        },
        touchend: function (event, state, end) {
            if (started) {
                started = false;

                if (end.point.length !== 2) { // in case the user failed to end with 2 fingers
                    state.end = $.extend({}, state[namespace].move[state[namespace].move.length - 1]);
                }

                state[namespace].rotation = touch.calc.getRotation(state[namespace].start, state.end);
                state[namespace].scale = touch.calc.getScale(state[namespace].start, state.end);

                $(event.target).trigger($.Event('transformend', state[namespace]));
            }
        }
    });

}(jQuery, jQuery.toe, this));
///#source 1 1 /assets/js/lib/imgnote/imgViewer.js
/*! jQuery imgViewer - v0.7.3 - 2015-03-12
* https://github.com/waynegm/imgViewer
* Copyright (c) 2015 Wayne Mogg; Licensed MIT */
/*
 *	Add a tap and drag gesture to toe.js
 */

;(function ($, touch, window, undefined) {
	
	var namespace = 'drag', 
		cfg = {
			distance: 40 // minimum
		},
		started;
 
	touch.track(namespace, {
		touchstart: function (event, state, start) {
			started = false;
			state[namespace] = {
				finger: start.point.length,
				start: start,
				deltaX: 0,
				deltaY: 0
			};
		},
		touchmove: function (event, state, move) {
			var opt = $.extend(cfg, event.data);
		 
			// if another finger was used then increment the amount of fingers used
			state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;
		 
			var distance = touch.calc.getDistance(state.start.point[0], move.point[0]);
			if (Math.abs(1 - distance) > opt.distance) {
				if (!started) {
					$(event.target).trigger($.Event('dragstart', state[namespace]));
					started = true;
				}
				state[namespace].deltaX = (move.point[0].x - state.start.point[0].x);
				state[namespace].deltaY = (move.point[0].y - state.start.point[0].y);
				$(event.target).trigger($.Event('drag', state[namespace]));
			}
		},
		touchend: function (event, state, end) {
			if (started) {
				started = false;
			 
				var distance = touch.calc.getDistance(state.start.point[0], end.point[0]);
				if (distance > cfg.distance) {
					state[namespace].deltaX = (end.point[0].x - state.start.point[0].x);
					state[namespace].deltaY = (end.point[0].y - state.start.point[0].y);
					$(event.target).trigger($.Event('dragend', state[namespace]));
				}
			}
		}
	});
}(jQuery, jQuery.toe, this));

/*
 *	imgViewer plugin starts here
 */ 
;(function($) {
    $.widget("wgm.imgViewer", {
        options: {
            zoomStep: 0.1,
            zoom: 1,
            zoomable: true,
            onClick: null,
            onUpdate: null
        },
		
        _create: function() {
            var self = this;
            if (!this.element.is("img")) {
                $.error('imgviewer plugin can only be applied to img elements');
            }
            //		the original img element
            self.img = self.element[0];
            var $img = $(self.img);
            /*
             *		a copy of the original image to be positioned over it and manipulated to
             *		provide zoom and pan
             */
            self.zimg = $("<img/>", { "src": self.img.src }).appendTo("#content-img").wrap("<div class='viewport' id='viewport'/>");
            var $zimg = $(self.zimg);
            //		the container or viewport for the image view
            self.view = $(self.zimg).parent();
            var $view = $(self.view);
            //		the pixel coordinate of the original image at the center of the viewport
            self.vCenter = {};
            //		a flag used to decide if a mouse click is part of a drag or a proper click
            self.dragging = false;
            //		a flag used to check the target image has loaded
            self.ready = false;
            $img.on("load",function() {
                //			get and some geometry information about the image
                self.ready = true;
                var	width = $img.width(),
					height = $img.height(),
					offset = $img.offset();
                //			cache the image padding information
                self.offsetPadding = {
                    top: parseInt($img.css('padding-top'),10),
                    left: parseInt($img.css('padding-left'),10),
                    right: parseInt($img.css('padding-right'),10),
                    bottom: parseInt($img.css('padding-bottom'),10)
                };
                /*
                 *			cache the image margin/border size information
                 *			because of IE8 limitations left and right borders are assumed to be the same width 
                 *			and likewise top and bottom borders
                 */
                self.offsetBorder = {
                    x: Math.round(($img.outerWidth()-$img.innerWidth())/2),
                    y: Math.round(($img.outerHeight()-$img.innerHeight())/2)
                };
                /*
                 *			define the css style for the view container using absolute positioning to
                 *			put it directly over the original image
                 */
                var vTop = offset.top + self.offsetBorder.y + self.offsetPadding.top,
                    vLeft = offset.left + self.offsetBorder.x + self.offsetPadding.left;

                $view.css({
                    position: "absolute",
                    overflow: "hidden",
                    top: 0+"px",
                    left: 0+"px",
                    width: width+"px",
                    height: height + "px",
                    zIndex:1
                });
                //			the zoom and pan image is position relative to the view container
                $zimg.css({
                    position: "relative",
                    top: 0+"px",
                    left: 0+"px",
                    width: width+"px",
                    height: height+"px",
                    "-webkit-tap-highlight-color": "transparent"
                });
                //			the initial view is centered at the orignal image
                self.vCenter = {
                    x: width/2,
                    y: height/2
                };
                self.update();
            }).each(function() {
                if (this.complete) { $(this).load(); }
            });
            /*
             *			Render loop code during dragging and scaling using requestAnimationFrame
             */
            self.render = false;
            function startRenderLoop() {
                if (!self.render) {
                    self.render = true;
                    doRender();
                }
            }
			
            function stopRenderLoop() {
                self.render = false;
            }
			
            function doRender() {
                if (self.render) {
                    window.requestAnimationFrame(doRender);
                    self.update();
                }
            }	
            /*
             *		Event handlers
             */
            function MouseWheelHandler(ev) {
                if (self.options.zoomable) {
                    ev.preventDefault();
                    var delta = ev.deltaY ;
                    self.options.zoom -= delta * self.options.zoomStep;
                    self.update();
                }
            }
            $zimg.on("mousewheel", MouseWheelHandler);
			
			
            if (window.navigator.msPointerEnabled) {
                $zimg.on("click", function(e) {
                    e.preventDefault();
                    if (!self.dragging) {
                        self._trigger("onClick", e, self);
                    }
                });
                $zimg.on("mousedown", function(e) {
                    function endDrag(e) {
                        setTimeout(function() {	self.dragging = false; }, 0);
                        e.preventDefault();
                        stopRenderLoop();
                        $zimg.off("mousemove");
                        $zimg.off("mouseup");
                        $(document).off("mouseup");
                    }
                    if (self.options.zoomable) {
                        $(document).one("mouseup", endDrag);
                        $zimg.one("mouseup", endDrag);
                        e.preventDefault();
                        startRenderLoop();
                        var last = e;
                        $zimg.on("mousemove", function(e) {
                            e.preventDefault();
                            self.dragging = true;
                            self.vCenter.x = self.vCenter.x - (e.pageX - last.pageX)/self.options.zoom;
                            self.vCenter.y = self.vCenter.y - (e.pageY - last.pageY)/self.options.zoom;
                            last = e;
                        });
                    }
                });
            } else {
                $zimg.on('touchstart touchmove touchend', function(ev) {
                    ev.preventDefault();
                });
			
                $zimg.on( "transformstart" , function(ev) {
                    if (self.options.zoomable) {
                        ev.preventDefault();
                        self.pinchzoom = self.options.zoom;
                        startRenderLoop();
                    }
                });
                $zimg.on("transform", function(ev) {
                    if (self.options.zoomable) {
                        ev.preventDefault();
                        self.options.zoom = self.pinchzoom * ev.scale;
                    }
                });
                $zimg.on("transformend", function(ev) {
                    if (self.options.zoomable) {
                        ev.preventDefault();
                        self.options.zoom = self.pinchzoom * ev.scale;
                        stopRenderLoop();
                        self.update();
                    }
                });
                $zimg.on( "dragstart" , function(ev) {
                    if (self.options.zoomable) {
                        ev.preventDefault();
                        self.dragging = true;
                        self.dragXorg = self.vCenter.x;
                        self.dragYorg = self.vCenter.y;
                        startRenderLoop();
                    }
                });
                $zimg.on( "drag", function(ev) {
                    if (self.options.zoomable) {
                        ev.preventDefault();
                        self.vCenter.x = self.dragXorg - ev.deltaX/self.options.zoom;
                        self.vCenter.y = self.dragYorg - ev.deltaY/self.options.zoom;
                    }
                });
				
                $zimg.on( "dragend", function(ev) {
                    if (self.options.zoomable) {
                        ev.preventDefault();
                        self.dragging = false;
                        self.vCenter.x = self.dragXorg - ev.deltaX/self.options.zoom;
                        self.vCenter.y = self.dragYorg - ev.deltaY/self.options.zoom;
                        stopRenderLoop();
                        self.update();
                    }
                });
                if ($.mobile !==undefined) {
                    $zimg.on("vclick", function(e) {
                        e.preventDefault();
                        if (!self.dragging) {
                            self._trigger("onClick", e, self);
                        }
                    });
                } else {
                    $zimg.on("tap click", function(e) {
                        e.preventDefault();
                        if (!self.dragging) {
                            self._trigger("onClick", e, self);
                        }
                    });
                }
                $zimg.on("mousedown", function(e) {
                    function endDrag(e) {
                        setTimeout(function() {	self.dragging = false; }, 0);
                        e.preventDefault();
                        stopRenderLoop();
                        $zimg.off("mousemove");
                        $zimg.off("mouseup");
                        $(document).off("mouseup");
                    }
                    if (self.options.zoomable) {
                        e.preventDefault();
                        startRenderLoop();
                        var last = e;
                        $zimg.on("mousemove", function(e) {
                            e.preventDefault();
                            self.dragging = true;
                            self.vCenter.x = self.vCenter.x - (e.pageX - last.pageX)/self.options.zoom;
                            self.vCenter.y = self.vCenter.y - (e.pageY - last.pageY)/self.options.zoom;
                            last = e;
                        });
                        $(document).one("mouseup", endDrag);
                        $zimg.one("mouseup", endDrag);
                    }
                });
            }
			
            /*
             *		Window resize handler
             */
	
            $(window).resize(function() {
                /*
                 *			the aim is to keep the view centered on the same location in the original image
                 */
                if (self.ready) {
                    self.vCenter.x *=$img.width()/$view.width();
                    self.vCenter.y *= $img.height()/$view.height(); 
                    self.update();
                }
            });
        },
        /*
         *	Remove the plugin
         */  
        destroy: function() {
            var $zimg = $(this.zimg);
            $zimg.unbind("click");
            $(window).unbind("resize");
            $zimg.remove();
            $(this.view).remove();
            $.Widget.prototype.destroy.call(this);
        },
  
        _setOption: function(key, value) {
            switch(key) {
                case 'zoom':
                    if (parseFloat(value) < 1 || isNaN(parseFloat(value))) {
                        return;
                    }
                    break;
                case 'zoomStep':
                    if (parseFloat(value) <= 0 ||  isNaN(parseFloat(value))) {
                        return;
                    }
                    break;
            }
            var version = $.ui.version.split('.');
            if (version[0] > 1 || version[1] > 8) {
                this._super(key, value);
            } else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
            switch(key) {
                case 'zoom':
                    if (this.ready) {
                        this.update();
                    }
                    break;
            }
        },
		
        addElem: function(elem) {
            $(this.view).append(elem);
        },
        /*
         *	Test if a relative image coordinate is visible in the current view
         */
        isVisible: function(relx, rely) {
            var view = this.getView();
            if (view) {
                return (relx >= view.left && relx <= view.right && rely >= view.top && rely <= view.bottom);
            } else {
                return false;
            }
        },
        /*
         *	Get relative image coordinates of current view
         */
        getView: function() {
            if (this.ready) {
                var $img = $(this.img),
					width = $img.width(),
					height = $img.height(),
					zoom = this.options.zoom;
                return {
                    top: this.vCenter.y/height - 0.5/zoom,
                    left: this.vCenter.x/width - 0.5/zoom,
                    bottom: this.vCenter.y/height + 0.5/zoom,
                    right: this.vCenter.x/width + 0.5/zoom
                };
            } else {
                return null;
            }
        },
        /*
         *	Pan the view to be centred at the given relative image location
         */
        panTo: function(relx, rely) {
            if ( this.ready && relx >= 0 && relx <= 1 && rely >= 0 && rely <=1 ) {
                var $img = $(this.img),
					width = $img.width(),
					height = $img.height();
                this.vCenter.x = relx * width;
                this.vCenter.y = rely * height;
                this.update();
                return { x: this.vCenter.x/width, y: this.vCenter.y/height };
            } else {
                return null;
            }
        },
        /*
         *	Convert a relative image location to a viewport pixel location
         */  
        imgToView: function(relx, rely) {
            if ( this.ready && relx >= 0 && relx <= 1 && rely >= 0 && rely <=1 ) {
                var $img = $(this.img),
					width = $img.width(),
					height = $img.height();						
			 
                var zLeft = width/2 - this.vCenter.x * this.options.zoom;
                var zTop =  height/2 - this.vCenter.y * this.options.zoom;
                var vx = relx * width * this.options.zoom + zLeft;
                var vy = rely * height * this.options.zoom + zTop;
                return { x: Math.round(vx), y: Math.round(vy) };
            } else {						
				
                return null;
            }
        },
        /*
         *	Convert a relative image location to a page pixel location
         */  
        imgToCursor: function(relx, rely) {
            var pos = this.imgToView(relx, rely);
            if (pos) {
                var offset = $(this.img).offset();
                pos.x += offset.left + this.offsetBorder.x + this.offsetPadding.left;
                pos.y += offset.top + this.offsetBorder.y + this.offsetPadding.top;
                return pos;
            } else {
                return null;
            }
        },
        /*
         *	Convert a viewport pixel location to a relative image coordinate
         */		
        viewToImg: function(vx, vy) {
            if (this.ready) {
                var $img = $(this.img),
					width = $img.width(),
					height = $img.height();
                var zLeft = width/2 - this.vCenter.x * this.options.zoom;
                var zTop =  height/2 - this.vCenter.y * this.options.zoom;
                var relx= (vx - zLeft)/(width * this.options.zoom);
                var rely = (vy - zTop)/(height * this.options.zoom);
                if (relx>=0 && relx<=1 && rely>=0 && rely<=1) {
                    return {x: relx, y: rely};
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
		
        /*
         *	Convert a page pixel location to a relative image coordinate
         */		
        cursorToImg: function(cx, cy) {
            if (this.ready) {
                var $img = $(this.img),
					width = $img.width(),
					height = $img.height(),
					offset = $img.offset();
                var zLeft = width/2 - this.vCenter.x * this.options.zoom;
                var zTop =  height/2 - this.vCenter.y * this.options.zoom;
                var relx = (cx - offset.left - this.offsetBorder.x - this.offsetPadding.left- zLeft)/(width * this.options.zoom);
                var rely = (cy - offset.top - this.offsetBorder.y - this.offsetPadding.top - zTop)/(height * this.options.zoom);
                if (relx>=0 && relx<=1 && rely>=0 && rely<=1) {
                    return {x: relx, y: rely};
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        /*
         *	Adjust the display of the image  
         */
        update: function() {
            if (this.ready) {
                var zTop, zLeft, zWidth, zHeight,
					$img = $(this.img),
					width = $img.width(),
					height = $img.height(),
					offset = $img.offset(),
					zoom = this.options.zoom,
					half_width = width/2,
					half_height = height/2;
  
                if (zoom <= 1) {
                    zTop = 0;
                    zLeft = 0;
                    zWidth = width;
                    zHeight = height;
                    this.vCenter = { 
                        x: half_width,
                        y: half_height
                    };
                    this.options.zoom = 1;
                    zoom = 1;
                } else {
                    zTop = Math.round(half_height - this.vCenter.y * zoom);
                    zLeft = Math.round(half_width - this.vCenter.x * zoom);
                    zWidth = Math.round(width * zoom);
                    zHeight = Math.round(height * zoom);
                    /*
                     *			adjust the view center so the image edges snap to the edge of the view
                     */
                    if (zLeft > 0) {
                        this.vCenter.x = half_width/zoom;
                        zLeft = 0;
                    } else if (zLeft+zWidth < width) {
                        this.vCenter.x = width - half_width/zoom ;
                        zLeft = width - zWidth;
                    }
                    if (zTop > 0) {
                        this.vCenter.y = half_height/zoom;
                        zTop = 0;
                    } else if (zTop + zHeight < height) {
                        this.vCenter.y = height - half_height/zoom;
                        zTop = height - zHeight;
                    }
                }
                var vTop = Math.round(offset.top + this.offsetBorder.y + this.offsetPadding.top),
					vLeft = Math.round(offset.left + this.offsetBorder.x + this.offsetPadding.left);
                $(this.view).css({
                    top: vTop+"px",
                    left: vLeft+"px",
                    width: width+"px",
                    height: height+"px"
                });
                $(this.zimg).css({
                    width: width+"px",
                    height: height+"px"
                });

                var xt = -(this.vCenter.x - half_width)*zoom;
                var yt = -(this.vCenter.y - half_height)*zoom;
                $(this.zimg).css({transform: "translate(" + xt + "px," + yt + "px) scale(" + zoom + "," + zoom + ")" });
                /*
                 *		define the onUpdate option to do something after the image is redisplayed
                 *		probably shouldn't pass out the this object - need to think of something better
                 */
                this._trigger("onUpdate", null, this);
                
            }
        }

	});
})(jQuery);

///#source 1 1 /assets/js/lib/imgnote/imgNotes.js
/*! jQuery imgNotes - v0.7.5 - 2015-03-12
* https://github.com/waynegm/imgNotes
* Copyright (c) 2015 Wayne Mogg; Licensed MIT */
;(function($) {
	$.widget("wgm.imgNotes", {
		options: {
			zoom: 1,
			zoomStep: 0.1,
			zoomable: true,
			canEdit: false,
			vAll: "middle",
			hAll: "middle",
/*
 * Default callback to create a marker indicating a note location
 *	See the examples for more elaborate alternatives.
 */
			onAdd: function() {
				this.options.vAll = "bottom";
				this.options.hAll = "middle";
				return  $(document.createElement('span')).addClass("marker black").html(this.noteCount);
			},
/*
 *	Default callback when the marker is clicked and the widget has canEdit = true
 *	Opens a dialog with a textarea to write a note.
 *	See the examples for a more elaborate alternative that includes a WYSIWYG editor
 */
			onEdit: function(ev, elem) {
				var $elem = $(elem);
				$('#NoteDialog').remove();
				return $('<div id="NoteDialog"></div>').dialog({
					title: "Note Editor",
					resizable: false,
					modal: true,
					height: "300",
					width: "450",
					position: { my: "left bottom", at: "right top", of: elem},
					buttons: {
						"Save": function() {
							var txt = $('textarea', this).val();
//			Put the editied note back into the data area of the element
//			Very important that this step is included in custom callback implementations
							$elem.data("note", txt);
							$(this).dialog("close");
						},
						"Delete": function() {
							$elem.trigger("remove");
							$(this).dialog("close");
						},
						Cancel: function() {
							$(this).dialog("close");
						}
					},
					open: function() {
						$(this).css("overflow", "hidden");
						var textarea = $('<textarea id="txt" style="height:100%; width:100%;">');
						$(this).html(textarea);
//			Get the note text and put it into the textarea for editing
						textarea.val($elem.data("note"));
					}
				});				
			},
/*
 *	Default callback when the marker is clicked and the widget has canEdit = false
 *	Opens a dialog displaying the contents of the marker's note
 *	See examples for alternatives such as using tooltips.
 */
			onShow: function(ev, elem) {
				var $elem = $(elem);
				$('#NoteDialog').remove();
				return $('<div id="NoteDialog"></div>').dialog({
					modal: false,
					resizable: false,
					height: 300,
					width: 250,
					position: { my: "left bottom", at: "right top", of: elem},
					buttons: {
						"Close" : function() {
							$(this).dialog("close");
						}
					},
					open: function() {
//			Get the note text and put it into the textarea for editing
						$(this).html($elem.data("note"));
						$(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
						
					},
					close: function() {
						$(this).dialog("destroy");
					}
				});
			},
/*
 *	Default callback when the markers are repainted
 */
			onUpdateMarker: function(elem) {
				var $elem = $(elem);
				var $img = $(this.img);
				var pos = $img.imgViewer("imgToView", $elem.data("relx"), $elem.data("rely"));
				if (pos) {
					$elem.css({
						left: (pos.x - $elem.data("xOffset")),
						top: (pos.y - $elem.data("yOffset")),
						position: "absolute"
					});
				}
			},
/*
 *	Default callback when the image view is repainted
 */
			onUpdate: function() {
				var self = this;
				$.each(this.notes, function() {
					self.options.onUpdateMarker.call(self, this);
				});
			}
		},
		
		
		_create: function() {
			var self = this;
			if (!this.element.is("img")) {
				$.error('imgNotes plugin can only be applied to img elements');
			}
//		the note/marker elements
			self.notes = [];
//		the number of notes
			self.noteCount = 0;
//		the original img element
			self.img = self.element[0];
			var $img = $(self.img);
//		attach the imgViewer plugin for zooming and panning with a custon click and update callbacks
			$img.imgViewer({
							onClick: function(ev, imgv) {
								if (self.options.canEdit) {
									ev.preventDefault();
									var rpos = imgv.cursorToImg(ev.pageX, ev.pageY);
									if (rpos) {
										var elem = self.addNote(rpos.x, rpos.y);
										self._trigger("onEdit", ev, elem);
									}
								}
							},
							onUpdate: function(ev, imgv) {
								self.options.zoom = imgv.options.zoom;
								self.options.onUpdate.call(self);
							},
							zoom: self.options.zoom,
							zoomStep: self.options.zoomStep,
							zoomable: self.options.zoomable
			});
			$img.imgViewer("update");
		},
/*
 *	Remove the plugin
 */  
		destroy: function() {
			this.clear();
			$(this.img).imgViewer("destroy");
			$.Widget.prototype.destroy.call(this);
		},
		
		_setOption: function(key, value) {
			switch(key) {
				case 'vAll':
					switch(value) {
						case 'top': break;
						case 'bottom': break;
						default: value = 'middle';
					}
					break;
				case 'hAll':
					switch(value) {
						case 'left': break;
						case 'right': break;
						default: value = 'middle';
					}
					break;
			}
			var version = $.ui.version.split('.');
			if (version[0] > 1 || version[1] > 8) {
				this._super(key, value);
			} else {
				$.Widget.prototype._setOption.apply(this, arguments);
			}
			switch(key) {
				case 'zoom':
					$(this.img).imgViewer("option", "zoom", value);
					break;
				case 'zoomStep':
					$(this.img).imgViewer("option", "zoomStep", value);
					break;
				case 'zoomable':
					$(this.img).imgViewer("option", "zoomable", value);
					break;
			}
		},
/*
 *	Pan the view to be centred at the given relative image location
 */
		panTo: function(relx, rely) {
			return $(this.img).imgViewer("panTo", relx, rely);
		},
			
/*
 *	Add a note
 */
		addNote: function(relx, rely, text) {
			var self = this;
			this.noteCount++;
			var elem = this.options.onAdd.call(this);
			var $elem = $(elem);
			$(this.img).imgViewer("addElem",elem);
			$elem.data("relx", relx).data("rely", rely).data("note", text);
			
			switch (this.options.vAll) {
				case "top": $elem.data("yOffset", 0); break;
				case "bottom": $elem.data("yOffset", $elem.height()); break;
				default: $elem.data("yOffset", Math.round($elem.height()/2));
			}
			switch (this.options.hAll) {
				case "left": $elem.data("xOffset", 0); break;
				case "right": $elem.data("xOffset", $elem.width()); break;
				default: $elem.data("xOffset", Math.round($elem.width()/2));
			}
			$elem.click(function(ev) {
				ev.preventDefault();
				if (self.options.canEdit) {
					self._trigger("onEdit", ev, elem);
				} else {
					self._trigger("onShow", ev, elem);
				}
			});
			$elem.on("remove", function() {
				self._delete(elem);
			});
			this.notes.push(elem);
			$(this.img).imgViewer("update");
			return elem;
		},
/*
 *	Number of notes
 */
		count: function() {
			return this.noteCount;
		},
/*
 *	Delete a note
 */
		_delete: function(elem) {
			this.notes = this.notes.filter(function(v) { return v!== elem; });
			$(elem).remove();
			$(this.img).imgViewer("update");
		},
/*
 *	Clear all notes
 */
		clear: function() {
		    var self = this;
		    var total = self.notes.length;
		    for ( var i = 0; i < total; i++ )
		    {
		        var $this = self.notes[i];
		        $this.off();
		        $this.remove();
		    }
			self.notes=[];
			self.noteCount = 0;
		},
/*
 *	Add notes from a javascript array
 */
		import: function(notes) {
			var self = this;
			$.each(notes, function() {
				self.addNote(this.x, this.y, this.note);
			});
			$(this.img).imgViewer("update");
		},
/*
 *	Export notes to an array
 */
		export: function() {
			var notes = [];
			$.each(this.notes, function() {
				var $elem = $(this);
				notes.push({
						x: $elem.data("relx"),
						y: $elem.data("rely"),
						note: $elem.data("note")
				});
			});
			return notes;
		}
	});
})(jQuery);

