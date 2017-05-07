import { 
    before,
    beforeEach, 
    describe as test, 
    it as assert } from 'mocha';
import { expect }  from 'chai';
import jsdom       from 'mocha-jsdom';
import sinon       from 'sinon';
import TapSquire   from '../src/scripts/tapSquire';
    
test('TapSquire', () => {
    var ts;
    var btn;
    var btnSpy;
    var btnHandler;
    var btnHandlerWithParams;
    var param1 = 'param1';
    var param2 = 'param2';
    var timer;
    var emitEvent = (type, el) => {
        var e = document.createEvent('Event');
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
        ts.destroy();
        timer.restore();
    });

    test('time threshold', () => {
        assert('should intially have a time threshold of 300', () => {
            expect(TapSquire.timeThreshold).to.equal(300);
        });
        
        assert('should have a time threshold of 400', () => {
            TapSquire.timeThreshold = 400;
            expect(TapSquire.timeThreshold).to.equal(400);
        });
    });
    
    test('new instance', () => {
        assert('should set its element to the provided element', () => {
            expect(ts.element).to.equal(btn);
        });
        
        assert('should intially have a previous event time of 0', () => {
            expect(ts.prevEventTime).to.equal(0);
        });
        
        assert('should intially have a previous event type of empty string', () => {
            expect(ts.prevEventType).to.equal('');
        });
    });

    test('previous event type', () => {
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
    
    test('destroy', () => {
        assert('should prepare the instance for garbage collection', () => {
            ts.destroy();
            expect(ts.element).to.be.null;
        });
    });
    
    test('wrap handler', () => {
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
    
    test('add listener', () => {
        assert('should add an event listener of the specified type to the element', () => {
            ts.addEventListener('addShortcut', btnSpy);
            emitEvent('addShortcut', ts.element);
            expect(btnSpy.callCount).to.equal(1);
        });
    });
    
    test('prevent mouse events', () => {
        assert('should prevent mouse events after touch events', () => {
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
    
    test('allow mouse events', () => {
        assert('should allow mouse events after the time threshold', () => {
            const eventCases = [
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
        
        assert('should allow mouse events if not preceeded by a touch event', () => {
            const eventCases = [
                ['mousedown', 'mousemove', 'mouseup'],
                ['mousedown', 'mousedown'],
                ['click', 'click'],
                ['mousemove', 'mousemove']
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
    
    test('allow all touch events', () => {
        assert('should allow subsequent touch events', () => {
            const events = ['touchstart', 'touchmove', 'touchend'];
            
            events.forEach(event => {
                emitEvent(event, btn);
            });
            expect(btnSpy.callCount).to.equal(events.length);
        });
    });
});