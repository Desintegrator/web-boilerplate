import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import AppRouter from './entries/router/index';

import 'normalize.css';

render(
	React.createElement(
		BrowserRouter,
		null,
		React.createElement(
			AppRouter,
			null,
		),
	), // eslint-disable-next-line
	document.getElementById('application-content'),
);
