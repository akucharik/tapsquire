# TapSquire

TapSquire is an extremely small and simple touch/mouse helper used to avoid ghost clicks when both touch and mouse event listeners are applied to the same element.
It works by preventing non-touch events from firing (within the default time threshold of 300ms) after touchstart or touchend events.
This preserves the ability to touch and scroll from an element with a touchstart event listener.

## Usage ##

Download the minified library and include it in your html.

```html
<script src="scripts/tapSquire.min.js"></script>
```

Wrap your event handler using TapSquire.

```javascript
var onTap = new TapSquire().wrapHandler(function (event) {
    console.log('tapped!');
});

var element = document.getElementById('tapElement');
element.addEventListener('touchstart', onTap);
element.addEventListener('click', onTap);
```

## Documentation ##

### Constructor ###
#### TapSquire() ####
Creates a TapSquire instance.

```javascript
var ts = new TapSquire();
```

### Members ###
#### timeThreshold `static, Number, default = 300` ####
The time threshold (in milliseconds) within which TapSquire will prevent any non-touch events from executing the handler.
Applies to all TapSquire instances.

```javascript
TapSquire.timeThreshold = 400;
```

### Methods ###
#### wrapHandler(handler, [params]) ####
Wraps an event handler with TapSquire magic.

##### handler `Function` #####
The event handler to be wrapped/handled by TapSquire.

##### params `Array, optional` #####
An array of parameters to be passed to the event handler.

##### returns `Function` #####
A function that manages the execution of the provided event handler.

```javascript
var onTap = new TapSquire().wrapHandler(function (event, customArg1, customArg2) {
    console.log('tapped!');
}, ['customParam1', 'customParam2']);
```