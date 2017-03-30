# TapSquire

TapSquire is an extremely small and simple tap/click helper used to avoid ghost clicks when both touch and mouse event listeners are applied to the same element.
It is very flexible as it simply wraps your event handler.
It works by preventing non-touch events from firing (within the default time threshold of 300ms) after touchstart or touchend events.
This preserves the ability to touch and drag from an element with a touchstart event listener.

## Usage ##

Download the minified library and include it in your html.

```html
<script src="scripts/tapSquire.min.js"></script>
```

Wrap your event handler using TapSquire.

```javascript
var onTap = new TapSquire().wrapHandler(function (event, customArg1, customArg2) {
    console.log('tapped!');
}, ['customArg1', 'customArg2']);

var element = document.getElementById('tapElement');
element.addEventListener('touchstart', onTap);
element.addEventListener('click', onTap);
```

Configure TapSquire's time threshold.

```javascript
TapSquire.timeThreshold = 500;
```