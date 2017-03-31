(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TapSquire = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var touchEventType = {
    TOUCHSTART: 'touchstart',
    TOUCHEND: 'touchend'
};

var config = {
    timeThreshold: 300
};

/**
* Creates a TapSquire instance.
* 
* @class TapSquire
* @constructor
*/

var TapSquire = function () {
    function TapSquire() {
        _classCallCheck(this, TapSquire);

        this.prevTapTime = 0;
    }

    /**
    * Wraps an event handler with TapSquire magic.
    *
    * @param {Function} handler - The event handler to be wrapped/handled by TapSquire.
    * @param {Array} params - An array of parameters to be passed to the event handler.
    * @returns {Function} A function that manages the execution of the provided event handler.
    */


    _createClass(TapSquire, [{
        key: 'wrapHandler',
        value: function wrapHandler(handler, params) {
            var _this = this;

            return function (e) {
                var p = params.slice(0);
                var t = Date.now();

                p.unshift(e);

                if (e.type === touchEventType.TOUCHSTART || e.type === touchEventType.TOUCHEND || t - _this.prevTapTime > TapSquire.timeThreshold) {
                    handler.apply(e.target, p);
                }

                _this.prevTapTime = t;
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
    value: '0.1.0'
});

module.exports = TapSquire;

},{}]},{},[1])(1)
});