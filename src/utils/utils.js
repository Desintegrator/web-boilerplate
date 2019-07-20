/**
 * Component of jigsan
 */

/* eslint-disable */

const { XRuntime } = require('./throwables');

const nop = () => {};
const idf = x => x;

function resolver() {
	return new Promise(ok => setTimeout(() => ok(...arguments), 0));
}

resolver.delayed = function (t, ...args) {
	return new Promise(ok => setTimeout(() => ok(...args), t));
};

resolver.handled = function () {
	let ok = null;
	let fail = null;
	const promise = new Promise((o, f) => {
		ok = o;
		fail = f;
	});
	return {
		promise,
		ok,
		fail,
	};
};

function adaptBuiltin(Class) {
	const Adapted = function () {};
	Adapted.prototype = Object.create(Class.prototype);
	Adapted.prototype.constructor = Adapted;
	return Adapted;
}

function fromjson(s) {
	try {
		return JSON.parse(s);
	} catch (_) {
		throw new XRuntime('JSON', `Couldn't parse json: ${s}`);
	}
}

function tojson(obj) {
	try {
		return JSON.stringify(obj);
	} catch (_) {
		throw new XRuntime('JSON', 'Couldn\'t create json.');
	}
}

function log(...args) {
	/**
     * @var {log} console
     */
	console.log(['###=> '], ...args);
	logHistory.push(args);
}
let logHistory = [];
log.history = () => logHistory;

function devMode() {
	return window.location.href.indexOf('localhost') >= 0;
}

class Enum {
	constructor(tag) {
		this._tag = tag;
	}
	tag() {
		return this._tag;
	}
}

function timeLimitPromise(promise, waittime, errgen) {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			reject(errgen !== undefined ? errgen() : new XRuntime('timeout', 'Promise timed out'));
		}, waittime);
		promise.then(
			(res) => {
				clearTimeout(timeoutId);
				resolve(res);
			},
			(err) => {
				clearTimeout(timeoutId);
				reject(err);
			},
		);
	});
}

function loop(n, callback) {
	return new Array(n).fill(null).map((_, i) => callback(i));
}

const rgba = (r, g, b, a) => `rgba(${r},${g},${b}, ${a})`;
const rgb = (r, g, b) => `rgb(${r},${g},${b})`;

const mixRecursive = (mem, dicts) => Object.assign(
	{},
	...dicts.map((dict) => {
		if (!dict) { return {}; }
		if (mem.indexOf(dict) > -1) { return {}; }
		mem.push(dict);
		if (Array.isArray(dict)) { return mixRecursive(mem, dict); }
		return dict;
	}),
);
const mix = (...dicts) => mixRecursive([], dicts);
// noinspection JSAnnotator
window.mix = mix;

export {
	adaptBuiltin,
	fromjson,
	tojson,
	nop,
	idf,
	Enum,
	log,
	timeLimitPromise,
	devMode,
	resolver,
	rgba,
	rgb,
	loop,
	mix,
};
