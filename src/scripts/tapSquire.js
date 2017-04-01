const eventType = {
    CLICK: 'click',
    MOUSE: 'mouse',
    TOUCH: 'touch',
    TOUCHSTART: 'touchstart'
};

const config = {
    timeThreshold: 300
};

/**
* Creates a TapSquire instance.
* 
* @class TapSquire
* @constructor
* @param {Element} element - The HTML element for which the TapSquire instance will manage events.
*/
class TapSquire {
    constructor (element) {
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
    destroy () {
        this.element = null;
    }
    
    /**
    * Adds an event listener with TapSquire magic.
    *
    * @param {String} type - The event type to listen for.
    * @param {Function} handler - A function to execute when the event is triggered.
    * @param {Boolean} useCapture - Indicates that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
    *//*
    * Adds an event listener with TapSquire magic.
    *
    * @param {String} type - The event type to listen for.
    * @param {Function} handler - A function to execute when the event is triggered.
    * @param {Object} options - An object of options.
    */
    addEventListener (type, handler, useCapture) {
        this.element.addEventListener(type, this.wrapHandler(handler), useCapture);
    }
    
    /**
    * Wraps an event handler with TapSquire magic. Use this method if you want to pass the event handler specific parameters.
    *
    * @param {Function} handler - The event handler to be wrapped/handled by TapSquire.
    * @param {Array} [params=[]] - An array of parameters to be passed to the event handler.
    * @returns {Function} A function that manages the execution of the provided event handler.
    */
    wrapHandler (handler, params = []) {
        return (e) => {
            const p = params.slice(0);
            const t = Date.now();
            const isMouseEventAfterTouchstart = this.prevEventType === eventType.TOUCHSTART && e.type.includes(eventType.MOUSE);

            p.unshift(e);

            if (!isMouseEventAfterTouchstart && (!e.type.includes(eventType.MOUSE) && e.type !== eventType.CLICK || !this.prevEventType.includes(eventType.TOUCH) || t - this.prevEventTime > TapSquire.timeThreshold)) {
                this.prevEventType = e.type;
                this.prevEventTime = t;
                handler.apply(e.target, p);
            }
        }
    }
}

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