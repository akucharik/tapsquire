const touchEventType = {
    TOUCHSTART: 'touchstart',
    TOUCHEND: 'touchend'
};

const config = {
    timeThreshold: 300
};

/**
* Creates a TapSquire instance.
* 
* @class TapSquire
* @constructor
*/
class TapSquire {
    constructor () {
        this.prevTapTime = 0;
    }

    /**
    * Wraps a touch/click event handler with TapSquire magic.
    *
    * @param {Function} handler - The event handler.
    * @param {Array} params - An array of parameters to pass to the handler.
    * @returns {Function} The handler wrapped in TapSquire magic.
    */
    wrapHandler (handler, params) {
        return (e) => {
            const p = params.slice(0);
            const t = Date.now();

            p.unshift(e);

            if (e.type === touchEventType.TOUCHSTART || e.type === touchEventType.TOUCHEND || t - this.prevTapTime > TapSquire.timeThreshold) {
                handler.apply(e.target, p);
            }

            this.prevTapTime = t;
        }
    }
}

/**
* The time threshold (in milliseconds) for all ghost click handling.
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