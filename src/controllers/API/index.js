/* eslint-disable no-param-reassign */

import Config from '../../config/index';
import Remote from '../../utils/remote';
import {resolver} from '../../utils/utils';

// let AuthProcessor = null

const dummier = (value, t = 50) => resolver.delayed(t, value);

class RemoteMocker extends Remote {
	constructor(props) {
		super(props);
		this.methods = {
			query: this.query,
		};
	}

	request(params) {
		if (!this[params.mock]) console.log(params.mock);
		if (params.mock) params.predefinedReply = this.methods[params.mock](params.data);
		return super.request(params);
	}


	query() {
		return dummier({
			val1: 'val1', val2: 'val2',
		}, 1000);
	}
}

class AuthAPIMethods extends RemoteMocker {
	request(params, reattempt = 0) {
		if (!params.noauth) {
			// ? авторизация пока не требуется
			// let token = params.withToken || AuthProcessor.getAccessToken()
			// if (!token && reattempt < 50)
			//     return this.updateTokens().then(() => this.request(params, (reattempt+1)))
			// params.headers = {...params.headers, Authorization: 'Bearer ' + token}

			params.headers = {
				...params.headers,
			};

			// if (token === 'mock')
			// 	params.mock = params.what;
		}
		return super.request(params);
	}
	// updateTokens() {
	//     return this.request({
	//         withToken: AuthProcessor.getRefreshToken(),
	//         what: 'auth.refresh_token'
	//     }).then(({access_token, refresh_token}) => {
	//         AuthProcessor.setRefreshToken(refresh_token)
	//         AuthProcessor.setAccessToken(access_token)
	//         return true
	//     })
	// }
	// setAuthProcessor(authProcessor) {
	//     AuthProcessor = authProcessor
	// }
}

class APIMethods extends AuthAPIMethods {
	query() {
		return this.request({
			what: 'query',
			method: 'POST', // 'GET'
			data: {
			}, // query params
		}).then(({val1, val2}) => ({
			val1, val2,
		}));
	}
}

const API = new APIMethods({
	method: 'POST',
	data: {
	},
	processParams: (p) => {
		p.what = Config.API + p.what;
		p.context = p;
		return p;
	},
	preprocessResponse: resp => resp.json(),
	processResponse(resp) {
		// ? общий обработчик серверных ответов, например показывать юзеру алерт, если сервер прислал какую-то ошибку

		return resp;
	},
	success: null,
	fail(err) {
		// ? обработка фейла запроса

		// if (this.silent) throw err;
		// if (err instanceof XRuntime && (err.getCode() === 'API ERROR' || err.getCode() === 'AUTH ERROR')) {
		// 	if (err.message) {
		// 		Alert.alert(...(typeof err.message === 'string' ? [err.message] : err.message));
		// 	}
		// } else if (err.message && err.message.indexOf('status 504') !== -1) {
		// 	Alert.alert('Время ожидания ответа от сервера истекло', 'Проверьте подключение к интернету и попробуйте еще раз');
		// } else if (err.message && (err.message === 'Network request failed' || err.message === 'Failed to fetch' || err.message.indexOf('NetworkError') !== -1 || err._code === 'network')) {
		// 	Alert.alert('Не удалось соединиться с сервером', 'Проверьте подключение к интернету');
		// } else {
		// 	Alert.alert('Произошла неизвестная ошибка', 'Свяжитесь с администратором');
		// }
		throw err;
	},
	complete: null,
	silent: false,
	jsonData: true,
	timeout: 0,
	headers: {
		'Content-Type': 'application/json',
	},
	context: null,
});

module.exports = API;
