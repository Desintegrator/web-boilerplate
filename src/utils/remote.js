/**
 * Created by dev@jig-san.me
 */

/* eslint-disable */

const {
	nop, idf, timeLimitPromise, log,
} = require('./utils');
const { XRuntime } = require('./throwables');

class Remote {
	/**
     * @typedef {{}} queryParams
     * @property {string} what
     * @property {string} mode
     * @property {string} [method]
     * @property {{}} [data]
     * @property {Function} [processParams]
     * @property {Function} [preprocessResponse]
     * @property {Function} [processResponse]
     * @property {Function} [success]
     * @property {Function|Object} [fail]
     * @property {Function} [complete]
     * @property {bool} [silent]
     * @property {bool} [jsonData]
     * @property {number} [timeout]
     * @property {Object} [headers]
     * @property {Object} [context]
     */

	/**
     * @param {queryParams} params
     */
	constructor(params) {
		this._defaultParams = params;
		this._log = [];
	}
	/**
     * @param {queryParams} qparams
     */
	request(qparams) {
		let params = { ...this._defaultParams, ...qparams };
		params = params.processParams(params, this._defaultParams);
		const data = params.data;
		const logObject = {
			req: [params.what, data],
			resp: null,
		};
		this._log.push(logObject);
		log('remote request:', params.what + (params.predefinedReply ? '@predefined' : ''), data, params.headers);
		const fetchParams = {
			method: params.method,
			headers: params.headers,
		};
		if (params.mode) { fetchParams.mode = params.mode; }
		if (params.method === 'POST') { fetchParams.body = params.jsonData ? JSON.stringify(data) : data; } else {
			let sep = '?';
			for (const key in data) {
				params.what += `${sep + encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
				sep = '&';
			}
		}
		let q = params.predefinedReply || wfetch(params.what, fetchParams, params.timeout).then((resp) => {
			if (!resp.ok) {
				logObject.resp = `ERROR STATUS ${resp.status}`;
				throw new XRuntime('network', `Request ${params.what} status ${resp.status}`);
			}
			return resp;
		}).then(params.preprocessResponse);
		q = q.then((resp) => {
			if (!params.noResponseLogging) { logObject.resp = resp; } else { logObject.resp = '<RESPONSE RECEIVED>'; }
			log(
				'remote response:',
				params.what + (params.predefinedReply ? '@predefined' : ''),
				params.noResponseLogging ? '<RESPONSE RECEIVED>' : resp,
			);
			const answer = params.processResponse(resp);
			if (answer && answer.update) {
				return answer.update.then(() => this.request(qparams));
			}
			return answer;
		});
		if (params.success) { q = q.then(params.context ? params.success.bind(params.context) : params.success); }
		if (params.fail) { q = q.catch(params.context ? params.fail.bind(params.context) : params.fail); }
		if (params.complete) {
			q = q.catch(idf)
				.then(params.context ? params.complete.bind(params.context) : params.complete);
		}
		if (params.silent) { q = q.catch(nop); }
		return q;
	}
	/**
     * Get all requests
     * @returns {Array}
     */
	history() {
		return this._log;
	}
}

function wfetch(url, data, timeout = 0) {
	const q = fetch(url, data);
	return timeout <= 0 ? q : timeLimitPromise(
		timeout,
		q,
		() => new XRuntime('network', `Request ${url} took longer than ${timeout}`),
	);
}

export default Remote;
