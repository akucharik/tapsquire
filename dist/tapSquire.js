(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TapSquire = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventType = {
    CLICK: 'click',
    MOUSE: 'mouse',
    TOUCH: 'touch',
    TOUCHSTART: 'touchstart'
};

var config = {
    timeThreshold: 300
};

/**
* Creates a TapSquire instance.
* 
* @class TapSquire
* @constructor
* @param {Element} element - The HTML element for which the TapSquire instance will manage events.
*/

var TapSquire = function () {
    function TapSquire(element) {
        _classCallCheck(this, TapSquire);

        /**
        * @property {Element} - The element to manage.
        * @readonly
        */
        this.element = element;

        /**
        * @property {String} - The type of the most recent event.
        * @readonly
        */
        this.prevEventType = '';

        /**
        * @property {Number} - The time of the most recent event.
        * @readonly
        */
        this.prevEventTime = 0;
    }

    /*
    * Destroys the TapSquire instance.
    *
    * @return {TapSquire} - The TapSquire instance.
    */


    _createClass(TapSquire, [{
        key: 'destroy',
        value: function destroy() {
            this.element = null;
        }

        /**
        * Adds an event listener with TapSquire magic.
        *
        * @param {String} type - The event type to listen for.
        * @param {Function} handler - A function to execute when the event is triggered.
        * @param {Boolean} useCapture - Indicates that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
        */ /*
           * Adds an event listener with TapSquire magic.
           *
           * @param {String} type - The event type to listen for.
           * @param {Function} handler - A function to execute when the event is triggered.
           * @param {Object} options - An object of options.
           */

    }, {
        key: 'addEventListener',
        value: function addEventListener(type, handler, useCapture) {
            this.element.addEventListener(type, this.wrapHandler(handler), useCapture);
        }

        /**
        * Wraps an event handler with TapSquire magic. Use this method if you want to pass the event handler specific parameters.
        *
        * @param {Function} handler - The event handler to be wrapped/handled by TapSquire.
        * @param {Array} [params=[]] - An array of parameters to be passed to the event handler.
        * @returns {Function} A function that manages the execution of the provided event handler.
        */

    }, {
        key: 'wrapHandler',
        value: function wrapHandler(handler) {
            var _this = this;

            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            return function (e) {
                var p = params.slice(0);
                var t = Date.now();
                var isMouseEventAfterTouchstart = _this.prevEventType === eventType.TOUCHSTART && e.type.includes(eventType.MOUSE);

                p.unshift(e);

                if (!isMouseEventAfterTouchstart && (!e.type.includes(eventType.MOUSE) && e.type !== eventType.CLICK || !_this.prevEventType.includes(eventType.TOUCH) || t - _this.prevEventTime > TapSquire.timeThreshold)) {
                    _this.prevEventType = e.type;
                    _this.prevEventTime = t;
                    handler.apply(e.target, p);
                }
            };
        }
    }]);

    return TapSquire;
}();

/**
* The time threshold (in milliseconds) within which TapSquire will prevent any non-touch events from executing the handler. Applies to all TapSquire instances.
* @name TapSquire.timeThreshold
* @static
* @property {Number}
*/


TapSquire.timeThreshold = config.timeThreshold;

/**
* The version.
* @name TapSquire.version
* @static
* @property {String}
*/
Object.defineProperty(TapSquire, 'version', {
    value: '0.1.0-alpha'
});

module.exports = TapSquire;

},{}]},{},[1])(1)
});