import { Component } from 'inferno';
import { Redirect, Route } from 'inferno-router';
import authService from '../../common/services/auth.service';

export class PrivateRoute extends Component<any, any> {
	public render({ component, ...rest }, nextState, nextContext: any) {
		const TargetComponent = component;
		if (!authService.isAuthenticated()) {
			authService.setReferrer(rest.path);
		}
		return (
			<Route
				{...rest}
				render={(props) =>
					authService.isAuthenticated() ? (
						<TargetComponent {...props} />
					) : (
						<Redirect to="/auth" />
					)
				}
			/>
		);
	}
}
