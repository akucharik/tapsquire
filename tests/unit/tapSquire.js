import { 
    before,
    beforeEach, 
    describe as test, 
    it as assert } from 'mocha';
import { expect }  from 'chai';
import jsdom       from 'mocha-jsdom';
import sinon       from 'sinon';
import TapSquire   from '../../src/scripts/tapSquire';
    
test('TapSquire:', () => {
    let ts;
    let btn;
    let btnSpy;
    let btnHandler;
    let btnHandlerWithParams;
    let param1 = 'param1';
    let param2 = 'param2';
    let timer;
    let emitEvent = (type, el) => {
        let e = document.createEvent('Event');
        e.initEvent(type, true, true);
        el.dispatchEvent(e);
        return e;
    };
    
    jsdom();
    
    beforeEach('test setup', () => {
        document.body.innerHTML = '<button id="button"></button>'
        btn = document.getElementById('button');
        ts = new TapSquire(btn);
        btnSpy = sinon.spy();
        btnHandler = ts.wrapHandler(btnSpy);
        btnHandlerWithParams = ts.wrapHandler(btnSpy, [param1, param2]);
        timer = sinon.useFakeTimers();
        
        btn.addEventListener('touchstart', btnHandler);
        btn.addEventListener('touchend', btnHandler);
        btn.addEventListener('touchmove', btnHandler);
        btn.addEventListener('mousedown', btnHandler);
        btn.addEventListener('mouseup', btnHandler);
        btn.addEventListener('click', btnHandler);
        btn.addEventListener('mousemove', btnHandler);
        btn.addEventListener('params', btnHandlerWithParams);
    });
    
    afterEach('test teardown', () => {
        TapSquire.timeThreshold = 300;
    });

    test('global time threshold', () => {
        assert('should default to 300ms', () => {
            const eventCases = [
                ['touchstart', 'mousedown'],
                ['touchstart', 'click'],
                ['touchstart', 'mousemove'],
                ['touchend', 'mousedown'],
                ['touchend', 'mouseup'],
                ['touchend', 'click'],
                ['touchmove', 'mousemove']
            ];
            
            eventCases.forEach((eventCase) => {
                btnSpy.reset();
                emitEvent(eventCase[0], btn);
                timer.tick(300);
                emitEvent(eventCase[1], btn);
                expect(btnSpy.callCount).to.equal(1);
                
                btnSpy.reset();
                emitEvent(eventCase[0], btn);
                timer.tick(301);
                emitEvent(eventCase[1], btn);
                expect(btnSpy.callCount).to.equal(2);
            });
        });
        
        assert('should be writable', () => {
            TapSquire.timeThreshold = 400;
            
            emitEvent('touchstart', btn);
            timer.tick(400);
            emitEvent('mousedown', btn);
            expect(btnSpy.callCount).to.equal(1);
            
            btnSpy.reset();
            emitEvent('touchstart', btn);
            timer.tick(401);
            emitEvent('mousedown', btn);
            expect(btnSpy.callCount).to.equal(2);
            
        });
    });
    
    test('when instantiating an instance', () => {
        assert('should have a previous event time of 0', () => {
            expect(ts.prevEventTime).to.equal(0);
        });
        
        assert('should have a previous event type of empty string', () => {
            expect(ts.prevEventType).to.equal('');
        });
    });
    
    test('when instantiating an instance with a DOM element', () => {
        assert('should reference the DOM element', () => {
            expect(ts.element).to.equal(btn);
        });
    });

    test('when events are emitted', () => {
        assert('should reflect the most recent event fired by the TapSquire instance', () => {
            const touchCases = [
                ['touchstart', 'mousedown'],
                ['touchstart', 'click'],
                ['touchstart', 'mousemove'],
                ['touchend', 'mousedown'],
                ['touchend', 'mouseup'],
                ['touchend', 'click'],
                ['touchmove', 'mousemove']
            ];
            
            touchCases.forEach(eventCase => {
                eventCase.forEach(event => {
                    emitEvent(event, btn);
                });
                expect(ts.prevEventType).to.equal(eventCase[0]);
            });
            
            timer.tick(301);
            
            const mouseEvents = ['mousedown', 'mouseup', 'click', 'mousemove'];
            
            mouseEvents.forEach(event => {
                emitEvent(event, btn);
                expect(ts.prevEventType).to.equal(event);
            });
        });
    });
    
    test('when destroying an instance', () => {
        assert('should remove the DOM element reference', () => {
            ts.destroy();
            expect(ts.element).to.be.null;
        });
    });
    
    test('when wrapping a handler', () => {
        assert('should return a function', () => {
            expect(btnHandler).to.be.a('function');
        });
        
        assert('should provide the handler with an event parameter', () => {
            const e = emitEvent('touchstart', btn);
            expect(btnSpy.getCall(0).args[0]).to.deep.equal(e);
        });
        
        assert('should provide the handler with custom parameters', () => {
            emitEvent('params', btn);
            expect(btnSpy.getCall(0).args[1]).to.equal(param1);
            expect(btnSpy.getCall(0).args[2]).to.equal(param2);
        });
    });
    
    test('when adding a listener', () => {
        assert('should add an event listener to it\'s element', () => {
            ts.addEventListener('addShortcut', btnSpy);
            emitEvent('addShortcut', ts.element);
            expect(btnSpy.callCount).to.equal(1);
        });
    });
    
    test('when mouse events are triggered promptly after touch events', () => {
        assert('should prevent mouse events', () => {
            const eventCases = [
                ['touchstart', 'mousedown'],
                ['touchstart', 'click'],
                ['touchstart', 'mousemove'],
                ['touchend', 'mousedown'],
                ['touchend', 'mouseup'],
                ['touchend', 'click'],
                ['touchmove', 'mousemove']
            ];
            
            eventCases.forEach(eventCase => {
                btnSpy.reset();
                emitEvent(eventCase[0], btn);
                emitEvent(eventCase[1], btn);
                expect(btnSpy.callCount).to.equal(1);
            });
        });
    });
    
    test('when mouse events are triggered well after touch events', () => {
        assert('should allow mouse events', () => {
            const eventCases = [
                ['touchstart', 'mousedown'],
                ['touchstart', 'click'],
                ['touchstart', 'mousemove'],
                ['touchend', 'mousedown'],
                ['touchend', 'mouseup'],
                ['touchend', 'click'],
                ['touchmove', 'mousemove']
            ];
            
            eventCases.forEach((eventCase) => {
                btnSpy.reset();
                emitEvent(eventCase[0], btn);
                timer.tick(301);
                emitEvent(eventCase[1], btn);
                expect(btnSpy.callCount).to.equal(2);
            });
        });
    });
    
    test('when mouse events are triggered and are not preceeded by touch events', () => {
        assert('should allow mouse events', () => {
            const eventCases = [
                ['mousedown', 'mousemove', 'mousemove', 'mousemove', 'mouseup'],
                ['click', 'click']
            ];
            
            eventCases.forEach(eventCase => {
                btnSpy.reset();
                eventCase.forEach(event => {
                    emitEvent(event, btn);
                });                
                expect(btnSpy.callCount).to.equal(eventCase.length);
            });
        });
    });
    
    
    test('when touch events are triggered', () => {
        assert('should allow all touch events', () => {
            const events = ['touchstart', 'touchmove', 'touchend', 'touchstart', 'touchmove', 'touchmove', 'touchmove', 'touchend'];
            
            events.forEach(event => {
                emitEvent(event, btn);
            });
            expect(btnSpy.callCount).to.equal(events.length);
        });
    });
});