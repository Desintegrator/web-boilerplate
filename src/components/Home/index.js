import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './Home.scss';
import Storages from '../../controllers/Store/store';

export default class Home extends Component {
	constructor(props) {
		super(props);

		// ? получение данных из стора
		// const test = Storages.app().get('test');
		// ? сохранение данных в сторе
		// const test = Storages.app().set('test', {val1: 123});
	}

	render() {
		return (
			<div>
                Главная страница
			</div>
		);
	}
}

Home.propTypes = {
};
