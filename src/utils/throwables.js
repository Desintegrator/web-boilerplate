/**
 * Component of jigsan
 */

/* eslint-disable */


import {adaptBuiltin, log} from './utils';

// console.log('test2=>', test)
// console.log('test3=>', test.adaptBuiltin)

const XThrowable = adaptBuiltin(Error);

class XFlow extends XThrowable {
	constructor(value) {
		super('Flow exception');
		this._value = value;
	}
	getValue() {
		return this._value;
	}
}

class XRuntime extends XThrowable {
	constructor(code = null, message = '') {
		super(message);
		this.message = message;
		this._code = code;
		this.stack = Error.apply(this, []).stack;
		log('Exception thrown', message, code);
	}
	getCode() {
		return this._code;
	}
}

class XFatal extends XRuntime {}

class XCompile extends XFatal {
	constructor(message) {
		super('COMPILE', message);
	}
}

export default {
	XFlow,
	XRuntime,
	XFatal,
	XCompile,
};
