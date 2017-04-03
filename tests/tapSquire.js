import { 
    before,
    beforeEach, 
    describe as test, 
    it as assert } from 'mocha';
import { expect }  from 'chai';
import jsdom       from 'mocha-jsdom';
import sinon       from 'sinon';
    
test('TapSquire', () => {
    var TapSquire;
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
    jsdom()
    
    before('set up jsdom dependencies', () => {
        TapSquire = require('../dist/tapSquire.js')
    })
    
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
            emitEvent('touchstart', btn);
            expect(ts.prevEventType).to.equal('touchstart');
            
            emitEvent('touchstart', btn);
            emitEvent('mousedown', btn);
            expect(ts.prevEventType).to.equal('touchstart');
            
            emitEvent('touchend', btn);
            emitEvent('mouseup', btn);
            expect(ts.prevEventType).to.equal('touchend');
            
            emitEvent('touchstart', btn);
            emitEvent('click', btn);
            expect(ts.prevEventType).to.equal('touchstart');
            
            emitEvent('touchend', btn);
            emitEvent('click', btn);
            expect(ts.prevEventType).to.equal('touchend');
            
            timer.tick(301);
            emitEvent('mousedown', btn);
            expect(ts.prevEventType).to.equal('mousedown');

            emitEvent('mousedown', btn);
            emitEvent('mouseup', btn);
            expect(ts.prevEventType).to.equal('mouseup');
            
            emitEvent('click', btn);
            expect(ts.prevEventType).to.equal('click');
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
        assert('should prevent mouse events after touchstart', () => {
            emitEvent('touchstart', btn);
            emitEvent('mousedown', btn);
            expect(btnSpy.callCount).to.equal(1);
            
            btnSpy.reset();
            emitEvent('touchstart', btn);
            emitEvent('click', btn);
            expect(btnSpy.callCount).to.equal(1);
            
            btnSpy.reset();
            emitEvent('touchstart', btn);
            emitEvent('mousemove', btn);
            expect(btnSpy.callCount).to.equal(1);
        });
        
        assert('should prevent mouse events shortly after touchend', () => {
            emitEvent('touchend', btn);
            emitEvent('mousedown', btn);
            expect(btnSpy.callCount).to.equal(1);
            
            btnSpy.reset();
            emitEvent('touchend', btn);
            emitEvent('mouseup', btn);
            expect(btnSpy.callCount).to.equal(1);
            
            btnSpy.reset();
            emitEvent('touchend', btn);
            emitEvent('click', btn);
            expect(btnSpy.callCount).to.equal(1);
        });
        
        assert('should prevent mouse events shortly after touchmove', () => {
            emitEvent('touchmove', btn);
            emitEvent('mousemove', btn);
            emitEvent('touchmove', btn);
            emitEvent('mousemove', btn);
            expect(btnSpy.callCount).to.equal(2);
        });
    });
    
    test('allow mouse events', () => {
        assert('should allow mouse events after the time threshold', () => {
            btnSpy.reset();
            emitEvent('touchend', btn);
            timer.tick(301);
            emitEvent('mouseup', btn);
            expect(btnSpy.callCount).to.equal(2);
            
            btnSpy.reset();
            emitEvent('touchend', btn);
            timer.tick(301);
            emitEvent('click', btn);
            expect(btnSpy.callCount).to.equal(2);
            
            btnSpy.reset();
            emitEvent('touchmove', btn);
            timer.tick(301);
            emitEvent('mousemove', btn);
            expect(btnSpy.callCount).to.equal(2);
        });
        
        assert('should allow mouse events if not preceeded by a touch event', () => {
            emitEvent('mousedown', btn);
            emitEvent('mousemove', btn);
            emitEvent('mouseup', btn);
            expect(btnSpy.callCount).to.equal(3);
        });
        
        assert('should allow mousedown events if not preceeded by a touch event', () => {
            emitEvent('mousedown', btn);
            emitEvent('mousedown', btn);
            expect(btnSpy.callCount).to.equal(2);
        });
        
        assert('should allow click events if not preceeded by a touch event', () => {
            emitEvent('click', btn);
            emitEvent('click', btn);
            expect(btnSpy.callCount).to.equal(2);
        });
        
        assert('should allow mousemove events if not preceeded by a touch event', () => {
            emitEvent('mousemove', btn);
            emitEvent('mousemove', btn);
            expect(btnSpy.callCount).to.equal(2);
        });
    });
    
    test('allow all touch events', () => {
        assert('should allow subsequent touch events', () => {
            emitEvent('touchstart', btn);
            emitEvent('touchmove', btn);
            emitEvent('touchend', btn);
            expect(btnSpy.callCount).to.equal(3);
        });
    });
});