
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import './Splash.scss';

import Config from '../../config/index';
import {registerStorages} from '../../utils/init';

const storagesReady = registerStorages();

const initComplete = Promise.all([
	storagesReady,
]);

export default class Splash extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
		};
	}

	componentDidMount() {
		initComplete.then(() => this.gotoApp());
	}

	gotoApp() {
		// Config.API = value ? Config.testAPI : Config.prodAPI;
		Config.API = Config.prodAPI;

		this.setState({
			redirect: true,
		});
	}

	render() {
		if (!this.state.redirect) {
			return (
				<div style={{
					textAlign: 'center', marginTop: 140,
				}}>Splash</div>
			);
		}

		return (
			<Redirect to="index.html"/>
		);
	}
}

Splash.propTypes = {
};
