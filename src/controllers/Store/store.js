/* eslint-disable */

const { XCompile } = require('../../utils/throwables.js');
const { fromjson, tojson, log } = require('../../utils/utils.js');

const Storages = Object.create(null);
Storages.init = () => new Promise(ok => init(ok));
Storages.register = (name) => {
	if (initialized) { throw new XCompile(`Cannot register store after init() call: ${name}`); }
	if (models[name]) { throw new XCompile(`Store already registered: ${name}`); }
	models[name] = null;
};

export default Storages;

class Store {
	constructor(name) {
		if (!models.hasOwnProperty(name)) { throw new XCompile(`Unknown Store: ${name}`); }
		this.name = name;
	}
	get(key, def = null) {
		const saved = models[this.name][key];
		if (!saved || typeof saved !== 'object' || saved.v === undefined) { return def; }
		return saved.v;
	}
	set(key, value) {
		models[this.name][key] = {
			v: value,
			t: (new Date()).getTime(),
		};
		updatedModels[this.name] = true;
		clearTimeout(syncTimeout);
		syncTimeout = setTimeout(sync, syncDebounceTime);
	}
	dump() {
		return models[this.name];
	}
	clear() {
		models[this.name] = Object.create(null);
		updatedModels[this.name] = true;
		sync();
	}
}

function init(cb) {
	const callback = () => {
		Storages.areReady = true;
		cb && cb();
	};
	let count = Object.keys(models).length;
	const parse = (name, result) => {
		let value;
		if (!result) { value = Object.create(null); } else {
			try {
			/**
                 * @type {{data:Object}}
                 */
				const wrapper = fromjson(result);
				value = wrapper.data;
			} catch (_) {
				value = Object.create(null);
			}
		}
		if (!value || typeof value !== 'object') { value = Object.create(null); }
		models[name] = value;
		const storage = new Store(name);
		Storages[name] = () => storage;
		count--;
		if (count === 0) {
			initialized = true;
			callback && callback();
		}
	};
	let exist;
	for (const name in models) {
		if (models.hasOwnProperty(name)) {
			try {
				parse(name, localStorage.getItem(getKey(name)));
			} catch (e) {
				parse(name, null);
			}
			updatedModels[name] = false;
		}
		exist = true;
	}
	if (!exist) {
		initialized = true;
		callback && callback();
	}
}
let initialized = false;
const syncDebounceTime = 10;
let syncTimeout = null;
const updatedModels = Object.create(null);
function sync() {
	for (const name in models) {
		if (updatedModels[name]) {
			updatedModels[name] = false;
			log(`Updating Store ${name}`);
			localStorage.setItem(
				getKey(name),
				tojson({
					data: models[name],
				}),
			);
		}
	}
}
const persistentKeyPrefix = '-sbc-dev-';
function getKey(name) {
	return persistentKeyPrefix + name;
}

const models = {};
