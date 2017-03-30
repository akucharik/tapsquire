import { 
    beforeEach, 
    describe as test, 
    it as assert } from 'mocha';
import { expect }  from 'chai';
import TapSquire   from '../src/scripts/tapSquire';
    
test('TapSquire', function() {
    var ts;

    beforeEach('Instantiate a new TapSquire', function() {
        ts = new TapSquire();
    });

    test('constructor', function() {
        assert('should intially have a previous tap time of 0', function() {
            expect(ts.prevTapTime).to.equal(0);
        });
    });

    test('wrapHandler', function() {
        assert('should return a function', function() {
            var handler = ts.wrapHandler(() => { console.log('handler'); });
            expect(handler).to.be.a('function');
        });
    });
});