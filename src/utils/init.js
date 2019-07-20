

import Storages from '../controllers/Store/store';

function registerStorages() {
	Storages.register('app');
	return Storages.init();
}

export {registerStorages};
