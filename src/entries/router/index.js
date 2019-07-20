import React, {Component} from 'react';
import {
	Switch, Route, Redirect,
} from 'react-router-dom';
import routes from '../routes';

class AppRouter extends Component {
	render() {
		return (
			<div>
				<Switch>
					{routes.map(({path, component}, i) => (
						<Route key={i} path={`/${path}`} component={component}/>
					))}
					<Redirect from="/" to="splash.html"/>
				</Switch>
			</div>
		);
	}
}

export default AppRouter;
