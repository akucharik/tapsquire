# TapSquire

TapSquire is an extremely small and simple touch/mouse helper used to avoid ghost events when both touch and mouse event listeners are applied to the same element.
It works by preventing mouse events from firing (within the default time threshold of 300ms) after touchstart or touchend events.
This preserves the ability to touch and scroll from an element with a touchstart event listener.

## Usage ##

Download the minified library and include it in your html.

```html
<script src="scripts/tapSquire.min.js"></script>
```

Attach your event handlers using TapSquire:

```javascript
var ts = new TapSquire(document.getElementById('tapElement'));
var onTap = function (event) {
    console.log('tapped: ', event.type);
};

ts.addEventListener('touchend', onTap);
ts.addEventListener('click', onTap);
```

Or just wrap your event handlers using TapSquire (so you can pass it parameters):

```javascript
var ts = new TapSquire(document.getElementById('tapElement'));
var onTap = ts.wrapHandler(function (event, customArg1, customArg2) {
    console.log('tapped: ', event.type);
    console.log('custom args: ', customArg1, ', ', customArg2);
}, ['customParam1', 'customParam2']);

ts.element.addEventListener('touchend', onTap);
ts.element.addEventListener('click', onTap);
```

## Documentation ##

### Constructor ###
#### TapSquire(element) ####
Creates a TapSquire instance.

##### element `Element` #####
The HTML element for which the TapSquire instance will manage events.

```javascript
var ts = new TapSquire(document.getElementById('tapElement'));
```

### Members ###
#### timeThreshold `static, Number, default = 300` ####
The time threshold (in milliseconds) within which TapSquire will prevent any non-touch events from executing the handler.
Applies to all TapSquire instances.

```javascript
TapSquire.timeThreshold = 400;
```

---

#### version `static, String` ####
The version.

```javascript
TapSquire.version;
```

---

#### element `Element, readonly` ####
The HTML element for which the TapSquire instance will manage events.

```javascript
var ts = new TapSquire(document.getElementById('tapElement'));
ts.element;
```

### Methods ###
#### addEventListener(type, handler, [useCature]) ####
Adds an event listener with TapSquire magic.

##### type `String` #####
The event type to listen for.

##### handler `Function` #####
A function to execute when the event is triggered.

##### useCapture `Boolean` #####
Indicates that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.

```javascript
ts.addEventListener('touchend', onTap);
ts.addEventListener('click', onTap);
```

---

#### destroy() ####
Destroys the TapSquire instance.

```javascript
ts.destroy();
```

---

#### wrapHandler(handler, [params]) ####
Wraps an event handler with TapSquire magic.

##### handler `Function` #####
The event handler to be wrapped/handled by TapSquire.

##### params `Array, optional` #####
An array of parameters to be passed to the event handler.

##### returns `Function` #####
A function that manages the execution of the provided event handler.

```javascript
var onTap = ts.wrapHandler(function (event, customArg1, customArg2) {
    console.log('tapped: ', event.type);
    console.log('custom args: ', customArg1, ', ', customArg2);
}, ['customParam1', 'customParam2']);
```